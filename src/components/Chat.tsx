import { useState, useRef, useEffect } from 'react';
import Markdown from 'markdown-to-jsx';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}


const STARTER_PROMPTS = [
  "Walk me through your experience",
  "What kind of AI systems have you shipped?",
  "Are you open to full-time roles?",
  "I'm building an AI product, can you help?",
];


export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showStarters, setShowStarters] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const MAX_INPUT_LENGTH = 1000;

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;
    if (text.trim().length > MAX_INPUT_LENGTH) {
      setError(`Message too long. Please keep it under ${MAX_INPUT_LENGTH} characters.`);
      return;
    }

    setShowStarters(false);
    setError(null);

    const userMessage: Message = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (response.status === 429) {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: 'assistant',
              content: "You've sent too many messages. Please wait a few minutes before trying again.",
            };
            return updated;
          });
          return;
        }
        throw new Error(data.error || 'Something went wrong.');
      }

      if (!response.body) throw new Error('No response body');

      // Streaming
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content ?? '';
              assistantText += delta;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: assistantText,
                };
                return updated;
              });
            } catch {
              // skip malformed chunks
            }
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setError(msg);
      setMessages(prev => prev.slice(0, -1)); // remove empty assistant bubble
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className={`w-full h-full flex flex-col ${messages.length === 0 ? 'sm:justify-center' : ''}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 flex-shrink-0">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[var(--color-ink)]">
          <span className="text-xs font-medium" style={{ color: 'var(--color-cream)' }}>S</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Chat with Shahzaib's AI</p>
          <p className="text-xs text-[#6b7280]">Tell me what you're building, or ask about my background.</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => { setMessages([]); setShowStarters(true); setError(null); }}
            className="text-[#9ca3af] hover:text-[#1a1a1a] transition-colors flex-shrink-0"
            aria-label="Reset conversation"
            title="Reset conversation"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        )}
      </div>

      {/* Messages — fills remaining space and scrolls */}
      {messages.length > 0 && (
        <div className="chat-messages flex flex-col gap-4 mb-5 overflow-y-auto flex-1 min-h-0">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[90%] sm:max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#1a1a1a] text-white rounded-br-sm'
                    : 'bg-white border border-[#e5e2dc] text-[#1a1a1a] rounded-bl-sm'
                }`}
              >
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
                                className="text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors"
                              >
                                {children}
                              </a>
                            ),
                          },
                          p: { props: { className: 'mb-1.5 last:mb-0' } },
                          ul: { props: { className: 'list-disc list-inside mb-1.5 space-y-0.5' } },
                          ol: { props: { className: 'list-decimal list-inside mb-1.5 space-y-0.5' } },
                          strong: { props: { className: 'font-semibold' } },
                        },
                      }}
                    >
                      {msg.content}
                    </Markdown>
                  ) : msg.content
                ) : (
                  <span className="inline-flex gap-1 items-center py-1">
                    <span className="w-1.5 h-1.5 bg-[#6b7280] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#6b7280] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#6b7280] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 mb-4 px-1 flex-shrink-0">{error}</p>
      )}

      {/* Starter prompts */}
      {showStarters && (
        <div className="flex flex-wrap gap-2 mb-2 flex-shrink-0">
          {STARTER_PROMPTS.map(prompt => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              className="text-xs px-3 py-2 rounded-full border border-[#e5e2dc] text-[#6b7280] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors bg-white"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2 border border-[#e5e2dc] rounded-xl px-4 py-2.5 bg-white focus-within:border-[#1a1a1a] transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about my work..."
            disabled={isLoading}
            maxLength={MAX_INPUT_LENGTH}
            className="flex-1 text-sm outline-none bg-transparent text-[#1a1a1a] placeholder-[#9ca3af] disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 sm:w-7 sm:h-7 rounded-lg bg-[#1a1a1a] text-white flex items-center justify-center disabled:opacity-30 hover:opacity-80 transition-opacity flex-shrink-0"
            aria-label="Send"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>
        <p className="hidden sm:block text-xs text-[#9ca3af] mt-2 px-1">Press Enter to send</p>
      </div>
    </div>
  );
}
