import { Button } from "@/components/ui/button";
import { Video, Users, Clock, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LiveClassesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-landing-dark relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-landing-accent/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(142_76%_36%/0.08),transparent_70%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Illustration Side */}
          <div className="flex-1 relative">
            <div className="relative max-w-md mx-auto">
              {/* Main Card */}
              <div className="bg-landing-card rounded-3xl p-6 border border-landing-accent/20 shadow-2xl shadow-landing-accent/10">
                {/* Video Preview Area */}
                <div className="relative aspect-video bg-landing-dark rounded-2xl overflow-hidden mb-4">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-landing-accent/10 to-landing-accent-light/5" />
                  
                  {/* Presenter Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-landing-accent/20 flex items-center justify-center animate-float-slow">
                      <span className="text-5xl">👨‍🏫</span>
                    </div>
                  </div>

                  {/* Live Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse-live" />
                    <span className="text-white text-sm font-bold">LIVE</span>
                  </div>

                  {/* Viewer Count */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-landing-dark/80 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <Users className="w-4 h-4 text-landing-accent" />
                    <span className="text-landing-text text-sm">128 watching</span>
                  </div>

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-landing-accent/80 flex items-center justify-center cursor-pointer hover:bg-landing-accent transition-all duration-300 hover:scale-110 shadow-lg shadow-landing-accent/30">
                      <Play className="w-6 h-6 text-landing-dark ml-1" />
                    </div>
                  </div>
                </div>

                {/* Class Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-landing-text font-bold">
                      Data Structures & Algorithms
                    </h4>
                    <div className="flex items-center gap-1 text-landing-muted text-sm">
                      <Clock className="w-4 h-4" />
                      <span>45 min</span>
                    </div>
                  </div>
                  <p className="text-landing-muted text-sm">
                    Prof. John Smith • Binary Trees & Traversals
                  </p>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-landing-accent/20 rounded-2xl p-4 animate-float border border-landing-accent/30">
                <Video className="w-8 h-8 text-landing-accent" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-landing-dark rounded-xl p-3 animate-float-slow border border-landing-accent/20 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-landing-accent/30" />
                    <div className="w-6 h-6 rounded-full bg-landing-accent-light/30" />
                    <div className="w-6 h-6 rounded-full bg-landing-accent/40" />
                  </div>
                  <span className="text-landing-muted text-xs">+25 more</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse-live" />
              <span className="text-red-400 text-sm font-medium">
                Live Classes
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-landing-text mb-6">
              Attend Live Classes &{" "}
              <span className="text-landing-accent">Never Miss</span> a Lecture
            </h2>

            <p className="text-landing-muted text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              Join interactive live sessions with your professors, ask questions
              in real-time, and access recorded lectures whenever you need them.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button
                onClick={() => navigate("/auth")}
                size="lg"
                className="bg-landing-accent hover:bg-landing-accent-light text-landing-dark font-bold px-8 py-6 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-landing-accent/30"
              >
                Join a Class
              </Button>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-landing-accent/10 flex items-center justify-center">
                  <Video className="w-5 h-5 text-landing-accent" />
                </div>
                <span className="text-landing-muted">HD Video Quality</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-landing-accent/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-landing-accent" />
                </div>
                <span className="text-landing-muted">Interactive Sessions</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-landing-accent/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-landing-accent" />
                </div>
                <span className="text-landing-muted">Recorded Access</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-landing-accent/10 flex items-center justify-center">
                  <Play className="w-5 h-5 text-landing-accent" />
                </div>
                <span className="text-landing-muted">On-Demand Replay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveClassesSection;
