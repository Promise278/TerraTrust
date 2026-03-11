"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Search,
  ArrowRightLeft,
  FileCheck,
  Users,
  LogOut,
  Menu,
  Shield,
  MapPin,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";

const buyerItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/pages/userdashboard" },
  { label: "Find Lands", icon: Search, path: "/pages/userdashboard" },
  { label: "My Messages", icon: MessageSquare, path: "/pages/messages" },
];

const ownerItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/pages/ownerdashbaord" },
  { label: "My Lands", icon: FileCheck, path: "/pages/ownerdashbaord" },
  { label: "Messages", icon: MessageSquare, path: "/pages/messages" },
];

const adminItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/pages/dashboard" },
  { label: "All Lands", icon: MapPin, path: "/pages/dashboard" },
  { label: "Manage Users", icon: Users, path: "/pages/dashboard" },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems =
    user?.role === "admin"
      ? adminItems
      : user?.role === "landowner"
        ? ownerItems
        : buyerItems;

  return (
    <div className="min-h-screen bg-[#f8f9f8] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0f1a16]/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#e5e9e7] transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 px-6 h-16 border-b border-[#e5e9e7]">
          <Image
            src="/logo-icon.png"
            alt="TerraTrust"
            width={28}
            height={28}
            className="w-7 h-7"
          />
          <span className="font-display text-lg text-[#0f1a16] font-bold">
            TerraTrust
          </span>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm transition-colors ${
                pathname === item.path
                  ? "bg-[#18422f] text-white"
                  : "text-[#61776f] hover:bg-[#f3f5f4] hover:text-[#0f1a16]"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#e5e9e7]">
          <div className="flex items-center gap-3 mb-3 px-3">
            <div className="w-8 h-8 rounded-full bg-[#18422f]/10 flex items-center justify-center">
              <span className="font-body text-sm font-semibold text-[#18422f]">
                {user?.name?.charAt(0) || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm font-medium text-[#0f1a16] truncate">
                {user?.name || "User"}
              </p>
              <p className="font-body text-xs text-[#61776f] truncate capitalize">
                {user?.role || "Member"}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 w-full rounded-lg font-body text-sm text-[#61776f] hover:bg-[#fef2f2] hover:text-[#dc2626] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b border-[#e5e9e7] flex items-center px-6 bg-white lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[#0f1a16]"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-3 font-display text-lg text-[#0f1a16] font-bold">
            TerraTrust
          </span>
        </header>
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
