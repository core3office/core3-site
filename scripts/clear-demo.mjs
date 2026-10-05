// Удаляет демонстрационные карточки (source = 'demo') из Supabase CRM.
// Запуск: npm run clear-demo   (сайт при этом можно не останавливать)
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !secretKey) throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY are required");

const supabase = createClient(url, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const { data, error } = await supabase.from("leads").delete().eq("source", "demo").select("id");
if (error) throw error;
console.log(`Удалено демо-карточек: ${data.length}. IDs: ${data.map((row) => row.id).join(", ") || "—"}`);
