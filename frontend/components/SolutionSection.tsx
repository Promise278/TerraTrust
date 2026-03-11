"use client";
import { motion } from "framer-motion";
import { Fingerprint, ShieldCheck, Landmark, Smartphone } from "lucide-react";

const pillars = [
  {
    icon: Fingerprint,
    title: "Secure Digital Title Records",
    description:
      "Every land title is registered as a unique, secure digital record — creating a tamper-proof digital certificate of ownership that can be verified by anyone, anytime.",
  },
  {
    icon: ShieldCheck,
    title: "Community Land Governance",
    description:
      "Traditional community land structures are digitized with multi-signature approval flows, ensuring collective consent before any transfer or development.",
  },
  {
    icon: Landmark,
    title: "State Registry Co-Signing",
    description:
      "Government land agencies co-sign every title record, creating a dual-authority verification layer that bridges digital records with official registries.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Workflow",
    description:
      "Built for Nigeria's mobile-dominant users — verify ownership, initiate transfers, and resolve disputes from any smartphone, even on low bandwidth.",
  },
];

const SolutionSection = () => {
  return (
    <section className="py-24 bg-[#f7f8f7]" id="solution">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <span className="font-body text-sm font-semibold tracking-[0.15em] uppercase text-[#c8a641] mb-4 block">
            The Solution
          </span>
          <h2 className="font-bold font-serif text-4xl md:text-5xl text-[#0f1a16] leading-tight">
            Four pillars of trust
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-0 border-2 rounded-2xl overflow-hidden">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`p-10 ${i < 2 ? "border-b border-border" : ""} ${i % 2 === 0 ? "md:border-r border-border" : ""}`}
            >
              <div className="w-14 h-14 rounded-xl bg-[#18422f] flex items-center justify-center mb-6">
                <pillar.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display text-2xl text-[#0f1a16] mb-3">
                {pillar.title}
              </h3>
              <p className="font-body text-[#65776e] leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
