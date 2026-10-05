import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { OvalCarousel } from "@/components/OvalCarousel";
import { ShopSections } from "@/components/ShopSections";
import { SiteHeader } from "@/components/SiteHeader";
import { SocialBar } from "@/components/SocialBar";
import { Toaster } from "@/components/SmartLink";
import { SunAvatar } from "@/components/SunAvatar";
import { TypingBio } from "@/components/TypingBio";
import { Wave } from "@/components/Wave";
import { bio, faq } from "@/config/content";
import { bouquets } from "@/config/products";
import { site } from "@/config/site";

// Единый сайт: визитка + магазин.
// Герой → о Марии (био + карусель) → букеты → боксы → мастер-классы → FAQ → контакты
export default function HomePage() {
  return (
    <main id="top" className="bg-flow min-h-screen overflow-x-hidden">
      <SiteHeader />

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-10 pt-32 md:grid-cols-[1.15fr_1fr] md:gap-8 md:pt-40">
        <div className="text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-terra">Портленд · Орегон</p>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
            Авторская флористика
            <br />
            <span className="font-normal italic">и подарочные боксы</span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg font-medium text-ink-soft md:mx-0">
            Сезонные цветы от местных фермеров, эко-упаковка без пластика. Доставка по Портленду в день заказа.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
            <a
              href="#bouquets"
              className="rounded-full bg-ink px-9 py-4 font-semibold text-ivory shadow-xl shadow-ink/20 transition hover:-translate-y-0.5 hover:bg-terra-dark"
            >
              Заказать букет
            </a>
            <a
              href="#masterclass"
              className="rounded-full border border-ink px-8 py-4 font-semibold transition hover:bg-ink hover:text-ivory"
            >
              Мастер-классы
            </a>
          </div>
        </div>
        <div className="text-center">
          <SunAvatar />
          <p className="mt-6 font-display text-3xl font-semibold tracking-wide">{site.brand}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.28em] text-ink-soft">{site.tagline}</p>
        </div>
      </section>

      <div className="px-5 pb-6">
        <SocialBar />
      </div>

      <Wave variant={0} />

      <section id="about" className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:gap-6">
        <div className="max-w-xl md:pr-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-terra">О Марии</p>
          <TypingBio text={bio} />
        </div>
        <OvalCarousel items={bouquets.map((b) => ({ src: b.image, title: b.name }))} />
      </section>

      <Wave variant={2} />
      <ShopSections />
      <Wave variant={1} />

      <section id="faq" className="mx-auto max-w-3xl px-5 py-14">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-terra">FAQ</p>
        <h2 className="mb-8 mt-2 text-center font-display text-4xl font-semibold sm:text-5xl">Частые вопросы</h2>
        <Faq items={faq} />
      </section>

      <Wave variant={2} />
      <Footer />
      <Toaster />
    </main>
  );
}
