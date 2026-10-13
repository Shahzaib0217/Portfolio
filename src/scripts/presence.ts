// Live presence on the homepage: other visitors appear as anonymous animals in the
// menu bar, and (on desktop) as named cursors. Backed by the Presence Durable Object.
// Nothing is stored; a visitor gets a new animal on every visit.

interface Peer {
  id: string;
  name: string;
  emoji: string;
  color: string;
  view?: string;
}

const VIEW_LABEL: Record<string, string> = {
  readme: 'reading the README',
  clone: 'chatting with the clone',
  bridge: 'looking at Bridge',
  dreamdesk: 'looking at DreamDesk',
  work: 'looking at Work',
  contact: 'looking at Contact',
};
const MAX_AVATARS = 3;
const CURSOR_IDLE_MS = 8000;
const HIDDEN_DISCONNECT_MS = 5 * 60_000;

export function startPresence() {
  const bar = document.getElementById('presence');
  const layer = document.getElementById('cursors');
  const desktop = document.getElementById('desktop');
  if (!bar || !layer || !desktop || !('WebSocket' in window)) return;

  const wide = matchMedia('(min-width: 768px)');
  const peers = new Map<string, Peer>();
  const cursors = new Map<string, { el: HTMLElement; timer?: number }>();
  let ws: WebSocket | null = null;
  let retry = 0;
  let paused = false;
  let hiddenTimer: number | undefined;
  let lastView: string | undefined;

  const send = (msg: object) => { if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg)); };

  function connect() {
    ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/api/presence`);
    ws.onopen = () => { retry = 0; lastView = undefined; sendView(); };
    ws.onmessage = e => {
      try { receive(JSON.parse(e.data)); } catch { /* ignore malformed */ }
    };
    ws.onclose = () => {
      ws = null;
      peers.clear();
      cursors.forEach(c => c.el.remove());
      cursors.clear();
      render();
      if (!paused) setTimeout(connect, Math.min(30_000, 2000 * 2 ** retry++));
    };
  }

  function receive(msg: any) {
    switch (msg.t) {
      case 'welcome': (msg.peers as Peer[]).forEach(p => peers.set(p.id, p)); break;
      case 'join': peers.set(msg.peer.id, msg.peer); break;
      case 'leave': peers.delete(msg.id); dropCursor(msg.id); break;
      case 'view': { const p = peers.get(msg.id); if (p) p.view = msg.view; break; }
      case 'cursor': moveCursor(msg.id, msg.x, msg.y); return;
      case 'hide': dropCursor(msg.id); return;
    }
    render();
  }

  // Menu bar avatars
  function describe(p: Peer) {
    return `Anonymous ${p.name}${p.view ? `, ${VIEW_LABEL[p.view] ?? ''}` : ''}`;
  }

  function render() {
    const list = [...peers.values()];
    bar!.hidden = list.length === 0;
    bar!.replaceChildren();
    for (const p of list.slice(0, MAX_AVATARS)) {
      const a = document.createElement('span');
      a.className = 'peer';
      a.style.setProperty('--c', p.color);
      a.textContent = p.emoji;
      a.title = describe(p);
      a.setAttribute('role', 'img');
      a.setAttribute('aria-label', describe(p));
      bar!.append(a);
    }
    if (list.length > MAX_AVATARS) {
      const more = document.createElement('span');
      more.className = 'peer peer-more';
      more.textContent = `+${list.length - MAX_AVATARS}`;
      more.title = list.slice(MAX_AVATARS).map(describe).join('\n');
      bar!.append(more);
    }
    const label = document.createElement('span');
    label.className = 'sr-only';
    label.textContent = `${list.length} other ${list.length === 1 ? 'person is' : 'people are'} here`;
    bar!.append(label);
  }

  // Cursors (desktop only)
  function moveCursor(id: string, x: number, y: number) {
    const p = peers.get(id);
    if (!p || !wide.matches) return;
    let c = cursors.get(id);
    if (!c) {
      const el = document.createElement('div');
      el.className = 'peer-cursor';
      el.style.setProperty('--c', p.color);
      el.innerHTML = '<svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true"><path d="M1 1l13 7.5-5.8 1.4L5.6 16z" fill="var(--c)" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg><span></span>';
      el.querySelector('span')!.textContent = `${p.emoji} ${p.name}`;
      layer!.append(el);
      c = { el };
      cursors.set(id, c);
    }
    c.el.style.transform = `translate(${x * desktop!.clientWidth}px, ${y * desktop!.clientHeight}px)`;
    c.el.classList.remove('is-idle');
    clearTimeout(c.timer);
    c.timer = window.setTimeout(() => c!.el.classList.add('is-idle'), CURSOR_IDLE_MS);
  }

  function dropCursor(id: string) {
    const c = cursors.get(id);
    if (!c) return;
    clearTimeout(c.timer);
    c.el.remove();
    cursors.delete(id);
  }

  // Share my cursor, only when someone is there to see it
  let lastSent = 0;
  let outside = true;
  document.addEventListener('pointermove', e => {
    if (!peers.size || !wide.matches || e.pointerType === 'touch') return;
    const now = performance.now();
    if (now - lastSent < 60) return;
    lastSent = now;
    const r = desktop!.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) {
      if (!outside) send({ t: 'hide' });
      outside = true;
      return;
    }
    outside = false;
    send({ t: 'cursor', x, y });
  });
  document.documentElement.addEventListener('pointerleave', () => { if (!outside) send({ t: 'hide' }); outside = true; });

  // Share which window I'm looking at (top-most open window)
  function sendView() {
    const top = [...document.querySelectorAll<HTMLElement>('.window.is-open.is-active:not(.is-min)')][0];
    const view = top?.id;
    if (view === lastView) return;
    lastView = view;
    send({ t: 'view', view });
  }
  new MutationObserver(sendView).observe(desktop, { subtree: true, attributes: true, attributeFilter: ['class'] });

  // Leave the room when the tab sits in the background, so nobody shows as "here" all day
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      send({ t: 'hide' });
      outside = true;
      hiddenTimer = window.setTimeout(() => { paused = true; ws?.close(); }, HIDDEN_DISCONNECT_MS);
    } else {
      clearTimeout(hiddenTimer);
      if (paused) { paused = false; retry = 0; connect(); }
    }
  });

  connect();
}
