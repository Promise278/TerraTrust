"use client"
import { motion } from "framer-motion";
import { AlertTriangle, FileX, Users, Eye } from "lucide-react";

const problems = [
  {
    icon: FileX,
    title: "Title Forgery",
    description: "Paper-based certificates are easily duplicated or forged, enabling fraudulent ownership claims across states.",
  },
  {
    icon: Users,
    title: "Duplicate Sales",
    description: "The same parcel is sold to multiple buyers due to fragmented, non-interoperable registries.",
  },
  {
    icon: Eye,
    title: "Opaque Transfers",
    description: "Transfer processes lack transparency, creating room for bribery and manipulation by intermediaries.",
  },
  {
    icon: AlertTriangle,
    title: "Community Vulnerability",
    description: "Community-owned lands are seized without consent due to absent or unrecognized governance records.",
  },
];

const ProblemSection = () => {
  return (
    <section className="py-24 bg-[#fefffe]" id="problem">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-16"
        >
          <span className="font-body text-sm font-semibold tracking-[0.15em] uppercase text-[#c8a641] mb-4 block">
            The Problem
          </span>
          <h2 className="font-semibold text-4xl md:text-5xl text-[#0f1a16] leading-tight">
            Land fraud costs Nigeria billions every year
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {problems.map((problem, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-5 p-8 rounded-xl border border-[#d6dfd6] bg-[#f7f8f7] hover:shadow-lg transition-shadow"
            >
              <div className="shrink-0 w-12 h-12 rounded-lg bg-[#e0e7e3] flex items-center justify-center">
                <problem.icon className="w-6 h-6 text-[#1f4634]" />
              </div>
              <div>
                <h3 className="font-display text-xl text-[#0f1a16] mb-2">{problem.title}</h3>
                <p className="font-body text-[#61776f] leading-relaxed">{problem.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;