import type { APIRoute } from 'astro';
import { SITE } from '../data/site';
import { getPosts } from '../data/posts';

const pages = ['/', '/work', '/about', '/call'];

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const urls = [
    ...[...pages, ...(posts.length ? ['/blog'] : [])].map(path => `  <url><loc>${SITE}${path}</loc></url>`),
    ...posts.map(post => {
      const lastmod = (post.data.updatedDate ?? post.data.pubDate).toISOString().slice(0, 10);
      return `  <url><loc>${SITE}/blog/${post.id}</loc><lastmod>${lastmod}</lastmod></url>`;
    }),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
