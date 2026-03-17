"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/utils/api";
import {
  FileCheck,
  MapPin,
  MessageSquare,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Shield,
  Activity,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

interface Land {
  id: string;
  title: string;
  description: string;
  location: string;
  price: string;
  status: string;
  imageUrl?: string;
}

interface Conversation {
  id: string;
  landId: string;
  landTitle: string;
  buyer: { id: string; name: string; email: string };
  messages: { text: string; createdAt: string }[];
}

import { useAuth } from "@/context/AuthContext";

const LandownerDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [lands, setLands] = useState<Land[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLand, setNewLand] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
  });
  const [editingLand, setEditingLand] = useState<Land | null>(null);
  const [sellingLand, setSellingLand] = useState<Land | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const isValidUrl = (url: string) => {
    if (!url) return false;
    return (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("/") ||
      url.startsWith("data:image/")
    );
  };

  const fetchData = async () => {
    try {
      const response = await api.get("/dashboard/owner");
      setLands(response.data.lands);
      setConversations(response.data.conversations);
    } catch {
      // console.error();
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdateLand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.isVerified) {
      toast.error("You must be verified by an admin to perform this action.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newLand.title);
    formData.append("description", newLand.description);
    formData.append("location", newLand.location);
    formData.append("price", newLand.price);
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (!editingLand) {
      toast.error("Please select an image for the property.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingLand) {
        await api.put(`/lands/updateland/${editingLand.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Land updated successfully!");
      } else {
        formData.append("status", "available");
        await api.post("/lands/createlands", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Land registered successfully!");
      }
      
      setIsModalOpen(false);
      setEditingLand(null);
      setNewLand({
        title: "",
        description: "",
        location: "",
        price: "",
      });
      setImageFile(null);
      fetchData();
    } catch {
      toast.error(editingLand ? "Failed to update land" : "Failed to register land");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (land: Land) => {
    setEditingLand(land);
    setNewLand({
      title: land.title,
      description: land.description,
      location: land.location,
      price: land.price,
    });
    setIsModalOpen(true);
  };

  const handleMarkAsSold = async (selectedBuyer: string) => {
    if (!sellingLand) return;
    setIsSubmitting(true);
    try {
      await api.put(`/lands/updateland/${sellingLand.id}`, {
        status: "sold",
        BuyerId: selectedBuyer,
      });
      toast.success("Property marked as sold!");
      setSellingLand(null);
      fetchData();
    } catch {
      toast.error("Failed to update property status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLand = async (id: string) => {
    if (!confirm("Are you sure you want to delete this land?")) return;
    try {
      await api.delete(`/lands/deleteland/${id}`);
      toast.success("Land deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete land");
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

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* Verification Banner */}
        {!user?.isVerified && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3 text-amber-800 animate-pulse">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm font-medium">
              Your account is pending verification by an administrator. You will
              be able to register new properties once verified.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-4xl text-[#0f1a16] font-bold">
              Ownership Management
            </h1>
            <p className="text-[#61776f] mt-2 text-lg">
              Manage your land titles and communicate with potential buyers.
            </p>
          </div>
          <button
            onClick={() => {
              if (!user?.isVerified) {
                toast.error("You must be verified to add land.");
                return;
              }
              setEditingLand(null);
              setNewLand({ title: "", description: "", location: "", price: "" });
              setImageFile(null);
              setIsModalOpen(true);
            }}
            disabled={!user?.isVerified}
            className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all ${
              user?.isVerified
                ? "bg-[#18422f] text-white shadow-lg shadow-[#18422f]/20 hover:translate-y-[-2px] hover:shadow-xl"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Plus className="w-5 h-5" />
            Register New Land
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e5e9e7] shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-[#61776f]">Total Properties</p>
                <p className="text-2xl font-bold text-[#0f1a16]">
                  {lands.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#e5e9e7] shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-[#61776f]">Verified Holdings</p>
                <p className="text-2xl font-bold text-[#0f1a16]">
                  {lands.filter((l) => l.status === "available").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#e5e9e7] shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-[#61776f]">Active Inquiries</p>
                <p className="text-2xl font-bold text-[#0f1a16]">
                  {conversations.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Portfolio View */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl text-[#0f1a16] font-bold">
                Property Portfolio
              </h2>
              <div className="flex bg-[#f3f5f4] p-1 rounded-xl border border-[#e5e9e7]">
                <button className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white text-[#18422f] shadow-sm tracking-tighter">All Units</button>
                <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-[#61776f] hover:text-[#0f1a16] tracking-tighter">Verified Only</button>
              </div>
            </div>

            {lands.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-[#e5e9e7] rounded-[40px] py-32 text-center group hover:border-[#18422f]/20 transition-all">
                <div className="w-20 h-20 bg-[#f3f5f4] rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <MapPin className="w-10 h-10 text-[#cbd5e1]" />
                </div>
                <h3 className="text-xl font-bold text-[#0f1a16]">
                  Your registry is empty
                </h3>
                <p className="text-[#61776f] mb-8 max-w-xs mx-auto text-sm">
                  Start securing your land titles in our tamper-proof digital registry today.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#18422f] text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-[#18422f]/20 transition-all"
                >
                  Register First Asset
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {lands.map((land) => (
                  <div
                    key={land.id}
                    className="bg-white rounded-[32px] border border-[#e5e9e7] overflow-hidden group hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300"
                  >
                    <div className="aspect-16/10 bg-[#f3f5f4] relative overflow-hidden">
                      {land.imageUrl && isValidUrl(land.imageUrl) ? (
                        <Image
                          src={land.imageUrl}
                          alt={land.title}
                          width={400}
                          height={250}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          unoptimized={land.imageUrl.startsWith("data:")}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPin className="w-12 h-12 text-[#cbd5e1]" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#18422f] border border-white/20">
                          {land.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-[#0f1a16] truncate pr-4">
                          {land.title}
                        </h3>
                        <p className="text-lg font-bold text-[#18422f] whitespace-nowrap">
                          ₦{parseFloat(land.price).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#61776f] text-xs mb-6 font-medium">
                        <MapPin className="w-4 h-4 text-[#18422f]/40" />
                        <span className="truncate">{land.location}</span>
                      </div>
                      <div className="flex gap-2 pt-6 border-t border-[#f3f5f4]">
                        <button
                          onClick={() => setSellingLand(land)}
                          disabled={land.status === "sold"}
                          className={`flex-1 ${land.status === "sold" ? "bg-amber-50 text-amber-700" : "bg-[#18422f] text-white"} py-3 rounded-2xl font-bold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {land.status === "sold" ? "Sold" : "Mark as Sold"}
                        </button>
                        <button 
                          onClick={() => openEditModal(land)}
                          className="w-12 bg-[#f3f5f4] text-[#0f1a16] py-3 rounded-2xl font-bold hover:bg-[#e2e8e5] transition-all flex items-center justify-center"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLand(land.id)}
                          className="w-12 bg-red-50 text-red-600 py-3 rounded-2xl font-bold hover:bg-red-100 transition-all flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Activity & Inquiries */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl text-[#0f1a16] font-bold">
                Engagement
              </h2>
              <div className="bg-white rounded-[32px] border border-[#e5e9e7] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-[#f3f5f4] flex justify-between items-center">
                  <h3 className="text-sm font-bold text-[#0f1a16] uppercase tracking-widest">Buyer Stream</h3>
                  <span className="bg-green-100 text-green-700 text-[9px] px-2 py-0.5 rounded-full font-bold">Live</span>
                </div>
                {conversations.length === 0 ? (
                  <div className="p-12 text-center">
                    <MessageSquare className="w-8 h-8 text-[#f3f5f4] mx-auto mb-4" />
                    <p className="text-[#61776f] text-xs font-medium italic">
                      No active inquiries in your stream.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#f3f5f4]">
                    {conversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => router.push(`/pages/messages?convId=${conv.id}`)}
                        className="w-full text-left p-6 hover:bg-[#f8f9f8] transition-all group flex gap-4"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#18422f] to-[#0f1a16] flex items-center justify-center font-bold text-white text-sm shrink-0 border border-white/10">
                          {conv.buyer.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-xs font-bold text-[#0f1a16] truncate">
                              {conv.buyer.name}
                            </p>
                            <span className="text-[8px] text-[#9ca3af] font-bold uppercase tracking-tighter">Just now</span>
                          </div>
                          <p className="text-[11px] text-[#61776f] line-clamp-1 font-medium">
                            {conv.messages[0]?.text || "Interested in your title..."}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                <button 
                  onClick={() => router.push('/pages/messages')}
                  className="w-full py-4 text-[10px] font-bold text-[#18422f] hover:bg-[#f3f5f4] border-t border-[#f3f5f4] uppercase tracking-widest transition-all"
                >
                  Open Message Center
                </button>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xl text-[#0f1a16] font-bold">Activity Feed</h2>
              <div className="flex flex-col gap-4">
                {[
                  { icon: CheckCircle2, bg: "bg-green-50", color: "text-green-600", text: "Identity Verified", sub: "Admin approved your profile" },
                  { icon: Activity, bg: "bg-blue-50", color: "text-blue-600", text: "Portfolio Synced", sub: "Global registry updated" },
                  { icon: Shield, bg: "bg-purple-50", color: "text-purple-600", text: "Security Update", sub: "Rate limits active" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className={`p-2 rounded-xl ${item.bg} ${item.color}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0f1a16]">{item.text}</p>
                      <p className="text-[10px] text-[#9ca3af]">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Land Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1a16]/40 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] w-full max-w-4xl p-10 relative max-h-[90vh] overflow-y-auto border border-[#e5e9e7] shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold text-[#0f1a16]">
                  {editingLand ? "Update Land Title" : "Register New Asset"}
                </h2>
                <p className="text-[#61776f] mt-1">
                  {editingLand ? "Modify your property details in the registry." : "Fill in the details to list your land on the blockchain."}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingLand(null);
                }}
                className="w-12 h-12 bg-[#f3f5f4] rounded-2xl flex items-center justify-center text-[#61776f] hover:text-[#0f1a16] transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdateLand} className="grid grid-cols-2 gap-8">
              <div className="col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#61776f] mb-2 block">
                  Property Title
                </label>
                <input
                  type="text"
                  value={newLand.title}
                  onChange={(e) =>
                    setNewLand({ ...newLand, title: e.target.value })
                  }
                  placeholder="e.g. 50x100 Plot at Lekki Phase 1"
                  className="w-full bg-[#f3f5f4] border-none rounded-2xl p-4 text-sm text-black focus:ring-2 focus:ring-black/10 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[#61776f] mb-2 block">
                  Location
                </label>
                <input
                  type="text"
                  value={newLand.location}
                  onChange={(e) =>
                    setNewLand({ ...newLand, location: e.target.value })
                  }
                  placeholder="Street, City, LGA, State"
                  className="w-full bg-[#f3f5f4] border-none rounded-2xl p-4 text-sm text-black focus:ring-2 focus:ring-[#18422f]/10 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[#61776f] mb-2 block">
                  Price (NGN)
                </label>
                <input
                  type="number"
                  value={newLand.price}
                  onChange={(e) =>
                    setNewLand({ ...newLand, price: e.target.value })
                  }
                  placeholder="0.00"
                  className="w-full bg-[#f3f5f4] border-none rounded-2xl p-4 text-sm text-black focus:ring-2 focus:ring-[#18422f]/10 outline-none"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#61776f] mb-2 block">
                  Description
                </label>
                <textarea
                  value={newLand.description}
                  onChange={(e) =>
                    setNewLand({ ...newLand, description: e.target.value })
                  }
                  placeholder="Detailed description of the land..."
                  rows={4}
                  className="w-full bg-[#f3f5f4] border-none rounded-2xl p-4 text-sm text-black focus:ring-2 focus:ring-[#18422f]/10 outline-none resize-none"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#61776f] mb-2 block">
                  Property Image
                </label>
                <p className="text-[10px] text-[#9ca3af] mb-2">
                  Please upload a high-quality photo of the land/property.
                </p>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="land-image-upload"
                  />
                  <label
                    htmlFor="land-image-upload"
                    className="w-full bg-[#f3f5f4] border-2 border-dashed border-[#e5e9e7] rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#e2e8e5] hover:border-[#18422f]/20 transition-all group"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6 text-[#18422f]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#0f1a16]">
                        {imageFile ? imageFile.name : "Select property image"}
                      </p>
                      <p className="text-xs text-[#61776f]">
                        PNG, JPG or JPEG up to 5MB
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="col-span-2 bg-[#18422f] text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#18422f]/20 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {editingLand ? "Updating Title..." : "Processing Asset..."}
                  </>
                ) : (
                  <>
                    {editingLand ? "Update Title" : "Complete Registration"}
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Mark as Sold Modal */}
      {sellingLand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1a16]/40 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] w-full max-w-lg p-10 relative border border-[#e5e9e7] shadow-2xl">
            <h2 className="text-2xl font-bold text-[#0f1a16] mb-2 text-center">Transfer Title</h2>
            <p className="text-[#61776f] text-sm text-center mb-10">Select the buyer who purchased {sellingLand.title}.</p>
            
            <div className="flex flex-col gap-4 max-h-[40vh] overflow-y-auto mb-8 px-2">
              {conversations
                .filter(c => c.landId === sellingLand.id)
                .map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleMarkAsSold(conv.buyer.id)}
                    className="flex items-center gap-4 p-4 rounded-3xl border border-[#e5e9e7] hover:border-[#18422f] hover:bg-green-50/50 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-[#18422f]/10 text-[#18422f] flex items-center justify-center font-bold">
                      {conv.buyer.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#0f1a16] text-sm truncate">{conv.buyer.name}</p>
                      <p className="text-[10px] text-[#61776f] truncate">{conv.buyer.email}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#e5e9e7] group-hover:text-[#18422f] transition-colors" />
                  </button>
                ))}
              {conversations.filter(c => c.landId === sellingLand.id).length === 0 && (
                <div className="py-10 text-center text-[#61776f] italic text-sm">
                  No inquiries found for this property.
                </div>
              )}
            </div>

            <button
              onClick={() => setSellingLand(null)}
              className="w-full py-4 text-[#61776f] text-sm font-bold hover:text-[#0f1a16] transition-colors"
            >
              Cancel Transfer
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default LandownerDashboard;
