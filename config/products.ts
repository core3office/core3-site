// ================================================================
//  КАТАЛОГ: букеты и подарочные наборы (по Базе знаний Maria Flora).
//  paymentUrl — ссылка Stripe Payment Link для конкретного товара.
//  Пока "" — после заполнения формы клиент видит, что заказ принят
//  и Мария пришлёт ссылку на оплату лично.
// ================================================================

export type Product = {
  slug: string;
  kind: "bouquet" | "gift";
  name: string;
  price: number; // в долларах
  description: string; // состав / короткое описание
  image: string; // путь от папки public
  paymentUrl: string;
};

export const bouquets: Product[] = [
  {
    slug: "cascadian-wild",
    kind: "bouquet",
    name: "Cascadian Wild",
    price: 150,
    description: "Пудровые розы, ранункулюсы и бордовые акценты с сухоцветами",
    image: "/img/cascadian-wild.jpg",
    paymentUrl: "",
  },
  {
    slug: "desert-sun",
    kind: "bouquet",
    name: "Desert Sun",
    price: 150,
    description: "Золотые ранункулюсы, маки и пампасная трава",
    image: "/img/desert-sun.jpg",
    paymentUrl: "",
  },
  {
    slug: "morning-in-oregon",
    kind: "bouquet",
    name: "Morning in Oregon",
    price: 165,
    description: "Нежные лизиантусы, эвкалипт и лавандовые астры",
    image: "/img/morning-in-oregon.jpg",
    paymentUrl: "",
  },
  {
    slug: "rose-garden",
    kind: "bouquet",
    name: "Rose Garden",
    price: 175,
    description: "Классические садовые розы в крафтовой упаковке",
    image: "/img/rose-garden.jpg",
    paymentUrl: "",
  },
  {
    slug: "lavender-dreams",
    kind: "bouquet",
    name: "Lavender Dreams",
    price: 185,
    description: "Лавандовые розы, дельфиниум и пряные травы",
    image: "/img/lavender-dreams.jpg",
    paymentUrl: "",
  },
  {
    slug: "bohemian-sunset",
    kind: "bouquet",
    name: "Bohemian Sunset",
    price: 195,
    description: "Протея, терракотовые георгины и эвкалипт",
    image: "/img/bohemian-sunset.jpg",
    paymentUrl: "",
  },
];

export const gifts: Product[] = [
  {
    slug: "green-thumb-kit",
    kind: "gift",
    name: "The Green Thumb Kit",
    price: 195,
    description: "Суккулент, медная лейка, секатор, спрей и книга о растениях",
    image: "/img/green-thumb-kit.jpg",
    paymentUrl: "",
  },
  {
    slug: "wellness-box",
    kind: "gift",
    name: "The Wellness Box",
    price: 210,
    description: "Мини-букет, ароматическая свеча, натуральное мыло и саше",
    image: "/img/wellness-box.jpg",
    paymentUrl: "",
  },
  {
    slug: "preservation-kit",
    kind: "gift",
    name: "The Preservation Kit",
    price: 230,
    description: "Мёд, набор для прессования цветов, ботаническая рамка и сухоцветы",
    image: "/img/preservation-kit.jpg",
    paymentUrl: "",
  },
  {
    slug: "gourmet-box",
    kind: "gift",
    name: "The Gourmet Box",
    price: 245,
    description: "Сезонный букет, свеча, чай Earl Grey и шоколадные трюфели",
    image: "/img/gourmet-box.jpg",
    paymentUrl: "",
  },
];

export const allProducts = [...bouquets, ...gifts];

export function findProduct(slug: string) {
  return allProducts.find((p) => p.slug === slug);
}
