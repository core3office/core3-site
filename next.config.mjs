/** @type {import('next').NextConfig} */
const nextConfig = {
  // Собираем через Turbopack (флаг --turbopack в package.json):
  // webpack-сборщик Next ломается на кириллице в пути к папке («Кейс1»).

  // Магазин теперь часть главной страницы — старые ссылки ведут к букетам.
  async redirects() {
    return [{ source: "/shop", destination: "/#bouquets", permanent: false }];
  },
};
export default nextConfig;
