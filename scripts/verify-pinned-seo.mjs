import fs from 'node:fs';
import { parse } from 'parse5';
import { AUDIT_SEO } from '../src/config/auditSeo.ts';
const errors = [];
const report = [];
function walk(n, fn) { fn(n); for (const c of n.childNodes ?? []) walk(c, fn); }
function text(n) { return n.nodeName === '#text' ? n.value : ['script','style'].includes(n.tagName) ? '' : (n.childNodes ?? []).map(text).join(' '); }
function attr(n,k) { return n.attrs?.find(a=>a.name===k)?.value; }
for (const [url, config] of Object.entries(AUDIT_SEO)) {
 const html = fs.readFileSync(`dist${url}index.html`, 'utf8');
 const nodes=[]; walk(parse(html), n=>nodes.push(n));
 const title=text(nodes.find(n=>n.tagName==='title')).trim();
 const description=attr(nodes.find(n=>n.tagName==='meta' && attr(n,'name')==='description'),'content');
 const h1=nodes.filter(n=>n.tagName==='h1').map(n=>text(n).replace(/\s+/g,' ').trim());
 const alts=nodes.filter(n=>n.tagName==='img').map(n=>attr(n,'alt'));
 const main=text(nodes.find(n=>n.tagName==='main')).replace(/\s+/g,' ').trim();
 const keyword=config.keyword;
 const uses=main.toLowerCase().split(keyword).length-1;
 const words=main.split(/\s+/).length;
 const h2=nodes.filter(n=>['h2','h3'].includes(n.tagName)).map(n=>text(n).trim());
 // Pin the chosen intent and metadata, not keyword density or irrelevant alt text.
 const checks={title:config.title ? title === config.title : Boolean(title), description:config.description ? description === config.description : Boolean(description), h1:h1.length === 1 && (!config.h1 || h1[0] === config.h1), social:nodes.filter(n=>n.tagName==='meta' && ['og:title','twitter:title'].includes(attr(n,'property') ?? attr(n,'name'))).every(n=>attr(n,'content')===title)};
 if(url==='/reviews/') {
  checks.indexable=!/noindex/i.test(attr(nodes.find(n=>n.tagName==='meta' && attr(n,'name')==='robots'),'content'));
  checks.schema=nodes.some(n=>n.tagName==='script' && attr(n,'type')==='application/ld+json' && JSON.parse((n.childNodes ?? []).map(n=>n.value ?? '').join(''))['@type']==='WebPage');
 }
 if(url==='/de/privacy/') checks.content=words>=250;
 for(const [check,ok] of Object.entries(checks)) if(!ok) errors.push(`${url}: ${check}`);
 report.push({url,keyword,title,titleChars:title.length,description,descriptionChars:description.length,h1:h1.map(value=>({value,chars:value.length})),alts:alts.filter(s=>s?.toLowerCase().includes(keyword)).map(value=>({value,chars:value.length})),words,uses,density:Math.round(uses/words*10000)/100,checks});
}
fs.writeFileSync('docs/pinned-seo-verification.json',JSON.stringify({errors,pages:report},null,2)+'\n');
console.log(JSON.stringify({errors,pages:report.map(({url,words,uses,density})=>({url,words,uses,density}))},null,2));
process.exitCode=errors.length?1:0;
