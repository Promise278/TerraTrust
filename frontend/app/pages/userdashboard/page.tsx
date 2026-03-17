"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/utils/api";
import { Search, MapPin, MessageSquare, Tag, Info, Send, Shield, Activity } from "lucide-react";
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
  owner?: { name: string; id: string };
}

interface Conversation {
  id: string;
  landowner: { name: string; id: string };
  messages: { text: string; createdAt: string }[];
}

const BuyerDashboard = () => {
  const router = useRouter();
  const [lands, setLands] = useState<Land[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messagingLand, setMessagingLand] = useState<Land | null>(null);
  const [messageText, setMessageText] = useState("");

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
      const response = await api.get("/dashboard/buyer");
      setLands(response.data.availableLands);
      setConversations(response.data.conversations);
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messagingLand || !messageText.trim()) return;

    setIsSubmitting(true);
    try {
      await api.post("/messages/send", {
        receiverId: messagingLand.owner?.id,
        landId: messagingLand.id,
        text: messageText,
      });
      toast.success("Inquiry sent successfully!");
      setMessagingLand(null); // Close the modal by setting messagingLand to null
      setMessageText("");
      fetchData(); // Refresh inquiries count
    } catch {
      toast.error("Failed to send inquiry");
    } finally {
      setIsSubmitting(false);
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
        <div>
          <h1 className="font-display text-4xl text-[#0f1a16] font-bold">
            Find Your Next Property
          </h1>
          <p className="text-[#61776f] mt-2 text-lg">
            Browse available lands and connect with owners directly.
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e5e9e7] shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-[#61776f]">Available Lands</p>
                <p className="text-2xl font-bold text-[#0f1a16]">
                  {lands.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#e5e9e7] shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
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
          <div className="bg-white p-6 rounded-2xl border border-[#e5e9e7] shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-[#61776f]">Recent Searches</p>
                <p className="text-2xl font-bold text-[#0f1a16]">0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Lands View */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl text-[#0f1a16] font-bold">
                Premium Listings
              </h2>
              <div className="relative group w-full md:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#61776f] group-focus-within:text-[#18422f] transition-colors" />
                <input
                  type="text"
                  placeholder="Search by state or city..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#e5e9e7] rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#18422f]/5 focus:border-[#18422f]/20 transition-all shadow-sm"
                />
              </div>
            </div>

            {lands.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-[#e5e9e7] rounded-[40px] py-32 text-center">
                <div className="w-20 h-20 bg-[#f3f5f4] rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-10 h-10 text-[#cbd5e1]" />
                </div>
                <h3 className="text-xl font-bold text-[#0f1a16]">
                  No titles found match
                </h3>
                <p className="text-[#61776f] max-w-xs mx-auto text-sm">
                  The registry is temporarily clear of new listings in this criteria.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-8">
                {lands.map((land) => (
                  <div
                    key={land.id}
                    className="bg-white rounded-[32px] border border-[#e5e9e7] overflow-hidden group hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500 flex flex-col"
                  >
                    <div className="aspect-16/11 bg-[#f3f5f4] relative overflow-hidden">
                      {land.imageUrl && isValidUrl(land.imageUrl) ? (
                        <Image
                          src={land.imageUrl}
                          alt={land.title}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                          unoptimized={land.imageUrl.startsWith("data:")}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPin className="w-12 h-12 text-[#cbd5e1]" />
                        </div>
                      )}
                      <div className="absolute top-5 left-5">
                        <span className="bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#18422f] border border-white/20 shadow-sm">
                          {land.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-[#0f1a16] leading-tight">
                          {land.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-[#61776f] text-sm mb-6 font-medium">
                        <MapPin className="w-4 h-4 text-[#18422f]/40" />
                        <span className="truncate">{land.location}</span>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-6">
                          <p className="text-2xl font-bold text-[#18422f]">
                             ₦{parseFloat(land.price).toLocaleString()}
                          </p>
                          <div className="bg-[#f3f5f4] p-2 rounded-xl group-hover:bg-[#18422f]/5 transition-colors">
                            <Tag className="w-4 h-4 text-[#61776f]" />
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <button
                            onClick={() => setMessagingLand(land)}
                            className="flex-1 bg-[#18422f] text-white py-4 rounded-[18px] font-bold text-sm shadow-lg shadow-[#18422f]/10 hover:shadow-xl hover:shadow-[#18422f]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Direct Inquiry
                          </button>
                          <button className="bg-[#f3f5f4] text-[#0f1a16] w-14 rounded-[18px] font-bold text-sm hover:bg-[#e2e8e5] transition-all flex items-center justify-center group/btn">
                            <Info className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Conversations */}
          <div className="flex flex-col gap-8">
            <h2 className="text-2xl text-[#0f1a16] font-bold">
              Direct Streams
            </h2>
            <div className="bg-white rounded-[32px] border border-[#e5e9e7] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[#f3f5f4] bg-[#f8f9f8]/50">
                <h3 className="text-xs font-bold text-[#0f1a16] uppercase tracking-widest">Active Negotiations</h3>
              </div>
              {conversations.length === 0 ? (
                <div className="p-16 text-center">
                  <MessageSquare className="w-10 h-10 text-[#f3f5f4] mx-auto mb-4" />
                  <p className="text-[#61776f] text-xs font-medium italic">
                    You haven&apos;t started any land inquiries yet.
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
                      <div className="w-12 h-12 rounded-2xl bg-[#18422f]/5 border border-[#18422f]/10 flex items-center justify-center font-bold text-[#18422f] text-lg shrink-0">
                        {conv.landowner.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-bold text-[#0f1a16] truncate">
                            {conv.landowner.name}
                          </p>
                          <span className="text-[9px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded-md">LIVE</span>
                        </div>
                        <p className="text-[11px] text-[#61776f] line-clamp-1 italic font-medium leading-relaxed">
                          &ldquo;{conv.messages[0]?.text || "Sent an inquiry"}&rdquo;
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-linear-to-br from-[#18422f] to-[#0a1c14] p-8 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">Verified Purchase</h3>
                <p className="text-sm text-white/60 mb-8 leading-relaxed">
                  Every property on TerraTrust is manually verified by our legal team before listing.
                </p>
                <button className="bg-white text-[#18422f] w-full py-4 rounded-2xl text-sm font-bold hover:bg-white/90 active:scale-[0.98] transition-all shadow-xl shadow-black/20">
                  Learn about verification
                </button>
              </div>
              <Activity className="absolute bottom-[-40px] right-[-40px] w-48 h-48 text-white/5 rotate-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {messagingLand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1a16]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-[#e5e9e7]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-[#0f1a16]">
                    Inquire about land
                  </h3>
                  <p className="text-[#61776f] mt-1">
                    Messaging:{" "}
                    <span className="font-bold text-[#18422f]">
                      {messagingLand.title}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setMessagingLand(null)}
                  className="p-2 hover:bg-[#f3f5f4] rounded-full transition-all"
                >
                  <Send className="w-6 h-6 rotate-180 text-[#61776f]" />
                </button>
              </div>
            </div>
            <form
              onSubmit={handleSendMessage}
              className="p-8 flex flex-col gap-6"
            >
              <div className="bg-[#f3f5f4] p-6 rounded-2xl">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="text-[#18422f] w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#61776f] mb-1">
                      Property Location
                    </p>
                    <p className="text-sm text-[#0f1a16] font-medium">
                      {messagingLand.location}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[#61776f] mb-2 block">
                  Your Message
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Hi, I am interested in this land. Is it still available?"
                  rows={4}
                  className="w-full bg-[#f3f5f4] border-none rounded-2xl p-6 text-sm text-black focus:ring-2 focus:ring-[#18422f]/10 outline-none resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#18422f] text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#18422f]/20 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending Inquiry...
                  </>
                ) : (
                  <>
                    Send Direct Inquiry
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default BuyerDashboard;
