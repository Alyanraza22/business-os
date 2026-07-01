// Verifies time_logs.project_task_id exists (time-tracking analytics column).
// Run: node --env-file=.env.local scripts/verify-tasks-migration.mjs
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const headers = { apikey: key, Authorization: `Bearer ${key}` };

async function check(label, path, ok = (s) => s === 200) {
  const res = await fetch(`${url}/rest/v1/${path}`, { headers });
  const passed = ok(res.status);
  console.log(`${passed ? "✅" : "❌"} ${label} (HTTP ${res.status})`);
  if (!passed) console.log("   ", (await res.text()).slice(0, 200));
  return passed;
}

let allOk = true;
allOk &= await check(
  "time_logs.project_task_id column",
  "time_logs?select=project_task_id&limit=1",
);

console.log(
  allOk ? "\nMigration verified ✅" : "\nMigration NOT fully applied ❌",
);
