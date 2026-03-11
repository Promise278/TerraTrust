"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/utils/api";
import {
  Users,
  MapPin,
  Activity,
  Shield,
  ArrowRight,
  UserPlus,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Land {
  id: string;
  title: string;
  location: string;
  owner?: { name: string };
}

interface Stats {
  totalUsers: number;
  totalLands: number;
  totalBuyers: number;
  totalOwners: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentLands, setRecentLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/dashboard/admin");
        setStats(response.data.stats);
        setRecentUsers(response.data.recentUsers);
        setRecentLands(response.data.recentLands);
      } catch {
        toast.error("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#18422f] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-display text-4xl text-[#0f1a16] font-bold">
            System Overview
          </h1>
          <p className="text-[#61776f] mt-2 text-lg">
            Platform-wide statistics and management controls for TerraTrust.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#e5e9e7] shadow-sm relative overflow-hidden">
            <Users className="absolute top-[-10px] right-[-10px] w-24 h-24 text-[#f3f5f4]" />
            <div className="relative z-10">
              <p className="text-[#61776f] font-bold text-xs uppercase tracking-widest mb-1">
                Total Users
              </p>
              <p className="text-3xl font-bold text-[#0f1a16]">
                {stats?.totalUsers}
              </p>
              <div className="mt-4 flex gap-2">
                <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">
                  {stats?.totalOwners} Owners
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                  {stats?.totalBuyers} Buyers
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#e5e9e7] shadow-sm relative overflow-hidden">
            <MapPin className="absolute top-[-10px] right-[-10px] w-24 h-24 text-[#f3f5f4]" />
            <div className="relative z-10">
              <p className="text-[#61776f] font-bold text-xs uppercase tracking-widest mb-1">
                Registered Land
              </p>
              <p className="text-3xl font-bold text-[#0f1a16]">
                {stats?.totalLands}
              </p>
              <p className="mt-4 text-[10px] text-[#61776f] font-medium flex items-center gap-1">
                <Activity className="w-3 h-3 text-green-500" />
                Live in registry
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#e5e9e7] shadow-sm relative overflow-hidden">
            <Shield className="absolute top-[-10px] right-[-10px] w-24 h-24 text-[#f3f5f4]" />
            <div className="relative z-10">
              <p className="text-[#61776f] font-bold text-xs uppercase tracking-widest mb-1">
                System Health
              </p>
              <p className="text-3xl font-bold text-[#0f1a16]">Operational</p>
              <p className="mt-4 text-[10px] text-[#61776f] font-medium">
                Synced with PostgreSQL
              </p>
            </div>
          </div>

          <div className="bg-[#18422f] p-6 rounded-3xl shadow-sm text-white">
            <p className="text-white/60 font-bold text-xs uppercase tracking-widest mb-1">
              Platform Status
            </p>
            <p className="text-3xl font-bold">Secure</p>
            <button className="mt-4 w-full bg-white/10 hover:bg-white/20 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
              View Security Logs
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white rounded-[32px] border border-[#e5e9e7] p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#0f1a16]">
                Latest Registrations
              </h2>
              <button className="text-[#18422f] font-bold text-sm hover:underline flex items-center gap-1">
                All Users <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {recentUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-4 p-4 bg-[#f3f5f4] rounded-2xl group hover:bg-[#e2e8e5] transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-bold text-[#0f1a16]">
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#0f1a16] truncate">
                      {u.name}
                    </p>
                    <p className="text-xs text-[#61776f] truncate">{u.email}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : u.role === "landowner"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Lands */}
          <div className="bg-white rounded-[32px] border border-[#e5e9e7] p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#0f1a16]">
                New Registry Entries
              </h2>
              <button className="text-[#18422f] font-bold text-sm hover:underline flex items-center gap-1">
                Full Registry <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {recentLands.length === 0 ? (
                <div className="py-12 text-center text-[#61776f] italic">
                  No land entries yet.
                </div>
              ) : (
                recentLands.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center gap-4 p-4 bg-[#f3f5f4] rounded-2xl group hover:bg-[#e2e8e5] transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#18422f]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#0f1a16] truncate">
                        {l.title}
                      </p>
                      <p className="text-xs text-[#61776f] truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {l.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#61776f] font-bold uppercase tracking-widest">
                        Owner
                      </p>
                      <p className="text-xs font-bold text-[#0f1a16] truncate max-w-[100px]">
                        {l.owner?.name}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="mt-2 w-full border-2 border-dashed border-[#e5e9e7] p-6 rounded-3xl flex flex-col items-center gap-2 hover:bg-[#f3f5f4] transition-all group">
              <UserPlus className="w-8 h-8 text-[#61776f] group-hover:text-[#18422f] transition-all" />
              <p className="text-sm font-bold text-[#61776f] group-hover:text-[#0f1a16]">
                Manually Add System User
              </p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
