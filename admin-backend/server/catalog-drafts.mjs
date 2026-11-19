import domains from '../../shared/admin-draft-domains.json' with {type:'json'};
export const draftDomain=value=>typeof value==='string' && Object.hasOwn(domains,value);
export function validDraftFields(f) {
  if(!f || Array.isArray(f) || typeof f!=='object' || Object.keys(f).length!==5 ||
     !['key','title','notes','source','license'].every(k=>typeof f[k]==='string')) return false;
  return /^[a-z0-9][a-z0-9_-]{0,99}$/.test(f.key) && f.title.trim()!=='' && f.title.length<=200 &&
    f.notes.length<=4000 && f.source.trim()!=='' && f.source.length<=300 && /^[A-Za-z0-9][A-Za-z0-9.+_-]{0,63}$/.test(f.license);
}
