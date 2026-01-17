import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Calculator, Calendar, Video, ChartLine } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    const element = document.getElementById("features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="min-h-screen relative overflow-hidden bg-gradient-to-b from-landing-dark via-landing-dark to-landing-card pt-24 pb-16"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Icons */}
        <div className="absolute top-[15%] left-[10%] animate-float opacity-20">
          <Calendar className="w-16 h-16 text-landing-accent" />
        </div>
        <div className="absolute top-[25%] right-[15%] animate-float-slow opacity-20">
          <Calculator className="w-20 h-20 text-landing-accent-light" />
        </div>
        <div className="absolute bottom-[30%] left-[5%] animate-float opacity-15">
          <BookOpen className="w-14 h-14 text-landing-accent" />
        </div>
        <div className="absolute top-[40%] right-[8%] animate-float-slow opacity-20">
          <Video className="w-12 h-12 text-landing-accent-light" />
        </div>
        <div className="absolute bottom-[20%] right-[20%] animate-float opacity-15">
          <ChartLine className="w-18 h-18 text-landing-accent" />
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-landing-accent/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-landing-accent-light/10 rounded-full blur-[80px] animate-pulse-slow" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-landing-accent/10 border border-landing-accent/20 mb-6">
              <span className="text-2xl animate-bounce-gentle">🦕</span>
              <span className="text-landing-accent text-sm font-medium">
                Welcome to TeamDino
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-landing-text leading-tight mb-6">
              Simplify Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-landing-accent to-landing-accent-light">
                College Life
              </span>{" "}
              with GradeGuru
            </h1>

            <p className="text-lg md:text-xl text-landing-muted max-w-2xl mx-auto lg:mx-0 mb-8">
              Track attendance, calculate grades, access resources, and join
              live classes — all in one place designed by students, for
              students.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={() => navigate("/auth")}
                size="lg"
                className="bg-landing-accent hover:bg-landing-accent-light text-landing-dark font-bold px-8 py-6 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-landing-accent/30 group"
              >
                Get Started
                <span className="ml-2 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Button>
              <Button
                onClick={scrollToFeatures}
                size="lg"
                variant="outline"
                className="border-landing-accent/50 text-landing-accent hover:bg-landing-accent/10 hover:border-landing-accent px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
              >
                Explore Features
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-landing-accent">
                  1000+
                </div>
                <div className="text-landing-muted text-sm">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-landing-accent">
                  50+
                </div>
                <div className="text-landing-muted text-sm">Subjects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-landing-accent">
                  99%
                </div>
                <div className="text-landing-muted text-sm">Accuracy</div>
              </div>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="flex-1 relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main Card */}
              <div className="relative bg-landing-card/80 backdrop-blur-sm rounded-3xl p-8 border border-landing-accent/20 shadow-2xl shadow-landing-accent/10 animate-scale-in">
                {/* Floating Elements around card */}
                <div className="absolute -top-6 -left-6 bg-landing-accent/20 rounded-2xl p-4 animate-float border border-landing-accent/30">
                  <Calendar className="w-8 h-8 text-landing-accent" />
                </div>
                <div className="absolute -top-4 -right-4 bg-landing-accent-light/20 rounded-2xl p-3 animate-float-slow border border-landing-accent-light/30">
                  <Calculator className="w-6 h-6 text-landing-accent-light" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-landing-accent/20 rounded-2xl p-3 animate-float border border-landing-accent/30">
                  <ChartLine className="w-6 h-6 text-landing-accent" />
                </div>

                {/* Card Content */}
                <div className="space-y-6">
                  {/* Mascot */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-landing-accent to-landing-accent-light flex items-center justify-center text-3xl animate-bounce-gentle">
                      🦕
                    </div>
                    <div>
                      <h3 className="text-landing-text font-bold text-xl">
                        Hey Student!
                      </h3>
                      <p className="text-landing-muted text-sm">
                        Ready to ace your semester?
                      </p>
                    </div>
                  </div>

                  {/* Sample Stats */}
                  <div className="space-y-3">
                    <div className="bg-landing-dark/50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-landing-muted text-sm">
                          Today's Attendance
                        </span>
                        <span className="text-landing-accent font-bold">
                          85%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-landing-dark rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-gradient-to-r from-landing-accent to-landing-accent-light rounded-full" />
                      </div>
                    </div>

                    <div className="bg-landing-dark/50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-landing-muted text-sm">
                          Current CGPA
                        </span>
                        <span className="text-landing-accent-light font-bold">
                          8.5
                        </span>
                      </div>
                      <div className="w-full h-2 bg-landing-dark rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-gradient-to-r from-landing-accent-light to-landing-accent rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Live Badge */}
                  <div className="flex items-center gap-3 bg-landing-dark/50 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse-live" />
                      <span className="text-red-400 text-sm font-medium">
                        LIVE
                      </span>
                    </div>
                    <span className="text-landing-muted text-sm">
                      Data Structures class in progress
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-gentle">
        <div className="w-6 h-10 border-2 border-landing-accent/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-landing-accent rounded-full animate-scroll-indicator" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
