import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";

export function LandingCTA() {
  return (
    <section 
      className="relative py-24 px-6 md:px-12 overflow-hidden"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-cyan-500/5" />
      
      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-white/40 text-sm uppercase tracking-widest mb-4">Get Started</p>
          <h2 className="text-4xl md:text-6xl font-bold text-white/90 tracking-tight mb-6">
            Ready to Ace<br />Your Semester?
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto mb-10">
            Join thousands of students who've already simplified their academic life with JuicyFish.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="/calculator"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1a1a1a] font-semibold rounded-full hover:bg-white/90 transition-colors"
            >
              Calculate Your GPA
              <ArrowRight className="w-5 h-5" />
            </motion.a>
            
            <motion.a
              href="/downloads/juicyfish.apk"
              download
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
            >
              <Download className="w-5 h-5" />
              Download App
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
