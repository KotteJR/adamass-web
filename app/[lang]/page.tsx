import { Aws } from "@/components/sections/Aws";
import { ClosingBackdrop } from "@/components/sections/ClosingBackdrop";
import { EndScreen } from "@/components/sections/EndScreen";
import { FourWays } from "@/components/sections/FourWays";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Statement } from "@/components/sections/Statement";
import { Work } from "@/components/sections/Work";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Statement />
      <FourWays />
      <Work />
      <Aws />
      <ClosingBackdrop>
        <Process />
        <EndScreen />
      </ClosingBackdrop>
    </>
  );
}
