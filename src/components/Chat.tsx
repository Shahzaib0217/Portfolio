import { useState, useRef, useEffect } from 'react';
import Markdown from 'markdown-to-jsx';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  at: number; // ms since the conversation started
}

const LOADING_MESSAGES = [
  "Thinking...",
  "Let me pull that up...",
  "One sec...",
  "On it...",
  "Connecting the dots...",
];

const LOADING_MESSAGE_FIRST = "Pulling from my work history...";

const STARTER_PROMPTS = [
  "What did you build at Bridge?",
  "How do you get a voice agent under 2 seconds?",
  "Tell me about Zehn",
  "I'm building an AI product, can you help?",
];

const MAX_INPUT_LENGTH = 1000;

function stamp(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function Speaker({ role, at }: { role: Message['role']; at: number }) {
  return (
    <div className="flex sm:flex-col gap-2 sm:gap-0.5 pt-0.5 font-mono text-[0.68rem] uppercase tracking-wider leading-tight">
      <span className={role === 'assistant' ? 'text-[var(--color-signal)] font-medium' : 'text-[var(--color-ink)] font-medium'}>
        {role === 'assistant' ? 'Clone' : 'You'}
      </span>
      <span className="text-[var(--color-muted)]">{stamp(at)}</span>
    </div>
  );
}

/** `bare` drops the outer border, for use inside a desktop window. */
export default function Chat({ bare = false }: { bare?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  // Scroll the transcript itself, never the page.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || messages.length === 0) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ top: el.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isLoading) return;
    setLoadingMessage(LOADING_MESSAGE_FIRST);
    const interval = setInterval(() => {
      setLoadingMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
    }, 2000);
    return () => clearInterval(interval);
  }, [isLoading]);

  function elapsed() {
    if (startedAt.current === null) startedAt.current = Date.now();
    return Date.now() - startedAt.current;
  }

  function setLastAssistant(content: string) {
    setMessages(prev => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[updated.length - 1] = { ...updated[updated.length - 1], content };
      return updated;
    });
  }

  function reset() {
    abortRef.current?.abort();
    setIsLoading(false);
    setMessages([]);
    setError(null);
    startedAt.current = null;
    inputRef.current?.focus();
  }

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;
    if (text.trim().length > MAX_INPUT_LENGTH) {
      setError(`Keep your message under ${MAX_INPUT_LENGTH} characters.`);
      return;
    }

    setError(null);

    const userMessage: Message = { role: 'user', content: text.trim(), at: elapsed() };
    const newMessages = [...messages, userMessage];
    setMessages([...newMessages, { role: 'assistant', content: '', at: elapsed() }]);
    setInput('');
    setIsLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;
    let assistantText = '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(({ role, content }) => ({ role, content })) }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (response.status === 429) {
          setLastAssistant("You've sent a lot of messages. Wait a few minutes, then try again.");
          return;
        }
        throw new Error(data.error || 'Something went wrong.');
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content ?? '';
            if (!delta) continue;
            assistantText += delta;
            setLastAssistant(assistantText);
          } catch {
            // skip malformed chunks
          }
        }
      }
      if (!assistantText) setLastAssistant('I could not put an answer together. Try asking again.');
    } catch (err) {
      if (controller.signal.aborted) return;
      setLastAssistant(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setIsLoading(false);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    }
  }

  // Page-level hooks, so the homepage can drive the chat:
  //   window event `clone:ask`   detail: { text: string }  -> send as if typed (or queue in the input if a reply is streaming)
  //   window event `clone:focus` (no detail)               -> focus the input
  //   window.__clonePending (string) -> set by the page if it asked before this island hydrated; sent once on mount, then deleted
  // The ref keeps listeners pointed at the latest sendMessage/isLoading.
  const latest = useRef({ sendMessage, isLoading });
  latest.current = { sendMessage, isLoading };

  useEffect(() => {
    function ask(raw: unknown) {
      const text = typeof raw === 'string' ? raw.trim() : '';
      if (!text) return;
      if (latest.current.isLoading) {
        if (text.length > MAX_INPUT_LENGTH) {
          setError(`Keep your message under ${MAX_INPUT_LENGTH} characters.`);
          return;
        }
        setError(null);
        setInput(text);
        return;
      }
      latest.current.sendMessage(text);
    }
    const onAsk = (e: Event) => ask((e as CustomEvent<{ text?: string }>).detail?.text);
    const onFocus = () => inputRef.current?.focus({ preventScroll: true });

    window.addEventListener('clone:ask', onAsk);
    window.addEventListener('clone:focus', onFocus);

    const w = window as Window & { __clonePending?: string };
    if (typeof w.__clonePending === 'string' && w.__clonePending.trim()) ask(w.__clonePending);
    delete w.__clonePending;

    return () => {
      window.removeEventListener('clone:ask', onAsk);
      window.removeEventListener('clone:focus', onFocus);
    };
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className={`w-full h-full flex flex-col bg-[var(--color-panel)] overflow-hidden ${bare ? '' : 'rounded-2xl border border-[var(--color-rule)]'}`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-[var(--color-rule)] flex-shrink-0">
        <img
          src="/shahzaib-256.webp"
          alt=""
          width="32"
          height="32"
          className="avatar w-8 h-8"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-tight">Shahzaib, AI clone</p>
          <p className="text-xs text-[var(--color-muted)] truncate">Answers from my work history. It can get things wrong.</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={reset}
            className="ml-1 w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-wash)] transition-colors flex-shrink-0"
            aria-label="Start a new conversation"
            title="Start a new conversation"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        )}
      </div>

      {/* Transcript */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-5 py-5" aria-busy={isLoading}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-between gap-6">
            <div className="grid sm:grid-cols-[4.5rem_1fr] gap-1 sm:gap-4">
              <Speaker role="assistant" at={0} />
              <p className="text-[0.95rem] leading-relaxed">
                Hi, I'm an AI version of Shahzaib. Ask me about Bridge, the voice agents I run in production,
                Zehn, or tell me what you're building and I'll tell you how I'd approach it.
              </p>
            </div>
            <div>
              <p className="label mb-2.5">Try asking</p>
              <div className="flex flex-wrap gap-2">
                {STARTER_PROMPTS.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-[0.8rem] px-3 py-1.5 rounded-full border border-[var(--color-muted)]/50 text-[var(--color-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition-colors text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {messages.map((msg, i) => (
              <div key={i} className="grid sm:grid-cols-[4.5rem_1fr] gap-1 sm:gap-4">
                <Speaker role={msg.role} at={msg.at} />
                <div className={`text-[0.95rem] leading-relaxed min-w-0 ${msg.role === 'user' ? 'text-[var(--color-muted)]' : ''}`}>
                  {msg.content ? (
                    msg.role === 'assistant' ? (
                      <Markdown
                        options={{
                          overrides: {
                            a: {
                              component: ({ href, children }: { href?: string; children: React.ReactNode }) => (
                                <a
                                  href={href}
                                  target={href?.startsWith('mailto') ? '_self' : '_blank'}
                                  rel="noopener noreferrer"
                                  className="text-[var(--color-signal)] underline underline-offset-2"
                                >
                                  {children}
                                </a>
                              ),
                            },
                            p: { props: { className: 'mb-2 last:mb-0' } },
                            ul: { props: { className: 'list-disc pl-5 mb-2 space-y-0.5' } },
                            ol: { props: { className: 'list-decimal pl-5 mb-2 space-y-0.5' } },
                            strong: { props: { className: 'font-semibold' } },
                          },
                        }}
                      >
                        {msg.content}
                      </Markdown>
                    ) : msg.content
                  ) : (
                    <span className="inline-flex gap-2 items-center text-[var(--color-muted)]">
                      <span className="inline-flex gap-1 items-center">
                        <span className="w-1 h-3 bg-[var(--color-signal)] rounded-full animate-pulse motion-reduce:animate-none" />
                        <span className="w-1 h-4 bg-[var(--color-signal)] rounded-full animate-pulse motion-reduce:animate-none" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-2.5 bg-[var(--color-signal)] rounded-full animate-pulse motion-reduce:animate-none" style={{ animationDelay: '300ms' }} />
                      </span>
                      {loadingMessage}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="sr-only" role="status">{isLoading ? 'The clone is replying' : messages.length ? 'Reply ready' : ''}</p>

      {error && <p className="text-sm text-red-500 px-5 pb-2 flex-shrink-0">{error}</p>}

      {/* Input */}
      <div className="flex-shrink-0 border-t border-[var(--color-rule)] p-2.5 sm:p-3">
        <div className="flex items-center gap-2 rounded-xl bg-[var(--color-wash)] pl-4 pr-1.5 py-1.5 focus-within:ring-2 focus-within:ring-[var(--color-signal)] transition-shadow">
          <label htmlFor="clone-input" className="sr-only">Ask the AI clone a question</label>
          <input
            id="clone-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about my work, or describe what you're building"
            disabled={isLoading}
            maxLength={MAX_INPUT_LENGTH}
            className="flex-1 min-w-0 text-sm outline-none focus-visible:outline-none bg-transparent text-[var(--color-ink)] placeholder-[var(--color-muted)] disabled:opacity-50 py-1.5"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-lg bg-[var(--color-ink)] text-[var(--color-paper)] flex items-center justify-center disabled:opacity-25 hover:opacity-80 transition-opacity flex-shrink-0"
            aria-label="Send"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
