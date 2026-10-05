export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

export function fmtDateTime(iso: string) {
  return `${fmtDate(iso)}, ${fmtTime(iso)}`;
}

export const SOURCE_LABEL: Record<string, string> = {
  site_order: "Сайт · заказ",
  masterclass: "Сайт · мастер-класс",
  telegram: "Telegram",
  demo: "Пример",
};
