import { wedding } from "@/config/wedding";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { RsvpWizard } from "@/components/rsvp/RsvpWizard";

export function Rsvp() {
  return (
    <Section id="confirmar" container="narrow" botanical>
      <SectionHeading
        eyebrow="RSVP"
        title={wedding.rsvp.title}
        description={wedding.rsvp.intro}
      />
      <Reveal className="mt-12" y={16}>
        <RsvpWizard />
      </Reveal>
    </Section>
  );
}
