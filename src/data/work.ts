// Single source of truth for roles, used by the home page and /work.

export interface Role {
  company: string;
  /** Legal or parent company, when it differs from the product name. */
  org?: string;
  role: string;
  /** Earlier titles at the same company, newest first. */
  ladder?: { role: string; from: string }[];
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Founder';
  period: string;
  location: string;
  summary: string;
  points: string[];
  tags: string[];
  url: string | null;
  current: boolean;
}

export const roles: Role[] = [
  {
    company: 'Bridge',
    org: 'Simplora',
    role: 'Founding Senior Engineer',
    ladder: [
      { role: 'Founding Senior Engineer', from: 'Oct 2026' },
      { role: 'Founding Engineer', from: 'Aug 2025' },
    ],
    type: 'Part-time',
    period: 'Aug 2025 – Present',
    location: 'Remote · US',
    summary:
      'First engineer at Bridge, the workspace where teams and AI agents meet, built by Simplora. Now leading engineering across product and growth.',
    points: [
      'Shipped the MVP in 2 months and grew Bridge to ~500 users.',
      'Built LangChain agentic workflows that run the full meeting lifecycle, from transcription to summaries and follow-ups.',
      'Integrated MCP servers so agents can take actions in ClickUp, Slack, Google Drive and Notion.',
      'Built speech-to-text pipelines on AssemblyAI and Deepgram.',
      'Optimized database queries, cutting query latency from 60s to under 2s (30x faster).',
      'Lead architecture across the agentic AI pipeline, backend services and third-party integrations, and set the engineering standards for reliability, performance and code quality.',
      'Built a content engine that researches, writes and publishes SEO-optimized articles end to end.',
      'Built programmatic SEO, AEO and GEO pipelines, plus structured data, llms.txt and AI-crawler optimization, so Bridge ranks on Google and gets cited by ChatGPT, Perplexity and Google AI Overviews.',
    ],
    tags: ['Node.js', 'Next.js', 'LangChain', 'MCP', 'AssemblyAI', 'Deepgram', 'PostgreSQL', 'DigitalOcean', 'GitHub Actions'],
    url: 'https://meetonbridge.com',
    current: true,
  },
  {
    company: 'DreamDesk AI',
    org: 'Second Nature',
    role: 'Lead AI Product Engineer',
    type: 'Full-time',
    period: 'Jan 2026 – Present',
    location: 'Remote · UK',
    summary:
      'Hospitality AI from Second Nature (formerly room2), the hometel group behind DreamDesk. Our guest-service agents are live across its hometels in London, Belfast and Southampton.',
    points: [
      'Led a team of 2 engineers and shipped the POC in 4 weeks.',
      'Designed the end-to-end product architecture and UX, working directly with the product owner on scope and R&D.',
      'Built agents across voice, WhatsApp, email and web chat, now running at 3 Second Nature hometels.',
      'Voice agent responds in about 1.7s end to end, including RAG retrieval and MCP tool calls.',
      'Integrated Mews and Guestline PMS for real-time reservation data.',
      'Built the RAG pipeline that ingests each hotel’s knowledge base.',
    ],
    tags: ['FastAPI', 'Next.js', 'Pydantic AI', 'Voice AI', 'MCP', 'Pinecone', 'PostgreSQL', 'GCP', 'Cloud Run'],
    url: 'https://staysecondnature.com/',
    current: true,
  },
  {
    company: 'Zehn',
    role: 'Founder',
    type: 'Founder',
    period: 'Sep 2026 – Present',
    location: 'Pakistan',
    summary:
      'My side project, run alongside my engineering work. Zehn prepares schools and colleges in Pakistan for an AI-powered future.',
    points: [
      'Zehn School: a three-year computing, AI and entrepreneurship programme for Grades 5–7, taught by the school’s own teachers with our curriculum and training.',
      'Zehn College: eight Saturday sessions on campus for FSc, ICS and FA students, covering tech careers, AI tools and a personal 90-day plan.',
      'Zehn Online: live coding and AI classes for ages 8–18, where parents learn too.',
    ],
    tags: ['Curriculum', 'Sales', 'Hiring', 'Operations'],
    url: 'https://zehn.school/',
    current: true,
  },
  {
    company: 'Reconsider AI',
    role: 'Full-Stack AI Engineer',
    type: 'Contract',
    period: 'Nov 2025 – Dec 2025',
    location: 'Remote · Estonia',
    summary: 'Chrome extension that flags deepfake and AI-generated images on e-commerce sites.',
    points: [
      'Built a Chrome extension to detect deepfake and AI-generated images on e-commerce sites.',
      'Integrated image classification models into a real-time, browser-side pipeline.',
      'Designed the UX around model latency so users stay engaged while images are checked.',
    ],
    tags: ['FastAPI', 'Python', 'Next.js', 'JavaScript', 'C2PA'],
    url: 'https://www.reconsider.ai/',
    current: false,
  },
  {
    company: 'AI Governance Sandbox',
    role: 'Founding Full-Stack AI Engineer',
    type: 'Full-time',
    period: 'Apr 2025 – Nov 2025',
    location: 'Remote · US',
    summary: 'Multi-agent compliance evaluation against the EU AI Act, US regulations and global frameworks.',
    points: [
      'Founding engineer on an automated AI compliance evaluation platform.',
      'Built a multi-agent system covering the EU AI Act, US regulations and global compliance frameworks.',
      'Fixed retrieval accuracy with an agentic retrieval system that refines its context iteratively.',
    ],
    tags: ['Python', 'FastAPI', 'LangGraph', 'Docker', 'MongoDB', 'AWS'],
    url: 'https://aigovsandbox.com/',
    current: false,
  },
  {
    company: 'Foomotion',
    role: 'Full-Stack AI Engineer',
    type: 'Full-time',
    period: 'Dec 2024 – Apr 2025',
    location: 'Lahore · On-site',
    summary: 'Owned AI development for Pearson Labs, a YC-funded platform automating legal workflows.',
    points: [
      'Worked with Pearson Labs, a YC-funded AI platform automating workflows for law firms.',
      'Led client syncs and owned AI development end to end.',
      'Built RAG and multi-agent systems on AWS Bedrock, LangGraph, LangChain and LlamaIndex.',
      'Developed LiveKit voice agents and n8n automation workflows.',
    ],
    tags: ['FastAPI', 'Next.js', 'LangGraph', 'LlamaIndex', 'LiveKit', 'n8n', 'AWS Bedrock'],
    url: 'https://www.foomotion.io/',
    current: false,
  },
  {
    company: 'Cyber Evangelists',
    role: 'AI Engineer',
    type: 'Full-time',
    period: 'Jun 2024 – Dec 2024',
    location: 'Lahore · On-site',
    summary: 'Real-time RAG voice agent with voice cloning, and an attack-surface-management MVP.',
    points: [
      'Built a real-time RAG voice agent with TTS, STT and voice cloning.',
      'Built an Attack Surface Management MVP on FastAPI and gRPC microservices.',
      'Containerized each service independently with Docker.',
    ],
    tags: ['FastAPI', 'Node.js', 'gRPC', 'Docker', 'LangChain', 'Redis'],
    url: null,
    current: false,
  },
];

export const earlier = roles.filter(r => !r.current);
