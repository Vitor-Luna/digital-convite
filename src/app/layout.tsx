import type { Metadata, Viewport } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { wedding } from "@/config/wedding";
import { themeCssVars } from "@/lib/theme";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display-src",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const sans = Lato({
  subsets: ["latin"],
  variable: "--font-sans-src",
  display: "swap",
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(wedding.meta.url),
  title: {
    default: wedding.meta.title,
    template: `%s · ${wedding.meta.siteName}`,
  },
  description: wedding.meta.description,
  applicationName: wedding.meta.siteName,
  openGraph: {
    title: wedding.meta.title,
    description: wedding.meta.description,
    url: wedding.meta.url,
    siteName: wedding.meta.siteName,
    locale: "pt_BR",
    type: "website",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: wedding.theme.colors.background,
  // "dark light": o site tem cor fixa própria (não é adaptativo ao tema do
  // sistema), mas sinaliza que sabe lidar com claro E escuro — isso evita
  // que alguns Android/WebViews (Samsung Internet, WhatsApp in-app, etc.)
  // apliquem o "force dark" deles sobre as seções claras (.on-cream).
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <head>
        <style
          // Injeta a paleta central como CSS variables (única fonte da verdade).
          dangerouslySetInnerHTML={{ __html: themeCssVars() }}
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
