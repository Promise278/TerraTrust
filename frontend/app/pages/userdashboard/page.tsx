"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/utils/api";
import { Search, MapPin, MessageSquare, Tag, Info, Send } from "lucide-react";
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
  const [lands, setLands] = useState<Land[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagingLand, setMessagingLand] = useState<Land | null>(null);
  const [messageText, setMessageText] = useState("");

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

    try {
      await api.post("/messages/send", {
        receiverId: messagingLand.owner?.id,
        text: messageText,
      });
      toast.success("Message sent successfully!");
      setMessagingLand(null);
      setMessageText("");
      fetchData(); // Refresh conversations
    } catch {
      toast.error("Failed to send message");
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
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl text-[#0f1a16] font-bold">
                Featured Lands
              </h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#61776f]" />
                <input
                  type="text"
                  placeholder="Search location..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-[#e5e9e7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#18422f]/20"
                />
              </div>
            </div>

            {lands.length === 0 ? (
              <div className="bg-white border border-dashed border-[#e5e9e7] rounded-3xl py-20 text-center">
                <div className="w-16 h-16 bg-[#f3f5f4] rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-[#cbd5e1]" />
                </div>
                <h3 className="text-lg font-bold text-[#0f1a16]">
                  No lands available right now
                </h3>
                <p className="text-[#61776f]">
                  Check back later for new listings.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {lands.map((land) => (
                  <div
                    key={land.id}
                    className="bg-white rounded-3xl border border-[#e5e9e7] overflow-hidden group hover:shadow-xl transition-all h-full flex flex-col"
                  >
                    <div className="aspect-4/3 bg-[#f3f5f4] relative">
                      {land.imageUrl ? (
                        <Image
                          src={land.imageUrl}
                          alt={land.title}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPin className="w-12 h-12 text-[#cbd5e1]" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#18422f]">
                        {land.status}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-[#0f1a16] truncate">
                          {land.title}
                        </h3>
                        <p className="text-xl font-bold text-[#18422f]">
                          ₦{parseFloat(land.price).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-[#61776f] text-sm mb-4">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{land.location}</span>
                      </div>
                      <p className="text-[#61776f] text-sm line-clamp-2 mb-6 flex-1">
                        {land.description}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setMessagingLand(land)}
                          className="flex-1 bg-[#18422f] text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Message Owner
                        </button>
                        <button className="bg-[#f3f5f4] text-[#0f1a16] px-4 py-3 rounded-xl font-bold text-sm hover:bg-[#e2e8e5] transition-all">
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Conversations */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl text-[#0f1a16] font-bold">
              Recent Inquiries
            </h2>
            <div className="bg-white rounded-3xl border border-[#e5e9e7] overflow-hidden">
              {conversations.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-[#61776f] text-sm italic">
                    You haven&apos;t messaged any owners yet.
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
                          {conv.landowner.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#0f1a16] truncate">
                            {conv.landowner.name}
                          </p>
                          <p className="text-[10px] text-[#9ca3af] uppercase font-bold tracking-widest">
                            Landowner
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-[#61776f] line-clamp-1 italic">
                        {conv.messages[0]?.text || "No messages yet..."}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#18422f] p-6 rounded-3xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Need help?</h3>
                <p className="text-sm text-white/70 mb-4">
                  Our support team is available 24/7 to assist with your land
                  verification.
                </p>
                <button className="bg-white text-[#18422f] px-6 py-2 rounded-xl text-sm font-bold">
                  Contact Support
                </button>
              </div>
              <Activity className="absolute bottom-[-20px] right-[-20px] w-32 h-32 text-white/5 rotate-12" />
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
                  className="w-full bg-[#f3f5f4] border-none rounded-2xl p-6 text-sm focus:ring-2 focus:ring-[#18422f]/10 outline-none resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#18422f] text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#18422f]/20 hover:translate-y-[-2px] hover:shadow-xl transition-all"
              >
                Send Message
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default BuyerDashboard;

// Placeholder component for Lucide if not imported
function Activity({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
