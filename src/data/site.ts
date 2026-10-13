// Identity and structured data shared by every page, sitemap, RSS and llms.txt.

export const SITE = 'https://shahzaib.ai';

export const person = {
  name: 'Shahzaib Khan',
  title: 'AI Engineer',
  currentRole: 'Founding Senior Engineer at Bridge',
  location: 'Pakistan',
  email: 'hello@shahzaib.ai',
  linkedin: 'https://www.linkedin.com/in/shahzaib17',
  github: 'https://github.com/Shahzaib0217',
  calendly: 'https://calendly.com/shahzaib-khan0217/30min',
  /** One-sentence definition reused in meta descriptions, schema and llms.txt. */
  summary:
    'Shahzaib Khan is an AI engineer from Pakistan and Founding Senior Engineer at Bridge. He builds production AI agents: meeting agents, voice agents, RAG pipelines and MCP integrations, end to end.',
  knowsAbout: [
    'AI agents',
    'Agentic workflows',
    'Voice AI agents',
    'Retrieval-augmented generation (RAG)',
    'Model Context Protocol (MCP)',
    'LangChain',
    'LangGraph',
    'Pydantic AI',
    'Speech-to-text',
    'FastAPI',
    'Node.js',
    'Next.js',
    'Generative engine optimization (GEO)',
  ],
};

export const PERSON_ID = `${SITE}/#person`;
export const WEBSITE_ID = `${SITE}/#website`;

type JsonLd = Record<string, unknown>;

/** Graph included on every page: who the site is about, and the site itself. */
export function baseGraph(): JsonLd[] {
  return [
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: person.name,
      givenName: 'Shahzaib',
      familyName: 'Khan',
      url: `${SITE}/`,
      image: `${SITE}/shahzaib.jpg`,
      email: `mailto:${person.email}`,
      jobTitle: [person.title, 'Founding Senior Engineer'],
      description: person.summary,
      address: { '@type': 'PostalAddress', addressCountry: 'PK' },
      nationality: { '@type': 'Country', name: 'Pakistan' },
      worksFor: [
        {
          '@type': 'Organization',
          name: 'Bridge',
          url: 'https://meetonbridge.com',
        },
        {
          '@type': 'Organization',
          name: 'DreamDesk AI',
          parentOrganization: {
            '@type': 'Organization',
            name: 'Second Nature',
            url: 'https://staysecondnature.com/',
          },
        },
      ],
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'FAST National University of Computer and Emerging Sciences (FAST NUCES)',
      },
      knowsAbout: person.knowsAbout,
      sameAs: [person.linkedin, person.github],
    },
    {
      '@type': 'Organization',
      '@id': 'https://zehn.school/#organization',
      name: 'Zehn',
      url: 'https://zehn.school/',
      description: 'Computing and AI programmes for schools and colleges in Pakistan.',
      founder: { '@id': PERSON_ID },
      foundingDate: '2026-09',
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: `${SITE}/`,
      name: 'Shahzaib Khan',
      inLanguage: 'en',
      publisher: { '@id': PERSON_ID },
      about: { '@id': PERSON_ID },
    },
  ];
}

export function profilePage(path: string, name: string): JsonLd {
  return {
    '@type': 'ProfilePage',
    '@id': `${SITE}${path}#page`,
    url: `${SITE}${path}`,
    name,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: { '@id': PERSON_ID },
    about: { '@id': PERSON_ID },
  };
}

export function faqPage(path: string, faqs: { q: string; a: string }[]): JsonLd {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE}${path}#faq`,
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}
