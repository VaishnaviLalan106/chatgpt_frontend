import React from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
    Plus,
    Search,
    Image as ImageIcon,
    LayoutGrid,
    Code,
    Archive,
    LogOut,
    History,
    Home,
    Sparkles,
    MessageSquare,
    Trash2
} from "lucide-react";
import { useChatHistory } from "../hooks/useChatHistory";

const Sidebar = ({ isOpen, isLoggedIn, onLogout, history, deleteChat, loading }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const currentChatId = searchParams.get("chatId");

    const handleChatClick = (chatId) => {
        navigate(`/ask-ai?chatId=${chatId}`);
    };

    const handleDeleteChat = (e, chatId) => {
        e.stopPropagation();
        if (window.confirm("Delete this chat?")) {
            deleteChat(chatId);
            if (currentChatId == chatId) {
                navigate("/");
            }
        }
    };

    return (
        <aside className={`relative z-20 transition-all duration-500 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col ${isOpen ? "w-64 p-4" : "w-0 p-0 overflow-hidden border-none"}`}>
            {/* Brand */}
            <div className="flex items-center gap-2 mb-5 px-1">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-black text-zinc-300 tracking-tight italic uppercase">DOBBY AI</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 mb-4">
                <button
                    onClick={() => navigate("/")}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all group ${location.pathname === '/' ? 'bg-white/10 border border-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                >
                    <Home className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
                </button>
                <button
                    onClick={() => navigate("/ask-ai")}
                    className="flex items-center gap-3 w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white group"
                >
                    <Plus className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 group-hover:text-white transition-colors">New Chat</span>
                </button>
            </div>

            {/* Nav Items */}
            <div className="flex flex-col gap-0.5 mb-4">
                <SidebarItem icon={<Search className="w-4 h-4" />} label="Search" />
                <SidebarItem icon={<ImageIcon className="w-4 h-4" />} label="Gallery" />
                <SidebarItem icon={<LayoutGrid className="w-4 h-4" />} label="Apps" />
                <SidebarItem icon={<Code className="w-4 h-4" />} label="Codex" />
                <SidebarItem icon={<Archive className="w-4 h-4" />} label="Vault" />
            </div>

            {/* Chat History */}
            <div className="flex-1 min-h-0 flex flex-col">
                <div className="flex items-center gap-2 text-zinc-500 font-black uppercase tracking-widest text-[8px] mb-2 px-3">
                    <History className="w-3 h-3" />
                    Recent History
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-0.5">
                    {history.length > 0 ? (
                        history.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => handleChatClick(chat.id)}
                                className={`group flex items-center gap-2 w-full px-3 py-2 rounded-lg cursor-pointer transition-all ${currentChatId == chat.id ? "bg-blue-600/10 text-blue-400" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}
                            >
                                <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                                <span className="flex-1 text-[11px] font-bold truncate tracking-tight">{chat.title}</span>
                                <button
                                    onClick={(e) => handleDeleteChat(e, chat.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 hover:text-red-400 rounded transition-all"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="px-3 py-2 text-[10px] text-zinc-600 italic">No recent chats</p>
                    )}
                </div>
            </div>

            {/* Bottom */}
            {isLoggedIn && (
                <div className="pt-3 border-t border-white/5 mt-3">
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                    >
                        <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" />
                        <span className="font-black uppercase tracking-widest text-[8px]">Log Out</span>
                    </button>
                </div>
            )}
        </aside>
    );
};

const SidebarItem = ({ icon, label }) => (
    <button className="flex items-center gap-3 w-full px-4 py-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
        <span className="group-hover:text-blue-400 transition-colors">{icon}</span>
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </button>
);

export default Sidebar;
