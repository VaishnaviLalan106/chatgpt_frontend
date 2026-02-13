import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
    Plus,
    Search,
    LogOut,
    History,
    Home,
    Sparkles,
    MessageSquare,
    Trash2,
    Info,
    Mail,
    PanelLeftClose,
    X
} from "lucide-react";


const Sidebar = ({ isOpen, setIsOpen, isLoggedIn, onLogout, history, deleteChat, loading, fetchHistory }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const currentChatId = searchParams.get("chatId");
    const [searchQuery, setSearchQuery] = useState("");

    // Trigger search when query changes (with a small delay/on enter/button)
    // For now, let's do it on button click or when user stops typing
    useEffect(() => {
        if (!isLoggedIn) return;
        const delayDebounceFn = setTimeout(() => {
            fetchHistory(searchQuery);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, fetchHistory, isLoggedIn]);

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
        <aside className={`relative z-40 h-full transition-all duration-500 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col ${isOpen ? "w-72" : "w-0 p-0 overflow-hidden border-none"}`}>
            <div className={`flex flex-col h-full w-72 p-4 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>

                {/* Header: Toggle + Brand */}
                <div className="flex items-center justify-between gap-2 mb-6 px-1">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs font-black text-white tracking-widest italic uppercase">Dobby AI</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <PanelLeftClose className="w-4 h-4" />
                    </button>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-col gap-2 mb-6">
                    <button
                        onClick={() => navigate("/")}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all group ${location.pathname === '/' ? 'bg-white/10 border border-white/10 text-white shadow-xl' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Home className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
                    </button>
                    <button
                        onClick={() => navigate("/ask-ai")}
                        className={`flex items-center gap-3 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white group ${location.pathname === '/ask-ai' ? 'ring-1 ring-blue-500/50' : ''}`}
                    >
                        <Plus className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 group-hover:text-white">New Chat</span>
                    </button>
                </div>

                {/* Search History */}
                <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="w-3.5 h-3.5 text-zinc-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-white/10 focus:bg-white/10 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-white"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>

                {/* Chat History Section */}
                <div className="flex-1 min-h-0 flex flex-col mb-4">
                    <div className="flex items-center gap-2 text-zinc-600 font-extrabold uppercase tracking-[0.2em] text-[8px] mb-3 px-3">
                        <History className="w-3 h-3 opacity-50" />
                        History
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                        {loading ? (
                            <div className="px-3 py-10 text-center space-y-3">
                                <Loader2 className="w-5 h-5 animate-spin text-blue-500 mx-auto opacity-50" />
                                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic">Loading history...</p>
                            </div>
                        ) : Array.isArray(history) && history.length > 0 ? (
                            history.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => handleChatClick(chat.id)}
                                    className={`group flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl cursor-pointer transition-all border border-transparent ${currentChatId == chat.id ? "bg-blue-600/10 text-blue-400 border-blue-500/20 shadow-lg" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"}`}
                                >
                                    <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${currentChatId == chat.id ? "text-blue-400" : "opacity-40"}`} />
                                    <span className="flex-1 text-[11px] font-bold truncate tracking-tight">{chat.title}</span>
                                    <button
                                        onClick={(e) => handleDeleteChat(e, chat.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-10 text-center space-y-2">
                                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest italic">No chats found</p>
                                {searchQuery && <p className="text-[9px] text-zinc-700">Try a different word</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col gap-1.5 mb-2 pt-4 border-t border-white/5">
                    <SidebarItem
                        icon={<Info className="w-4 h-4" />}
                        label="About Dobby"
                        active={location.pathname === '/about'}
                        onClick={() => navigate("/about")}
                    />
                    <SidebarItem
                        icon={<Mail className="w-4 h-4" />}
                        label="Contact Us"
                        active={location.pathname === '/contact'}
                        onClick={() => navigate("/contact")}
                    />
                </div>

                {/* Footer / User */}
                {isLoggedIn && (
                    <div className="pt-3 border-t border-white/5 mt-2">
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all group"
                        >
                            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="font-black uppercase tracking-widest text-[9px]">Sign Out</span>
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
};

const SidebarItem = ({ icon, label, onClick, active }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all group ${active ? 'bg-white/5 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
    >
        <span className={`${active ? 'text-blue-400' : 'group-hover:text-blue-400'} transition-colors`}>{icon}</span>
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </button>
);

export default Sidebar;

