// Worker entry: Astro handles every request except /api/presence, which goes to the
// Presence Durable Object (live "who else is here" avatars and cursors on the homepage).
import { handle } from '@astrojs/cloudflare/handler';
import { DurableObject } from 'cloudflare:workers';

interface Env {
  PRESENCE: DurableObjectNamespace<Presence>;
  [key: string]: unknown;
}

interface Peer {
  id: string;
  name: string;
  emoji: string;
  color: string;
  /** Window the visitor is looking at, e.g. 'bridge'. Undefined = the desktop. */
  view?: string;
}

const ANIMALS: [string, string][] = [
  ['Otter', '🦦'], ['Cat', '🐱'], ['Fox', '🦊'], ['Panda', '🐼'], ['Owl', '🦉'], ['Koala', '🐨'],
  ['Tiger', '🐯'], ['Penguin', '🐧'], ['Hedgehog', '🦔'], ['Raccoon', '🦝'], ['Sloth', '🦥'], ['Llama', '🦙'],
  ['Dolphin', '🐬'], ['Frog', '🐸'], ['Bee', '🐝'], ['Turtle', '🐢'], ['Octopus', '🐙'], ['Rabbit', '🐰'],
];
const COLORS = ['#E5484D', '#F76B15', '#E2A336', '#30A46C', '#12A594', '#0090FF', '#8E4EC6', '#D6409F'];
const VIEWS = new Set(['readme', 'clone', 'bridge', 'dreamdesk', 'work', 'contact']);
const MAX_PEERS = 60;

export class Presence extends DurableObject<Env> {
  async fetch(): Promise<Response> {
    if (this.ctx.getWebSockets().length >= MAX_PEERS) return new Response('Busy', { status: 503 });

    const others = this.peers();
    const names = new Set(others.map(p => p.name));
    const colors = new Set(others.map(p => p.color));
    const free = ANIMALS.filter(([name]) => !names.has(name));
    const [name, emoji] = (free.length ? free : ANIMALS)[Math.floor(Math.random() * (free.length || ANIMALS.length))];
    const color = COLORS.find(c => !colors.has(c)) ?? COLORS[others.length % COLORS.length];
    const me: Peer = { id: crypto.randomUUID().slice(0, 8), name, emoji, color };

    const { 0: client, 1: server } = new WebSocketPair();
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment(me);
    server.send(JSON.stringify({ t: 'welcome', you: me, peers: others }));
    this.broadcast({ t: 'join', peer: me }, server);
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws: WebSocket, raw: string | ArrayBuffer) {
    if (typeof raw !== 'string' || raw.length > 200) return;
    let msg: { t?: string; x?: unknown; y?: unknown; view?: unknown };
    try { msg = JSON.parse(raw); } catch { return; }
    const me = ws.deserializeAttachment() as Peer | null;
    if (!me) return;

    if (msg.t === 'cursor') {
      const x = Number(msg.x), y = Number(msg.y);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      this.broadcast({ t: 'cursor', id: me.id, x: clamp(x), y: clamp(y) }, ws);
    } else if (msg.t === 'hide') {
      this.broadcast({ t: 'hide', id: me.id }, ws);
    } else if (msg.t === 'view') {
      me.view = typeof msg.view === 'string' && VIEWS.has(msg.view) ? msg.view : undefined;
      ws.serializeAttachment(me);
      this.broadcast({ t: 'view', id: me.id, view: me.view }, ws);
    }
  }

  async webSocketClose(ws: WebSocket, code: number) {
    this.leave(ws, code);
  }

  async webSocketError(ws: WebSocket) {
    this.leave(ws, 1011);
  }

  private leave(ws: WebSocket, code: number) {
    const me = ws.deserializeAttachment() as Peer | null;
    if (me) this.broadcast({ t: 'leave', id: me.id }, ws);
    try { ws.close(code === 1005 || code === 1006 ? 1000 : code); } catch { /* already closed */ }
  }

  private peers(except?: WebSocket): Peer[] {
    return this.ctx.getWebSockets()
      .filter(w => w !== except)
      .map(w => w.deserializeAttachment() as Peer | null)
      .filter((p): p is Peer => !!p);
  }

  private broadcast(msg: unknown, except?: WebSocket) {
    const data = JSON.stringify(msg);
    for (const w of this.ctx.getWebSockets()) {
      if (w === except) continue;
      try { w.send(data); } catch { /* socket closing */ }
    }
  }
}

const clamp = (n: number) => Math.round(Math.min(Math.max(n, 0), 1) * 1000) / 1000;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/presence') {
      if (request.headers.get('Upgrade') !== 'websocket') return new Response('Expected a WebSocket', { status: 426 });
      // Only our own pages may connect.
      const origin = request.headers.get('Origin');
      if (origin && new URL(origin).host !== url.host) return new Response('Forbidden', { status: 403 });
      // One room for the whole site.
      return env.PRESENCE.get(env.PRESENCE.idFromName('home')).fetch(request);
    }
    return handle(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
