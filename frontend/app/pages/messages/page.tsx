"use client";
import { useEffect, useState, useRef, Suspense, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/utils/api";
import {
  Send,
  MessageCircle,
  ArrowLeft,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
} from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  senderId: string;
  receiverId: string;
  land?: { id: string; title: string; imageUrl?: string; location?: string };
  otherParty?: { id: string; name: string; email: string };
  messages: Message[];
  unreadCount?: number;
}

const MessagingPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const convIdFromUrl = searchParams.get("convId");

  const fetchConversations = useCallback(async () => {
    try {
      const response = await api.get("/messages/conversations");
      const data = response.data.data || [];
      setConversations(data);
      
      // Auto-select conversation from URL
      if (convIdFromUrl && !selectedConv) {
        const found = data.find((c: Conversation) => c.id === convIdFromUrl);
        if (found) setSelectedConv(found);
      }
    } catch {
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, [convIdFromUrl, selectedConv]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedConv) {
      const fetchMessages = async () => {
        try {
          const response = await api.get(`/messages/${selectedConv.id}`);
          setMessages(response.data.data || []);
          scrollToBottom();
        } catch {
          toast.error("Failed to load messages");
        }
      };
      fetchMessages();

      // Poll for new messages every 5 seconds (simplistic real-time)
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedConv]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConv || !newMessage.trim()) return;

    const other = getOtherParty(selectedConv);
    const receiverId = other?.id;

    if (!receiverId) {
      toast.error("Could not identify message recipient");
      return;
    }

    setIsSending(true);

    try {
      const response = await api.post("/messages/send", {
        conversationId: selectedConv.id,
        content: newMessage,
      });
      setMessages([...messages, response.data.data]);
      setNewMessage("");
      scrollToBottom();
      fetchConversations(); // Update side list
    } catch {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const getOtherParty = (conv: Conversation) => {
    return conv.otherParty;
  };

    if (loading || !user) {
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
      <div className="h-[calc(100vh-160px)] flex bg-white rounded-[32px] border border-[#e5e9e7] overflow-hidden shadow-sm">
        {/* Sidebar: Conv List */}
        <div
          className={`w-full lg:w-96 border-r border-[#e5e9e7] flex flex-col ${selectedConv ? "hidden lg:flex" : "flex"}`}
        >
          <div className="p-6 border-b border-[#e5e9e7] bg-[#f8f9f8]">
            <h1 className="text-xl font-bold text-[#0f1a16] mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#61776f]" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e5e9e7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#18422f]/10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#e5e9e7]">
            {!conversations || conversations.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-[#f3f5f4] rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-[#cbd5e1]" />
                </div>
                <p className="text-[#61776f] text-sm">No conversations yet.</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const other = getOtherParty(conv);
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConv(conv)}
                    className={`w-full text-left p-6 flex items-center gap-4 hover:bg-[#f8f9f8] transition-all group ${selectedConv?.id === conv.id ? "bg-[#f3f5f4]" : ""}`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#e5e9e7] flex items-center justify-center font-bold text-[#18422f] shadow-sm">
                      {other?.name ? other.name.charAt(0) : "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-bold text-[#0f1a16] truncate">
                          {other?.name || "Unknown"}
                        </p>
                      </div>
                      <p className="text-xs text-[#61776f] truncate">
                        {conv.messages && conv.messages[0]?.content
                          ? conv.messages[0].content
                          : "Start a conversation..."}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`flex-1 flex flex-col bg-white ${!selectedConv ? "hidden lg:flex items-center justify-center p-20 text-center" : "flex"}`}
        >
          {!selectedConv ? (
            <div className="flex flex-col items-center gap-6 max-w-sm">
              <div className="w-24 h-24 bg-[#18422f]/5 rounded-full flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-[#18422f]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0f1a16] mb-2">
                  Your Conversations
                </h2>
                <p className="text-[#61776f]">
                  Select a chat from the sidebar to view messages and connect
                  with other users.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-[#e5e9e7] flex items-center gap-4 bg-[#f8f9f8]">
                <button
                  onClick={() => setSelectedConv(null)}
                  className="lg:hidden p-2 hover:bg-[#e2e8e5] rounded-full"
                >
                  <ArrowLeft className="w-5 h-5 text-[#0f1a16]" />
                </button>
                <div className="w-10 h-10 rounded-xl bg-white border border-[#e5e9e7] flex items-center justify-center font-bold text-[#18422f]">
                  {getOtherParty(selectedConv)?.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-[#0f1a16]">
                    {getOtherParty(selectedConv)?.name}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <p className="text-[10px] text-[#61776f] font-bold uppercase tracking-widest">
                      Active Now
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-[#e2e8e5] rounded-full transition-all text-[#61776f]">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 bg-[#f3f5f4]/30">
                {messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center opacity-30 italic text-sm">
                    Send a message to start chatting...
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isOwn = msg.senderId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] p-4 rounded-2xl text-sm shadow-sm ${
                            isOwn
                              ? "bg-[#18422f] text-white rounded-tr-none"
                              : "bg-white text-[#0f1a16] border border-[#e5e9e7] rounded-tl-none"
                          }`}
                        >
                          <p className="leading-relaxed">{msg.content}</p>
                          <p
                            className={`text-[9px] mt-2 font-bold uppercase tracking-widest ${isOwn ? "text-white/50" : "text-[#9ca3af]"}`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-6 border-t border-[#e5e9e7] bg-white"
              >
                <div className="bg-[#f3f5f4] rounded-2xl flex items-center p-2 focus-within:ring-2 focus-within:ring-[#18422f]/10 transition-all">
                  <button
                    type="button"
                    className="p-3 text-[#61776f] hover:text-[#18422f] transition-all"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write a message..."
                    className="flex-1 bg-transparent border-none py-3 px-2 text-sm focus:outline-none text-[#0f1a16]"
                  />
                  <button
                    type="button"
                    className="p-3 text-[#61776f] hover:text-[#18422f] transition-all"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || isSending}
                    className="bg-[#18422f] text-white p-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-30 disabled:hover:opacity-30 shadow-md shadow-[#18422f]/20 flex items-center justify-center min-w-[44px]"
                  >
                    {isSending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const MessagingPageWrapper = () => (
  <Suspense fallback={
    <DashboardLayout>
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#18422f] border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  }>
    <MessagingPage />
  </Suspense>
);

export default MessagingPageWrapper;
