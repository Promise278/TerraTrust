"use client";
import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";
import heroBg from "../public/hero-bg.jpg";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={heroBg}
          alt="Lagos aerial landscape"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "#19281c", opacity: 0.92 }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-8 h-8 text-[#c8a641]" />
            <span className="font-body text-sm font-semibold tracking-[0.2em] uppercase text-[#c8a641]">
              TerraTrust by LandChain
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl text-primary-foreground leading-[1.1] mb-6 font-serif">
            Tamper-Resistant Land Registry for Nigeria
          </h1>

          <p className="font-body text-lg md:text-xl text-[#d8cca7] max-w-2xl mb-10 leading-relaxed">
            Prevent title forgery, duplicate sales, and opaque land transfer
            processes — powered by secure digital records, community governance,
            and state co-signing.
          </p>

          <div className="flex flex-wrap gap-4">
            <motion.a
              href="#solution"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-[#c8a641] text-[#1b1c17] font-body font-semibold px-8 py-4 rounded-lg text-base"
            >
              Explore the Solution
              <ArrowRight className="w-4 h-4" />
            </motion.a>
            <motion.a
              href="#market"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 border border-gold-muted/30 text-[#b59063] font-body font-medium px-8 py-4 rounded-lg text-base hover:bg-primary/50 transition-colors"
            >
              Market Opportunity
            </motion.a>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-[#3c4737] pt-10"
        >
          {[
            { value: "78%", label: "Land disputes from poor records" },
            { value: "N14T+", label: "Annual land transaction value" },
            { value: "200M+", label: "Nigerians affected" },
            { value: "97%", label: "Smartphone penetration growth" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="font-mono text-3xl md:text-4xl text-[#e9bb30] mb-1">
                {stat.value}
              </div>
              <div className="font-sans text-sm text-[#9e9b7b]">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
