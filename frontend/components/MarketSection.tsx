"use client"
import { motion } from "framer-motion";

const segments = [
  { phase: "Phase 1", market: "Lagos Urban Core", volume: "High-volume transactions", timeline: "Year 1" },
  { phase: "Phase 2", market: "Abuja & Port Harcourt", volume: "Government + commercial land", timeline: "Year 2" },
  { phase: "Phase 3", market: "Community Lands (South-West)", volume: "Traditional governance systems", timeline: "Year 2–3" },
  { phase: "Phase 4", market: "Pan-Nigeria & West Africa", volume: "Cross-border expansion", timeline: "Year 3–5" },
];

const MarketSection = () => {
  return (
    <section className="py-24" id="market" style={{ background: "#0e2119" }}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-16"
        >
          <span className="font-body text-sm font-semibold tracking-[0.15em] uppercase text-[#c8a641] mb-4 block">
            Market & Rollout
          </span>
          <h2 className="font-semibold font-serif text-4xl md:text-5xl text-[#fdf7e9] leading-tight mb-6">
            Strategic expansion from Lagos outward
          </h2>
          <p className="font-body text-lg text-[#d8cca7] leading-relaxed">
            {"Starting with Nigeria's highest-volume urban land market, expanding through government partnerships and community governance integrations."}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {segments.map((seg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="rounded-xl border border-[#3c4737] p-8 backdrop-blur-sm bg-[#13281e]"
            >
              <span className="font-body text-xs font-bold tracking-[0.15em] uppercase text-[#c8a641] mb-3 block">
                {seg.phase}
              </span>
              <h3 className="font-display text-xl text-[#fdf7e9] mb-2">{seg.market}</h3>
              <p className="font-body text-sm text-[#d8cca7] mb-4">{seg.volume}</p>
              <div className="border-t border-[#3c4737] pt-3">
                <span className="font-body text-xs text-[#bdb396]">{seg.timeline}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketSection;