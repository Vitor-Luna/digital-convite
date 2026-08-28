import { wedding } from "@/config/wedding";
import { Section, SectionHeading } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { PhotoFrame } from "@/components/ui/PhotoFrame";

export function Gallery() {
  const { gallery } = wedding;

  return (
    <Section id="fotos" botanical>
      <SectionHeading
        eyebrow="Galeria"
        title={gallery.title}
        description={gallery.intro}
      />
      <RevealGroup className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {gallery.photos.map((photo, i) => (
          <RevealItem key={i} className="break-inside-avoid">
            <PhotoFrame
              photo={photo}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
