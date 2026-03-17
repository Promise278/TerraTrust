"use client"
import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import Link from "next/link";

const CtaSection = () => {
  return (
    <section className="py-32 bg-[#f7f8f7]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <Shield className="w-12 h-12 text-[#0f1a16] mx-auto mb-6" />
          <h2 className="font-display text-4xl md:text-5xl text-[#0f1a16] leading-tight mb-6">
            {"Ready to secure Nigeria's land future?"}
          </h2>
          <p className="font-body text-lg text-[#61776f] mb-10 max-w-xl mx-auto leading-relaxed">
            Join the movement to build transparent, tamper-resistant land infrastructure. 
            Partner with us as a state agency, community leader, or technology collaborator.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href='/pages/signuppage'>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-[#18422f] text-whote font-body font-semibold px-12 py-6 rounded-lg text-base"
            >
              Get Started
              <ArrowRight className="w-6 h-6" />
            </motion.button>
            </Link>
            <Link href="/pages/signuppage">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 border border-border text-[#61776f] font-body font-medium px-16 py-6 rounded-lg text-base hover:bg-muted transition-colors"
            >
              SignIn
            </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;