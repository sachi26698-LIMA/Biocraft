// Small public projections behind the Admin content.read gate. No stored
// markup, executable preset, email, private table or JWT is returned. Cursor
// on the immutable PK, not a display name (font/emoji names can repeat).
const catalogs = {
  captions:['captions','id,title,text:content,language,tone'],
  hashtags:['hashtags','id,text:tag,language,popularity'],
  fonts:['fonts','id,title:name,text:preview_text,font_type,license_code,attribution'],
  templates:['design_templates','id,title,text:slug,detail:domain,language,license_code,attribution'],
  designs:['design_presets','id,title,text:slug,detail:kind,language,attribution'],
  'published/emoji':['emoji_library','id,title:emoji,text:name,detail:group_name,license_code,attribution'],
  'published/symbols':['symbols','id,title:symbol,text:category,detail:codepoints,license_code,attribution'],
  'published/languages':['languages','id:code,title:name_native,text:name_en,detail:direction,language:code','code'],
};
export const publishedCatalogPath = pathname => {
  const key=pathname.slice('/api/admin/v1/'.length);
  return pathname.startsWith('/api/admin/v1/') && Object.hasOwn(catalogs,key) ? key : null;
};
export function createPublishedCatalog(guestClient) {
  return async ({kind,after,limit}) => {
    if(!Object.hasOwn(catalogs,kind)) throw Error('Unknown catalogue');
    const [relation,projection,cursor='id']=catalogs[kind];
    let query=guestClient().from(relation).select(projection).eq('is_active',true).order(cursor).limit(limit)
      .retry(false).abortSignal(AbortSignal.timeout(5000));
    if(after!==null) query=query.gt(cursor,after);
    const {data,error}=await query;
    if(error || !Array.isArray(data)) throw Error('Catalogue unavailable');
    return data;
  };
}
