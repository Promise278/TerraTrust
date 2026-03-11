"use client"
import { Shield } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="py-12 border-t border-border bg-[#fefffe]">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#0f1a16]" />
          <span className="font-display text-base text-[#0f1a16]">TerraTrust</span>
          <span className="font-body text-sm text-[#61776f] ml-2">by LandChain</span>
        </div>
        <p className="font-body text-sm text-[#61776f]">
          © {new Date().getFullYear()} LandChain Technologies. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;