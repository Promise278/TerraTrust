"use client"
import { motion } from "framer-motion";
import { Coins, Building, Scale, Layers } from "lucide-react";

const streams = [
  {
    icon: Coins,
    title: "Transaction Fees",
    description: "Micro-fee on every title verification, transfer, and registry lookup — affordable at scale.",
  },
  {
    icon: Building,
    title: "State Licensing",
    description: "Annual licensing fees for state land agencies integrating with TerraTrust infrastructure.",
  },
  {
    icon: Scale,
    title: "Dispute Resolution",
    description: "Premium arbitration services for contested land claims with on-chain evidence packages.",
  },
  {
    icon: Layers,
    title: "API & Data Services",
    description: "Title verification APIs for banks, developers, and real estate platforms requiring ownership proof.",
  },
];

const ModelSection = () => {
  return (
    <section className="py-24 bg-[#fefffe]" id="model">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="font-body text-sm font-semibold tracking-[0.15em] uppercase text-[#c8a641] mb-4 block">
            Commercial Model
          </span>
          <h2 className="font-serif font-semibold text-4xl md:text-5xl text-[#0f1a16] leading-tight">
            Revenue streams built for scale
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {streams.map((stream, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-8 rounded-xl bg-[#f7f8f7] border border-border"
            >
              <div className="w-14 h-14 rounded-full bg-[#f0eddd] flex items-center justify-center mx-auto mb-5">
                <stream.icon className="w-7 h-7 text-[#ceb25a]" />
              </div>
              <h3 className="font-semibold text-lg text-[#0f1a16] mb-2">{stream.title}</h3>
              <p className="font-body text-sm text-[#7c8a9a] leading-relaxed">{stream.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModelSection;