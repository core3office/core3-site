import { site } from "@/config/site";
import { SocialBar } from "./SocialBar";

export function Footer() {
  const tel = site.contacts.phone.replace(/[^\d+]/g, "");
  return (
    <footer id="contacts" className="px-5 pb-10 pt-4 text-center">
      <p className="font-display text-3xl tracking-wide">MARIA FLORA</p>
      <p className="mt-1 text-sm uppercase tracking-[0.25em] text-muted">Floral Designer</p>
      <div className="mx-auto mt-6 max-w-md space-y-1.5 text-[15px] text-ink-soft">
        <p>Доставка: {site.contacts.deliveryArea}</p>
        <p>
          Телефон / WhatsApp:{" "}
          <a href={`tel:${tel}`} className="font-medium text-ink underline-offset-4 hover:underline">
            {site.contacts.phone}
          </a>
        </p>
        <p>
          Email:{" "}
          <a href={`mailto:${site.contacts.email}`} className="font-medium text-ink underline-offset-4 hover:underline">
            {site.contacts.email}
          </a>
        </p>
      </div>
      <div className="mt-7">
        <SocialBar compact />
      </div>
      <nav className="mt-8 flex justify-center gap-6 text-sm text-muted">
        <a href="/#about" className="hover:text-ink">О Марии</a>
        <a href="/#bouquets" className="hover:text-ink">Букеты и боксы</a>
        <a href="/#masterclass" className="hover:text-ink">Мастер-классы</a>
      </nav>
      <p className="mt-6 text-xs text-muted">© {new Date().getFullYear()} Maria Flora. All rights reserved.</p>
    </footer>
  );
}
