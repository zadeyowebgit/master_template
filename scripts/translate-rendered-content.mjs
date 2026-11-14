import fs from 'node:fs';
import path from 'node:path';
import { visitContent } from '../src/i18n/rendered-content.mjs';
import { LOCALES } from '../src/i18n/locales.ts';

const file = 'src/i18n/generated-content.json';
const dictionaries = JSON.parse(fs.readFileSync(file, 'utf8'));
function files(dir) { return fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? files(path.join(dir,e.name)) : e.name.endsWith('.html') ? [path.join(dir,e.name)] : []); }
const pages = files('dist');
const byLocale = Object.fromEntries(LOCALES.map(l => [l.code,new Set()]));
for (const page of pages) {
  const first = path.relative('dist',page).split(path.sep)[0];
  const locale = byLocale[first] ? first : 'en';
  visitContent(fs.readFileSync(page,'utf8'), text => { byLocale[locale].add(text); return text; });
}
const protectedTerms = new Set(['[[GAME_NAME]]','[[SITE_BRAND]]','Cloud DMA','Discord','OBS','ESP','EAC','HWID','FOV','PC','EA','AWS','CLOUD-DMA','Windows','Facebook','Reddit','WhatsApp','X']);
for (const l of LOCALES) { protectedTerms.add(l.nativeName); protectedTerms.add(l.name); }
function translatable(s) { return /[a-z]{2}/i.test(s) && !protectedTerms.has(s) && !/^(https?:|\/|[\w.+-]+@)/.test(s) && !/^[@#]/.test(s); }
const english = byLocale.en;
const sourceGaps = !process.argv.includes('--audit') && !process.argv.includes('--rendered-only') && fs.existsSync('scripts/_tmp/language-source-gaps.json') ? JSON.parse(fs.readFileSync('scripts/_tmp/language-source-gaps.json', 'utf8')) : {};
const queues = {};
for (const {code} of LOCALES.filter(l=>l.code!=='en')) {
  dictionaries[code] ??= {};
  queues[code] = [...new Set([...byLocale[code]].filter(s => english.has(s)).concat(sourceGaps[code] ?? []))].filter(s => translatable(s) && !dictionaries[code][s]);
}
console.log('Missing rendered translations:',Object.fromEntries(Object.entries(queues).map(([k,v])=>[k,v.length])));
if (process.argv.includes('--audit')) { fs.writeFileSync('docs/language-audit.json',JSON.stringify(queues,null,2)+'\n'); process.exit(Object.values(queues).some(q=>q.length) ? 1 : 0); }
let completed=0;
const tasks=[];
for (const [code,items] of Object.entries(queues)) {
  let batch=[],length=0;
  for(const text of items) {
    if(length+text.length>1800 || batch.length>=18) {tasks.push({code,items:batch});batch=[];length=0;}
    batch.push(text);length+=text.length;
  }
  if(batch.length) tasks.push({code,items:batch});
}
async function worker() {
  while(tasks.length) {
    const task=tasks.shift();
    const target=task.code==='pt'?'pt-BR':task.code;
    const url=new URL('https://clients5.google.com/translate_a/t');
    url.searchParams.set('client','dict-chrome-ex');url.searchParams.set('sl','en');url.searchParams.set('tl',target);
    for(const text of task.items) url.searchParams.append('q',text);
    let result;
    for(let attempt=0;attempt<5;attempt++) {
      try {
        const response=await fetch(url,{signal:AbortSignal.timeout(30000)});
        if(!response.ok) throw new Error(`HTTP ${response.status}`);
        result=await response.json();
        if(!Array.isArray(result)||result.length!==task.items.length||result.some(x=>typeof x!=='string')) throw new Error('Unexpected translation response');
        break;
      } catch(e) { if(attempt===4) throw e; await new Promise(r=>setTimeout(r,1000*(attempt+1))); }
    }
    task.items.forEach((text,i)=>{
      const placeholders = text.match(/\{\w+\}/g) ?? [];
      let index = 0;
      const translated = result[i].replace(/\{[^{}]+\}/g, token => placeholders[index++] ?? token);
      if ((translated.match(/\{\w+\}/g) ?? []).sort().join() !== [...placeholders].sort().join()) throw new Error(`Translation lost template placeholders: ${text}`);
      dictionaries[task.code][text]=translated;
    });
    completed+=task.items.length;
    fs.writeFileSync(file,JSON.stringify(dictionaries,null,2)+'\n');
    console.log(`${task.code}: ${completed} translated; ${tasks.length} batches left`);
  }
}
await Promise.all(Array.from({length:3},worker));
