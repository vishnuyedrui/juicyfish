import { LandingNav } from "@/components/landing/LandingNav";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { FeatureSection } from "@/components/landing/FeatureSection";
import { GradeReference } from "@/components/landing/GradeReference";
import { CTASection } from "@/components/landing/CTASection";
import { LandingFooter } from "@/components/landing/LandingFooter";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      
      <main>
        <BentoGrid />
        <FeatureSection />
        <GradeReference />
        <CTASection />
      </main>
      
      <LandingFooter />
    </div>
  );
};

export default Landing;
