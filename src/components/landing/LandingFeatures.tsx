import { motion } from "framer-motion";
import { Calculator, Calendar, BookOpen, TrendingUp, Clock, Target } from "lucide-react";

const features = [
  {
    icon: Calculator,
    title: "SGPA/CGPA Calculator",
    description: "Calculate your semester and cumulative GPA with precision. Supports 10-point grading system used by most Indian universities.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Calendar,
    title: "Attendance Tracker",
    description: "Never miss the 75% attendance threshold. Track subject-wise attendance and get smart recommendations.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: TrendingUp,
    title: "What-If Scenarios",
    description: "Plan your future grades. See how skipping classes or scoring differently affects your final GPA.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: BookOpen,
    title: "Course Resources",
    description: "Access study materials, previous papers, and notes organized by semester and subject.",
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: Clock,
    title: "Timetable Management",
    description: "Set up your weekly schedule and track classes automatically with holiday support.",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Set GPA targets and get personalized insights on how to achieve your academic goals.",
    color: "from-red-500 to-pink-500",
  },
];

export function LandingFeatures() {
  return (
    <section 
      id="features"
      className="relative py-24 px-6 md:px-12"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-white/40 text-sm uppercase tracking-widest mb-4">What We Offer</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white/90 tracking-tight">
            Everything You Need to Excel
          </h2>
          <p className="mt-4 text-white/60 text-lg max-w-2xl mx-auto">
            Built by students, for students. JuicyFish combines all your academic tools in one beautiful interface.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`
                w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} 
                flex items-center justify-center mb-4
                group-hover:scale-110 transition-transform duration-300
              `}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white/90 mb-2">
                {feature.title}
              </h3>
              <p className="text-white/50 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover gradient */}
              <div className={`
                absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 
                group-hover:opacity-5 transition-opacity duration-300 pointer-events-none
              `} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
