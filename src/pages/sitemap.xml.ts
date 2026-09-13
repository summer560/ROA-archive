import type { APIRoute } from 'astro';
import { navigation } from '../data/site';
export const GET: APIRoute = ({site}) => {
  const characters=Object.values(import.meta.glob('../content/characters/*.md',{eager:true})).filter((e:any)=>!e.frontmatter.draft) as any[];
  const records=Object.values(import.meta.glob('../content/records/*.md',{eager:true})).filter((e:any)=>!e.frontmatter.draft) as any[];
  const routes=['/','/ranger-id/',...navigation.map(n=>`/${n.slug}/`),...characters.map(e=>`/characters/${e.frontmatter.slug}/`),...records.map(e=>`/records/${e.frontmatter.slug}/`)];
  const urls=site ? routes.map(r=>`<url><loc>${new URL(r,site).href.replace(/&/g,'&amp;')}</loc></url>`).join('') : '';
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,{headers:{'Content-Type':'application/xml'}});
};
