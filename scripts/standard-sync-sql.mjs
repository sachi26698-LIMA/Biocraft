// Data-only batches shared by the scheduler and the SQL Editor export. All SQL
// identifiers come from this fixed registry; data never becomes an identifier.
const kinds = {
  icon: {table:'icon_library', key:'slug', perRowLicense:true, fields:'slug text,label text,category text,svg text,keywords text[],attribution text,fingerprint text,language text'},
  palette: {table:'color_palettes', key:'slug', perRowLicense:true, fields:'slug text,title text,colors text[],mood text,attribution text,fingerprint text,language text'},
  emoji: {table:'emoji_library', key:'emoji', fields:'emoji text,name text,slug text,group_name text,unicode_version text,emoji_version text,skin_tone_support boolean'},
  font: {table:'fonts', key:'slug', fields:'slug text,name text,family text,font_type text,category text,subsets text[],weights text[],styles text[],variable boolean,preview_text text'},
  symbol: {table:'symbols', key:'symbol', fields:'symbol text,title text,category text,codepoints text,sort_order integer'},
};

export function batchCtes(kind, {sourceId='$1::uuid', license='$2::text', input}={}) {
  const {table,key,fields,perRowLicense}=kinds[kind];
  if (perRowLicense) license='s.license_code';
  const cols=fields.split(',').map(s=>s.split(' ')[0]);
  const changes=cols.filter(c=>c!==key).concat('license_code');
  const values=changes.map(c=>c==='license_code'?license:`s.${c}`).join(',');
  return `with incoming as materialized (${input ?? `select * from jsonb_to_recordset(${perRowLicense?'$2':'$3'}::jsonb) as r(${fields}${perRowLicense?',license_code text':''})`}),
added as (
 insert into public.${table} (${cols.join(',')},license_code,source_id)
 select ${cols.map(c=>`s.${c}`).join(',')},${license},${sourceId} from incoming s
 on conflict ${perRowLicense?'':`(${key})`} do nothing returning 1
), changed as (
 update public.${table} t set (${changes.join(',')})=(${values}) from incoming s
 where t.${key}=s.${key} and t.source_id=${sourceId}
 and (${changes.map(c=>`t.${c}`).join(',')}) is distinct from (${values}) returning 1
), counts as (
 select (select count(*)::int from incoming) n,(select count(*)::int from added) a,(select count(*)::int from changed) c
)`;
}
