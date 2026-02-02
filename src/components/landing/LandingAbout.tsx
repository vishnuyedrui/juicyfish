import { motion } from "framer-motion";

export function LandingAbout() {
  return (
    <section 
      id="about"
      className="relative py-24 px-6 md:px-12"
      style={{ backgroundColor: "#0f0f0f" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-white/40 text-sm uppercase tracking-widest mb-4">About JuicyFish</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white/90 tracking-tight mb-6">
              Built by Students,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500">
                For Students
              </span>
            </h2>
            <div className="space-y-4 text-white/60 text-lg leading-relaxed">
              <p>
                JuicyFish started as a simple spreadsheet to calculate SGPA during exam season. 
                It evolved into a full-fledged academic companion when we realized every student 
                faces the same challenges.
              </p>
              <p>
                No more complex formulas. No more attendance anxiety. No more scattered resources. 
                We've unified everything into one clean, intuitive experience that respects your time 
                and helps you focus on what matters—learning.
              </p>
              <p>
                Created by Team Dino at RGUKT, JuicyFish is completely free and always will be. 
                Because education should be accessible to everyone.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-white/90">10K+</div>
                <div className="text-white/40 text-sm">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white/90">50K+</div>
                <div className="text-white/40 text-sm">Calculations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white/90">100%</div>
                <div className="text-white/40 text-sm">Free Forever</div>
              </div>
            </div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Decorative elements */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-500/20 to-cyan-500/20 blur-3xl" />
              
              <div className="relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                {/* Mock UI Preview */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-lg">
                      🐟
                    </div>
                    <div>
                      <div className="text-white/90 font-semibold">JuicyFish</div>
                      <div className="text-white/40 text-sm">Academic Companion</div>
                    </div>
                  </div>
                  
                  <div className="h-px bg-white/10" />
                  
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-white/5">
                      <div className="text-white/40 text-xs mb-1">Current SGPA</div>
                      <div className="text-2xl font-bold text-white/90">8.72</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5">
                      <div className="text-white/40 text-xs mb-1">Attendance</div>
                      <div className="text-2xl font-bold text-green-400">87%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5">
                      <div className="text-white/40 text-xs mb-1">Classes Today</div>
                      <div className="text-2xl font-bold text-cyan-400">4</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
