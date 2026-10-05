import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !secretKey) throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY are required");

const sqlitePath = process.env.DB_PATH || path.join(process.cwd(), "data", "maria-flora.db");
const sqlite = new DatabaseSync(sqlitePath, { readOnly: true });
const leads = sqlite.prepare("SELECT * FROM leads ORDER BY id").all();
const messages = sqlite.prepare("SELECT * FROM messages ORDER BY id").all();
sqlite.close();

const supabase = createClient(url, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const { count, error: countError } = await supabase
  .from("leads")
  .select("id", { count: "exact", head: true });
if (countError) throw countError;
if (count) throw new Error(`Supabase already contains ${count} leads; migration was not started`);

const idMap = new Map();
for (const lead of leads) {
  const { id: oldId, ...record } = lead;
  const { data, error } = await supabase.from("leads").insert(record).select("id").single();
  if (error) throw error;
  idMap.set(Number(oldId), Number(data.id));
}

if (messages.length) {
  const records = messages.map(({ id: _id, lead_id: oldLeadId, ...message }) => ({
    ...message,
    lead_id: idMap.get(Number(oldLeadId)),
  }));
  const { error } = await supabase.from("messages").insert(records);
  if (error) throw error;
}

console.log(`Перенесено в Supabase: ${leads.length} лидов, ${messages.length} сообщений.`);
