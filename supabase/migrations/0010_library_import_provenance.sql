-- A palette must have a source before a re-import can safely update it.
-- Keep existing/manual rows untouched. Do not relabel other licences as MIT/CC0.
begin;
set local lock_timeout='3s';
alter table public.color_palettes add column if not exists source_id uuid references public.data_sources(id) on delete set null;
insert into public.content_licenses(code,name,url,allows_commercial,requires_attribution) values
 ('ISC','ISC License','https://spdx.org/licenses/ISC.html',true,true),
 ('Unlicense','The Unlicense','https://spdx.org/licenses/Unlicense.html',true,false)
on conflict (code) do nothing;
commit;
