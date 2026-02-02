import { LandingNav } from "@/components/landing/LandingNav";
import { BookScroll } from "@/components/book/BookScroll";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingAbout } from "@/components/landing/LandingAbout";
import { LandingCTA } from "@/components/landing/LandingCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";

const Landing = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1a1a1a" }}>
      {/* Fixed Navigation */}
      <LandingNav />

      {/* Hero Scroll Animation */}
      <BookScroll />

      {/* Features Section */}
      <LandingFeatures />

      {/* About Section */}
      <LandingAbout />

      {/* CTA Section */}
      <LandingCTA />
      
      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default Landing;
