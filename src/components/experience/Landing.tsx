import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Countdown } from "@/components/sections/Countdown";
import { Story } from "@/components/sections/Story";
import { Gallery } from "@/components/sections/Gallery";
import { Verses } from "@/components/sections/Verses";
import { Faq } from "@/components/sections/Faq";
import { Gifts } from "@/components/sections/Gifts";
import { Rsvp } from "@/components/sections/Rsvp";
import { Messages } from "@/components/sections/Messages";
import { Footer } from "@/components/sections/Footer";

/**
 * Experiência completa do convite — só é renderizada DEPOIS do portão de áudio.
 *
 * Ordem (regras do projeto):
 *  - o RSVP fica DEPOIS da lista de presentes;
 *  - as Perguntas frequentes ficam POR ÚLTIMO (antes do rodapé);
 *  - endereços e informações do evento só aparecem após a confirmação (RSVP).
 */
export function Landing() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Countdown />
        <Story />
        <Gallery />
        <Verses />
        <Gifts />
        <Rsvp />
        <Messages />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
