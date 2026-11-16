// Synthetic, disposable PGlite experiment; does not connect to Supabase.
// Demonstrates why TRIGGER and TEMP grants must be reviewed as a combination.
const {PGlite}=require('@electric-sql/pglite'); const assert=require('node:assert/strict');
(async()=>{const db=new PGlite();try{
 await db.exec(`create role fixture_guest; create table public.fixture_table(id integer);
 grant usage on schema public to fixture_guest; revoke create on schema public from fixture_guest;
 grant trigger on public.fixture_table to fixture_guest;
 create function public.fixture_trigger() returns trigger language plpgsql as $$begin return new;end$$;
 grant execute on function public.fixture_trigger() to fixture_guest;`);
 await db.exec('set role fixture_guest');
 assert.equal((await db.query("select has_schema_privilege(current_user,'public','CREATE') ok")).rows[0].ok,false);
 await db.exec(`create trigger fixture_existing before insert on public.fixture_table for each row execute function public.fixture_trigger();
 create temp table fixture_temp(id integer);
 create function pg_temp.fixture_temp_trigger() returns trigger language plpgsql as $$begin return new;end$$;
 create trigger fixture_temporary before insert on public.fixture_table for each row execute function pg_temp.fixture_temp_trigger();`);
 await db.exec('reset role');
 assert.equal((await db.query("select count(*)::int n from pg_trigger where tgrelid='public.fixture_table'::regclass and tgname in ('fixture_existing','fixture_temporary')")).rows[0].n,2);
 console.log('PASS PGlite-only: SQL-capable fixture role with TRIGGER and TEMP created two table triggers without public CREATE; no live exploit tested');
}finally{await db.close()}})().catch(e=>{console.error(e);process.exitCode=1});
