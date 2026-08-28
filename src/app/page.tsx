import { SmoothScroll } from "@/components/experience/SmoothScroll";
import { ExperienceGate } from "@/components/experience/ExperienceGate";
import { Landing } from "@/components/experience/Landing";

export default function Page() {
  return (
    <SmoothScroll>
      <ExperienceGate>
        <Landing />
      </ExperienceGate>
    </SmoothScroll>
  );
}
