"use client";
import { useEffect, useState } from "react";
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
  buyer: { name: string; email: string };
  messages: { text: string; createdAt: string }[];
}

const LandownerDashboard = () => {
  const [lands, setLands] = useState<Land[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLand, setNewLand] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    imageUrl: "",
  });

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

  const handleCreateLand = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/lands", newLand);
      toast.success("Land registered successfully!");
      setIsModalOpen(false);
      setNewLand({
        title: "",
        description: "",
        location: "",
        price: "",
        imageUrl: "",
      });
      fetchData();
    } catch {
      toast.error("Failed to register land");
    }
  };

  const handleDeleteLand = async (id: string) => {
    if (!confirm("Are you sure you want to delete this land?")) return;
    try {
      await api.delete(`/lands/${id}`);
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
            onClick={() => setIsModalOpen(true)}
            className="bg-[#18422f] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-[#18422f]/20 hover:translate-y-[-2px] hover:shadow-xl transition-all"
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
            <h2 className="text-2xl text-[#0f1a16] font-bold">
              My Land Portfolio
            </h2>

            {lands.length === 0 ? (
              <div className="bg-white border border-dashed border-[#e5e9e7] rounded-3xl py-20 text-center">
                <div className="w-16 h-16 bg-[#f3f5f4] rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-[#cbd5e1]" />
                </div>
                <h3 className="text-lg font-bold text-[#0f1a16]">
                  No lands registered yet
                </h3>
                <p className="text-[#61776f] mb-6">
                  Start by registering your first land parcel.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#18422f]/10 text-[#18422f] px-6 py-2 rounded-xl font-bold hover:bg-[#18422f]/20 transition-all"
                >
                  Register Land
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {lands.map((land) => (
                  <div
                    key={land.id}
                    className="bg-white rounded-3xl border border-[#e5e9e7] overflow-hidden group hover:shadow-xl transition-all"
                  >
                    <div className="aspect-video bg-[#f3f5f4] relative">
                      {land.imageUrl ? (
                        <Image
                          src={land.imageUrl}
                          alt={land.title}
                          width={400}
                          height={250}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPin className="w-10 h-10 text-[#cbd5e1]" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase text-[#18422f]">
                          {land.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-[#0f1a16] truncate">
                          {land.title}
                        </h3>
                        <p className="text-lg font-bold text-[#18422f]">
                          ₦{parseFloat(land.price).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-[#61776f] text-sm mb-6">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{land.location}</span>
                      </div>
                      <div className="flex gap-2 border-t border-[#e5e9e7] pt-6">
                        <button className="flex-1 bg-[#f3f5f4] text-[#0f1a16] py-2.5 rounded-xl font-bold text-sm hover:bg-[#e2e8e5] transition-all flex items-center justify-center gap-2">
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLand(land.id)}
                          className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Inquiries */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl text-[#0f1a16] font-bold">
              Buyer Inquiries
            </h2>
            <div className="bg-white rounded-3xl border border-[#e5e9e7] overflow-hidden">
              {conversations.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-[#61776f] text-sm italic">
                    No inquiries from buyers yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#e5e9e7]">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      className="w-full text-left p-6 hover:bg-[#f8f9f8] transition-all group"
                    >
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#18422f]/10 flex items-center justify-center font-bold text-[#18422f]">
                          {conv.buyer.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#0f1a16] truncate">
                            {conv.buyer.name}
                          </p>
                          <p className="text-[10px] text-[#9ca3af] uppercase font-bold tracking-widest">
                            Buyer
                          </p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-[#18422f]" />
                      </div>
                      <p className="text-sm text-[#61776f] line-clamp-1">
                        {conv.messages[0]?.text || "No messages yet..."}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Register Land Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1a16]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-[#e5e9e7] flex justify-between items-center bg-[#f8f9f8]">
              <div>
                <h3 className="text-2xl font-bold text-[#0f1a16]">
                  Register New Land
                </h3>
                <p className="text-[#61776f] mt-1">
                  Provide accurate details for the registry.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-[#e2e8e5] rounded-full transition-all"
              >
                <Plus className="w-6 h-6 rotate-45 text-[#61776f]" />
              </button>
            </div>
            <form
              onSubmit={handleCreateLand}
              className="p-8 grid grid-cols-2 gap-6"
            >
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
                  className="w-full bg-[#f3f5f4] border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#18422f]/10 outline-none"
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
                  className="w-full bg-[#f3f5f4] border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#18422f]/10 outline-none"
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
                  className="w-full bg-[#f3f5f4] border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#18422f]/10 outline-none"
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
                  className="w-full bg-[#f3f5f4] border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#18422f]/10 outline-none resize-none"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#61776f] mb-2 block">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={newLand.imageUrl}
                  onChange={(e) =>
                    setNewLand({ ...newLand, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-[#f3f5f4] border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#18422f]/10 outline-none"
                />
              </div>

              <button
                type="submit"
                className="col-span-2 bg-[#18422f] text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#18422f]/20 hover:shadow-xl transition-all"
              >
                Complete Registration
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default LandownerDashboard;
