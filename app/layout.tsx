import type { Metadata } from "next";
import { Caveat, Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});
const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-manrope" });
const caveat = Caveat({ subsets: ["latin", "cyrillic"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: "Maria Flora — авторская флористика в Портленде",
  description: "Авторские букеты, подарочные боксы и мастер-классы. Доставка по Портленду в день заказа.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${manrope.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
