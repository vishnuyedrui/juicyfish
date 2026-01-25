import { DecoHeader } from "@/components/landing/DecoHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { GradeReference } from "@/components/landing/GradeReference";
import { TrustSection } from "@/components/landing/TrustSection";
import { CTASection } from "@/components/landing/CTASection";
import { DecoFooter } from "@/components/landing/DecoFooter";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <DecoHeader />

      {/* Main Content - Single Page Scroll */}
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Problem Statement Section */}
        <ProblemSection />

        {/* Features Showcase Section */}
        <FeaturesSection />

        {/* Grade Reference Section */}
        <GradeReference />

        {/* Trust & Credibility Section */}
        <TrustSection />

        {/* Final CTA Section */}
        <CTASection />
      </main>

      {/* Footer */}
      <DecoFooter />
    </div>
  );
};

export default Landing;
