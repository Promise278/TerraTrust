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
  FileText,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  fullname?: string;
  email: string;
  role: string;
  isVerified?: boolean;
}

interface Land {
  id: string;
  title: string;
  location: string;
  status: string;
  price: number | string;
  imageUrl?: string;
  owner?: { name: string; fullname?: string; email: string };
  buyer?: { name: string; fullname?: string; email: string };
}

interface Stats {
  totalUsers: number;
  totalLands: number;
  totalBuyers: number;
  totalOwners: number;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "lands">("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentLands, setRecentLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);

  // Users Management State
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [userFilter, setUserFilter] = useState<"all" | "landowner" | "buyer">("all");
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Lands Management State
  const [allLands, setAllLands] = useState<Land[]>([]);
  const [loadingLands, setLoadingLands] = useState(false);

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

  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await api.get("/dashboard/admin/users");
      setAllUsers(response.data.data);
    } catch {
      toast.error("Failed to load users list");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchAllLands = async () => {
    setLoadingLands(true);
    try {
      const response = await api.get("/dashboard/admin/lands");
      setAllLands(response.data.data);
    } catch {
      toast.error("Failed to load lands list");
    } finally {
      setLoadingLands(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === "users") fetchAllUsers();
    if (activeTab === "lands") fetchAllLands();
  }, [activeTab]);

  const handleVerify = async (userId: string) => {
    try {
      await api.post("/auth/verify-landowner", { userId });
      toast.success("Landowner verified successfully");
      if (activeTab === "overview") fetchData();
      if (activeTab === "users") fetchAllUsers();
    } catch {
      toast.error("Failed to verify landowner");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#18422f] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const filteredUsers = allUsers.filter(u => userFilter === "all" || u.role === userFilter);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl text-[#0f1a16] font-bold">
              Admin Terminal
            </h1>
            <p className="text-[#61776f] mt-2 text-lg">
              {activeTab === "overview" && "Platform-wide statistics and system health."}
              {activeTab === "users" && "Manage registered landowners and buyers."}
              {activeTab === "lands" && "Complete registry of all land certificates."}
            </p>
          </div>
          
          <div className="flex bg-[#f3f5f4] p-1.5 rounded-2xl border border-[#e5e9e7]">
            {(["overview", "users", "lands"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all capitalize ${
                  activeTab === tab 
                    ? "bg-white text-[#18422f] shadow-sm" 
                    : "text-[#61776f] hover:text-[#0f1a16]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="flex flex-col gap-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-[#e5e9e7] shadow-sm relative overflow-hidden group hover:border-[#18422f]/20 transition-all">
                <Users className="absolute top-[-10px] right-[-10px] w-24 h-24 text-[#f3f5f4] group-hover:text-[#18422f]/5 transition-all" />
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

              <div className="bg-white p-6 rounded-3xl border border-[#e5e9e7] shadow-sm relative overflow-hidden group hover:border-[#18422f]/20 transition-all">
                <MapPin className="absolute top-[-10px] right-[-10px] w-24 h-24 text-[#f3f5f4] group-hover:text-[#18422f]/5 transition-all" />
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

              <div className="bg-white p-6 rounded-3xl border border-[#e5e9e7] shadow-sm relative overflow-hidden group hover:border-[#18422f]/20 transition-all">
                <Shield className="absolute top-[-10px] right-[-10px] w-24 h-24 text-[#f3f5f4] group-hover:text-[#18422f]/5 transition-all" />
                <div className="relative z-10">
                  <p className="text-[#61776f] font-bold text-xs uppercase tracking-widest mb-1">
                    Security Policy
                  </p>
                  <p className="text-3xl font-bold text-[#0f1a16]">Active</p>
                  <p className="mt-4 text-[10px] text-[#61776f] font-medium uppercase tracking-tighter">
                    Rate limits enforced
                  </p>
                </div>
              </div>

              <div className="bg-[#18422f] p-6 rounded-3xl shadow-sm text-white">
                <p className="text-white/60 font-bold text-xs uppercase tracking-widest mb-1">
                  System Status
                </p>
                <p className="text-3xl font-bold">Healthy</p>
                <button className="mt-4 w-full bg-white/10 hover:bg-white/20 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/10">
                  Run Diagnostics
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Activity: Users */}
              <div className="bg-white rounded-[32px] border border-[#e5e9e7] p-8 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[#0f1a16]">
                    Latest Registrations
                  </h2>
                  <button
                    onClick={() => setActiveTab("users")}
                    className="text-[#18422f] font-bold text-sm hover:underline flex items-center gap-1"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {recentUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center gap-4 p-4 bg-[#f3f5f4] rounded-2xl border border-transparent hover:border-[#e5e9e7] hover:bg-white transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-bold text-[#0f1a16] border border-[#e5e9e7]">
                        {(u.fullname || u.name).charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-[#0f1a16] truncate text-sm">
                            {u.fullname || u.name}
                          </p>
                          {u.isVerified && (
                            <Shield className="w-3 h-3 text-green-600" />
                          )}
                        </div>
                        <p className="text-[10px] text-[#61776f] truncate">{u.email}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                        u.role === "admin" ? "bg-purple-50 text-purple-700" : 
                        u.role === "landowner" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
                      }`}>
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity: Lands */}
              <div className="bg-white rounded-[32px] border border-[#e5e9e7] p-8 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[#0f1a16]">
                    Registry Feed
                  </h2>
                  <button
                    onClick={() => setActiveTab("lands")}
                    className="text-[#18422f] font-bold text-sm hover:underline flex items-center gap-1"
                  >
                    Manage Registry <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {recentLands.length === 0 ? (
                    <div className="py-12 text-center text-[#61776f] italic text-sm">
                      No recent registry entries.
                    </div>
                  ) : (
                    recentLands.map((l) => (
                      <div
                        key={l.id}
                        className="flex items-center gap-4 p-4 bg-[#f3f5f4] rounded-2xl border border-transparent hover:border-[#e5e9e7] hover:bg-white transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-[#e5e9e7]">
                          <FileText className="w-5 h-5 text-[#18422f]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#0f1a16] truncate text-sm">
                            {l.title}
                          </p>
                          <p className="text-[10px] text-[#61776f] truncate flex items-center gap-1 uppercase tracking-tighter">
                            <MapPin className="w-2.5 h-2.5" />
                            {l.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-[#0f1a16]">
                            {l.owner?.fullname || l.owner?.name}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white rounded-[32px] border border-[#e5e9e7] overflow-hidden flex flex-col shadow-sm">
            <div className="p-8 border-b border-[#e5e9e7] bg-[#f8f9f8] flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#0f1a16]">User Management</h2>
                <p className="text-[#61776f] text-sm">Verify landowners and monitor platform activity.</p>
              </div>
              <div className="flex bg-white p-1 rounded-xl border border-[#e5e9e7] shadow-sm">
                {(["all", "landowner", "buyer"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setUserFilter(filter)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                      userFilter === filter 
                        ? "bg-[#18422f] text-white" 
                        : "text-[#61776f] hover:text-[#0f1a16]"
                    }`}
                  >
                    {filter}s
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-8">
              {loadingUsers ? (
                <div className="flex justify-center py-20">
                  <div className="w-8 h-8 border-4 border-[#18422f] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers.map((u) => (
                    <div key={u.id} className="bg-[#f3f5f4] p-6 rounded-3xl border border-transparent hover:border-[#18422f]/10 hover:bg-white hover:shadow-lg transition-all flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-bold text-[#0f1a16] border border-[#e5e9e7] shadow-sm">
                          {(u.fullname || u.name).charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-[#0f1a16] truncate">{u.fullname || u.name}</h3>
                            {u.isVerified && <Shield className="w-3.5 h-3.5 text-green-600" />}
                          </div>
                          <p className="text-xs text-[#61776f] truncate">{u.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-auto">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          u.role === "admin" ? "bg-purple-100 text-purple-700" : 
                          u.role === "landowner" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {u.role}
                        </span>
                        
                        {u.role === "landowner" && !u.isVerified && (
                          <button
                            onClick={() => handleVerify(u.id)}
                            className="text-xs font-bold bg-[#18422f] text-white px-4 py-1.5 rounded-xl hover:-translate-y-px transition-all shadow-sm"
                          >
                            Verify Owner
                          </button>
                        )}
                        
                        {u.isVerified && (
                          <span className="flex items-center gap-1 text-[#18422f] text-[10px] font-bold uppercase">
                            <CheckCircle2 className="w-3 h-3" /> Accredited
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {filteredUsers.length === 0 && (
                    <div className="col-span-full py-20 text-center text-[#61776f] italic">
                      No users found for this category.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "lands" && (
          <div className="bg-white rounded-[32px] border border-[#e5e9e7] overflow-hidden flex flex-col shadow-sm">
            <div className="p-8 border-b border-[#e5e9e7] bg-[#f8f9f8]">
              <h2 className="text-2xl font-bold text-[#0f1a16]">Global Land Registry</h2>
              <p className="text-[#61776f] text-sm">Official database of all land titles and ownership certificates.</p>
            </div>
            
            <div className="p-8">
              {loadingLands ? (
                <div className="flex justify-center py-20">
                  <div className="w-8 h-8 border-4 border-[#18422f] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allLands.map((l) => (
                    <div key={l.id} className="flex items-center gap-6 p-6 bg-[#f3f5f4] rounded-[24px] border border-transparent hover:border-[#18422f]/10 hover:bg-white hover:shadow-lg transition-all">
                      <div className="w-24 h-24 rounded-2xl bg-[#18422f]/5 overflow-hidden border border-[#18422f]/10 shrink-0 relative">
                        {l.imageUrl ? (
                          <Image 
                            src={l.imageUrl} 
                            alt={l.title} 
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-8 h-8 text-[#18422f]" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-[#0f1a16] truncate text-lg">{l.title}</h3>
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border ${
                            l.status === 'sold'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-white text-[#18422f] border-[#e5e9e7]'
                          }`}>
                            {l.status === 'sold' ? 'Transferred' : 'Certified'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[#61776f] text-xs mb-3">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate">{l.location}</span>
                        </div>
                        <div className="flex items-center gap-4 pt-4 border-t border-[#e5e9e7]">
                          <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-[#18422f] border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                              {(l.owner?.fullname || l.owner?.name || "U").charAt(0)}
                            </div>
                          </div>
                          <p className="text-[11px] font-medium text-[#0f1a16] flex flex-col">
                            <span><span className="text-[#61776f]">Owner:</span> {l.owner?.fullname || l.owner?.fullname}</span>
                            {l.status === 'sold' && l.buyer && (
                              <span className="text-amber-700 mt-0.5">
                                <span className="text-amber-600/60">Sold to:</span> {l.buyer.fullname}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {allLands.length === 0 && (
                    <div className="col-span-full py-20 text-center text-[#61776f] italic">
                      No land certificates found in the registry.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
