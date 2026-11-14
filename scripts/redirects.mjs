import {BLOG_SLUG_REDIRECTS,FORUM_SLUG_REDIRECTS} from './slug-redirects.mjs';
export const TRAILING_SLASH_SKIP=/\.[a-z0-9]+$/i;
export const PATH_REDIRECTS=new Map([['/contact','/support/'],['/contact/','/support/']]);
for(const [base,slugs] of [['blog',BLOG_SLUG_REDIRECTS],['forum',FORUM_SLUG_REDIRECTS]])for(const [from,to] of Object.entries(slugs))for(const suffix of ['', '/'])PATH_REDIRECTS.set('/'+base+'/'+from+suffix,'/'+base+'/'+to+'/');
export function resolvePathRedirect(pathname){return PATH_REDIRECTS.get(pathname)??(pathname!=='/'&&!pathname.endsWith('/')&&!TRAILING_SLASH_SKIP.test(pathname)?pathname+'/':null);}
export function auditRedirectGraph(){const issues=[];for(const [from,to] of PATH_REDIRECTS){if(from===to||PATH_REDIRECTS.has(to))issues.push({type:from===to?'loop':'chain',from,to});}return issues;}
