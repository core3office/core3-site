import { site } from "@/config/site";
import { PinterestIcon, TelegramIcon, TikTokIcon, WhatsAppIcon } from "./icons";
import { SmartLink } from "./SmartLink";

const round =
  "grid h-12 w-12 place-items-center rounded-full border border-ink/15 bg-ivory/70 text-ink backdrop-blur transition hover:-translate-y-0.5 hover:border-ink/40 hover:bg-ivory";

export function SocialBar({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <SmartLink href={site.social.tiktok} className={round} ariaLabel="TikTok">
        <TikTokIcon className="h-5 w-5" />
      </SmartLink>
      <SmartLink href={site.social.telegram} className={round} ariaLabel="Telegram">
        <TelegramIcon className="h-5 w-5" />
      </SmartLink>
      <SmartLink href={site.social.pinterest} className={round} ariaLabel="Pinterest">
        <PinterestIcon className="h-5 w-5" />
      </SmartLink>
      <SmartLink
        href={site.social.whatsapp}
        ariaLabel="WhatsApp"
        className={`flex h-12 items-center gap-2.5 rounded-full bg-ink px-6 text-sm font-semibold tracking-wide text-ivory shadow-lg shadow-ink/15 transition hover:-translate-y-0.5 hover:bg-terra-dark ${compact ? "" : "sm:px-8"}`}
      >
        <WhatsAppIcon className="h-5 w-5" />
        Написать в WhatsApp
      </SmartLink>
    </div>
  );
}
