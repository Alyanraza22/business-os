// Live diagnostic. Run: node --env-file=.env.local scripts/diagnose-db.mjs
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Project URL:", url);

// 1) What tables does PostgREST currently expose? (OpenAPI spec)
const rootRes = await fetch(`${url}/rest/v1/`, {
  headers: { apikey: service, Authorization: `Bearer ${service}` },
});
const spec = await rootRes.json().catch(() => ({}));
const known = Object.keys(spec.definitions ?? {});
console.log("\nTables PostgREST knows about:", known.length ? known : "(none)");

// 2) Direct hit on projects with the service role key.
const svc = await fetch(`${url}/rest/v1/projects?select=id&limit=1`, {
  headers: { apikey: service, Authorization: `Bearer ${service}` },
});
console.log("\n[service] GET projects ->", svc.status, await svc.text());

// 3) Direct hit on projects with the anon key (what the app uses).
const pub = await fetch(`${url}/rest/v1/projects?select=id&limit=1`, {
  headers: { apikey: anon, Authorization: `Bearer ${anon}` },
});
console.log("\n[anon] GET projects ->", pub.status, await pub.text());
