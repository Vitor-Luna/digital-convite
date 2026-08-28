import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Para deploy em VPS/Docker (Node self-hosted), descomente:
  // output: "standalone",
  // As fotos ficam em /public, então não é preciso configurar `images`.
  // Se um dia usar imagens de um CDN externo, adicione `images.remotePatterns`.
};

export default nextConfig;
