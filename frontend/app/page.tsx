// import Image from "next/image";

import CtaSection from "@/components/CtaSection";
import FooterSection from "@/components/FooterSection";
import HeroSection from "@/components/HeroSection";
import MarketSection from "@/components/MarketSection";
import ModelSection from "@/components/ModelSection";
import Navbar from "@/components/Navbar";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <MarketSection />
      <ModelSection />
      <CtaSection />
      <FooterSection />
    </div>
  );
}
