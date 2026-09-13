import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('dist');
async function walk(dir){const files=[];for(const item of await readdir(dir,{withFileTypes:true})){const path=join(dir,item.name);files.push(...item.isDirectory()?await walk(path):[path]);}return files;}
const files=await walk(root);
const documents=new Map();
for(const path of files.filter(f=>f.endsWith('.html'))){documents.set(path,await readFile(path,'utf8'));}
for(const route of ['','world','ability','alien','ranger','organizations','archive','characters']) assert(documents.has(join(root,route,'index.html')),`Missing page: ${route}`);
for(const [path,html] of documents){
  assert.match(html,/<html[^>]*lang="ko"/,`Missing Korean lang: ${path}`);
  assert.match(html,/<title>[^<]+<\/title>/,`Missing title: ${path}`);
  assert.match(html,/<meta name="description" content="[^"]+"/,`Missing description: ${path}`);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,`Duplicate IDs: ${path}`);
  for(const match of html.matchAll(/\b(?:href|src)="([^"<>]+)"/g)){
    const ref=match[1];if(/^(?:https?:|data:|mailto:|tel:)/.test(ref))continue;
    const [pathname,hash]=ref.split('#');
    if(!pathname&&!hash)continue;
    let target=pathname?resolve(root,'.'+pathname.split('?')[0]):path;
    if(pathname.endsWith('/')) target=join(target,'index.html');
    assert(target.startsWith(root),`Reference outside output: ${ref}`);
    if(pathname) await stat(target).catch(()=>assert.fail(`Broken local reference ${ref} in ${path}`));
    if(hash&&documents.has(target)) assert(documents.get(target).includes(`id="${hash}"`),`Broken anchor ${ref} in ${path}`);
  }
  for(const match of html.matchAll(/<img\b[^>]*>/g)) assert.match(match[0],/\balt="[^"]*"/,`Missing image alternative: ${path}`);
  assert(!html.includes('character-slug')&&!html.includes('record-slug'),`Draft template leaked: ${path}`);
}
const sitemap=await readFile(join(root,'sitemap.xml'),'utf8');
if(process.env.SITE_URL) assert(sitemap.includes(process.env.SITE_URL),'Missing sitemap origin');
assert(!sitemap.includes('undefined'),'Invalid sitemap entry');
const total=(await Promise.all(files.map(f=>stat(f)))).reduce((sum,s)=>sum+s.size,0);
console.log(`Verified ${documents.size} HTML pages, all internal links/anchors/assets, metadata and draft exclusion. Output: ${Math.round(total/1024)} KB.`);
