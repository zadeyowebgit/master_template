import fs from 'node:fs';
import { LOCALES } from '../src/i18n/locales';
import { useTranslations } from '../src/i18n/utils';
const base=useTranslations('en');
const result:Record<string,string[]>={};
for(const {code} of LOCALES.filter(l=>l.code!=='en')) {
  const strings=new Set<string>();
  function walk(en:unknown, local:unknown, key='') {
    if (/(?:^|\.)(?:id|slug|href|url|src|icon|type|kind|variant|tone|bento|date|num|seed|scrollTarget|tags)(?:\.|$)/i.test(key) || /(?:Url|Path|Href|Slugs)$/.test(key)) return;
    if(typeof en==='string' && en===local) strings.add(en);
    else if(Array.isArray(en)&&Array.isArray(local)) en.forEach((v,i)=>walk(v,local[i],key));
    else if(en && local && typeof en==='object' && typeof local==='object') for(const k of Object.keys(en)) walk(en[k as keyof typeof en],local[k as keyof typeof local],key?`${key}.${k}`:k);
  }
  walk(base,useTranslations(code));
  result[code]=[...strings];
}
fs.mkdirSync('scripts/_tmp',{recursive:true});
fs.writeFileSync('scripts/_tmp/language-source-gaps.json',JSON.stringify(result,null,2)+'\n');
