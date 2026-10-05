export const STATUSES = [
  { key: "lead", label: "Лид", hint: "Зашёл, но заявку не оформил", color: "#9a948c" },
  { key: "new", label: "Новая заявка", hint: "Маша ещё не смотрела", color: "#c9473d" },
  { key: "in_progress", label: "В работе", hint: "Маша отвечает клиенту", color: "#d9a31f" },
  { key: "link_sent", label: "Ссылка отправлена", hint: "Ждём оплату", color: "#3f73b8" },
  { key: "paid", label: "Оплачено", hint: "Клиент оплатил", color: "#4f8a4b" },
  { key: "closed", label: "Закрыта", hint: "Выполнено или отказ", color: "#4a4440" },
] as const;

export type StatusKey = (typeof STATUSES)[number]["key"];
export const STATUS_KEYS = STATUSES.map((s) => s.key) as StatusKey[];

export function statusMeta(key: string) {
  return STATUSES.find((s) => s.key === key) ?? STATUSES[0];
}

export type Lead = {
  id: number;
  name: string;
  tg_username: string;
  phone: string;
  email: string;
  address: string;
  kind: "lead" | "request";
  source: string; // site_order | masterclass | telegram | demo
  request_type: string; // «Букет», «Подарочный набор», «Мастер-класс», «Свадьба»…
  product: string;
  status: StatusKey;
  notes: string;
  unread: number;
  created_at: string;
  updated_at: string;
  preview?: string;
};

export type Message = {
  id: number;
  lead_id: number;
  sender: "client" | "maria" | "system";
  text: string;
  created_at: string;
};
