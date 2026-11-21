import { ClosingHouse } from "@/components/sections/closing-house";
import { FamiliesStreet } from "@/components/sections/families-street";
import { Hero } from "@/components/sections/hero";
import { JourneyChat } from "@/components/sections/journey-chat";
import { MeetThePups } from "@/components/sections/meet-the-pups";
import { QuestionsNight } from "@/components/sections/questions-night";
import { TrustPassport } from "@/components/sections/trust-passport";
import { TwoWays } from "@/components/sections/two-ways";
import { puppies } from "@/data/puppies";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MeetThePups puppies={puppies} />
      <TwoWays />
      <JourneyChat />
      <TrustPassport />
      <FamiliesStreet />
      <QuestionsNight />
      <ClosingHouse />
    </>
  );
}
