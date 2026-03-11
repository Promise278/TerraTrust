"use client"
import Link from "next/link";
// import { Shield } from "lucide-react";
import logoIcon from "../public/logo-icon.png";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#121f19] backdrop-blur-md border-b border-[#3a4641]">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <Image src={logoIcon} alt="TerraTrust" className="w-8 h-8" />
          <span className="font-display text-lg text-primary-foreground font-serif">TerraTrust</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {["Problem", "Solution", "Market", "Model"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-body text-sm text-[#d8cca7] hover:text-[#b38956] transition-colors"
            >
              {item}
            </a>
          ))}
          <Link
            href="/pages/signuppage"
            className="font-body text-sm font-semibold bg-[#c8a641] text-[#1b1c17] px-5 py-2 rounded-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;