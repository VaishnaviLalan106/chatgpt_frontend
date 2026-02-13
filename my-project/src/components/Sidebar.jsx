import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
    X,
    Loader2
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen, isLoggedIn, onLogout, history, deleteChat, loading, fetchHistory, isMobile }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const currentChatId = searchParams.get("chatId");
    const [searchQuery, setSearchQuery] = useState("");

    // Debounced search
    useEffect(() => {
        if (!isLoggedIn) return;
        const delayDebounceFn = setTimeout(() => {
            fetchHistory(searchQuery);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, fetchHistory, isLoggedIn]);

    const handleChatClick = (chatId) => {
        navigate(`/ask-ai?chatId=${chatId}`);
        if (isMobile) setIsOpen(false);
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

    const handleNav = (path) => {
        navigate(path);
        if (isMobile) setIsOpen(false);
    };

    const sidebarVariants = {
        open: { width: isMobile ? 280 : 288, opacity: 1, x: 0 },
        closed: { width: 0, opacity: 0, x: -20 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.aside
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={sidebarVariants}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`relative z-40 h-full flex flex-col overflow-hidden ${isMobile ? 'fixed left-0 top-0' : ''}`}
                    style={{
                        background: 'var(--bg-sidebar)',
                        backdropFilter: 'blur(40px)',
                        borderRight: '1px solid var(--border-subtle)',
                        transition: 'background 0.4s ease'
                    }}
                >
                    <div className="flex flex-col h-full p-4" style={{ width: isMobile ? 280 : 288 }}>

                        {/* ─── Header ─── */}
                        <div className="flex items-center justify-between gap-2 mb-5 px-1">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs font-extrabold tracking-widest italic uppercase" style={{ color: 'var(--text-primary)' }}>Dobby AI</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-lg hover:text-white hover:bg-white/5 transition-all"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                <PanelLeftClose className="w-4 h-4" />
                            </button>
                        </div>

                        {/* ─── Main Actions ─── */}
                        <div className="flex flex-col gap-2 mb-5">
                            <NavButton
                                icon={<Home className="w-4 h-4" />}
                                label="Dashboard"
                                active={location.pathname === '/'}
                                onClick={() => handleNav("/")}
                                color="#3b82f6"
                            />
                            <button
                                onClick={() => handleNav("/ask-ai")}
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all duration-300 group"
                                style={{
                                    background: location.pathname === '/ask-ai' ? 'rgba(99,102,241,0.12)' : 'var(--bg-input)',
                                    border: `1px solid ${location.pathname === '/ask-ai' ? 'rgba(99,102,241,0.2)' : 'var(--border-subtle)'}`,
                                }}
                            >
                                <Plus className="w-4 h-4 text-violet-400 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
                                <span className="text-[10px] font-bold uppercase tracking-widest transition-colors" style={{ color: 'var(--text-secondary)' }}>New Chat</span>
                            </button>
                        </div>

                        {/* ─── Search ─── */}
                        <div className="relative mb-4">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Search className="w-3.5 h-3.5 text-slate-600" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search chats..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl pl-9 pr-8 py-2.5 text-xs placeholder-slate-600 outline-none transition-all duration-300"
                                style={{
                                    background: 'var(--bg-input)',
                                    border: '1px solid var(--border-input)',
                                    color: 'var(--text-primary)',
                                }}
                                onFocus={(e) => { e.target.style.background = 'var(--bg-input-focus)'; e.target.style.borderColor = 'var(--border-input-focus)'; }}
                                onBlur={(e) => { e.target.style.background = 'var(--bg-input)'; e.target.style.borderColor = 'var(--border-input)'; }}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-white transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>

                        {/* ─── Chat History ─── */}
                        <div className="flex-1 min-h-0 flex flex-col mb-3">
                            <div className="flex items-center gap-2 text-slate-600 font-extrabold uppercase tracking-[0.2em] text-[8px] mb-3 px-3">
                                <History className="w-3 h-3 opacity-50" />
                                History
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                                {loading ? (
                                    <div className="px-3 py-10 text-center space-y-3">
                                        <Loader2 className="w-5 h-5 animate-spin text-blue-400 mx-auto opacity-50" />
                                        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest italic">Loading history...</p>
                                    </div>
                                ) : Array.isArray(history) && history.length > 0 ? (
                                    history.map((chat, idx) => (
                                        <motion.div
                                            key={chat.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.03, duration: 0.2 }}
                                            onClick={() => handleChatClick(chat.id)}
                                            className="group flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200"
                                            style={{
                                                background: currentChatId == chat.id ? 'rgba(59,130,246,0.1)' : 'transparent',
                                                border: `1px solid ${currentChatId == chat.id ? 'rgba(59,130,246,0.15)' : 'transparent'}`,
                                            }}
                                        >
                                            <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${currentChatId == chat.id ? "text-blue-400" : "opacity-30 text-slate-400"}`} />
                                            <span className={`flex-1 text-[11px] font-semibold truncate tracking-tight ${currentChatId == chat.id ? 'text-blue-300' : 'text-slate-400 group-hover:text-slate-200'}`}>{chat.title}</span>
                                            <button
                                                onClick={(e) => handleDeleteChat(e, chat.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 hover:text-red-400 text-slate-600 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="px-3 py-10 text-center space-y-2">
                                        <div className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-3" style={{ background: 'var(--bg-card)' }}>
                                            <MessageSquare className="w-5 h-5 text-slate-700" />
                                        </div>
                                        <p className="text-[10px] text-slate-600 font-semibold">No chats yet</p>
                                        {searchQuery && <p className="text-[9px] text-slate-700">Try a different search</p>}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ─── Bottom Nav ─── */}
                        <div className="flex flex-col gap-1 mb-2 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                            <SidebarItem
                                icon={<Info className="w-4 h-4" />}
                                label="About Dobby"
                                active={location.pathname === '/about'}
                                onClick={() => handleNav("/about")}
                            />
                            <SidebarItem
                                icon={<Mail className="w-4 h-4" />}
                                label="Contact Us"
                                active={location.pathname === '/contact'}
                                onClick={() => handleNav("/contact")}
                            />
                        </div>

                        {/* ─── Logout ─── */}
                        {isLoggedIn && (
                            <div className="pt-3 mt-1" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                <button
                                    onClick={onLogout}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all group"
                                >
                                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold uppercase tracking-widest text-[9px]">Sign Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
};

const NavButton = ({ icon, label, active, onClick, color }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all duration-300 group"
        style={{
            background: active ? `rgba(59,130,246,0.1)` : 'transparent',
            border: `1px solid ${active ? 'rgba(59,130,246,0.15)' : 'transparent'}`,
        }}
    >
        <span className={`${active ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>{icon}</span>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors`}>{label}</span>
    </button>
);

const SidebarItem = ({ icon, label, onClick, active }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group"
        style={{
            background: active ? 'rgba(59,130,246,0.08)' : 'transparent',
        }}
    >
        <span className={`${active ? 'text-blue-400' : 'text-slate-600 group-hover:text-blue-400'} transition-colors`}>{icon}</span>
        <span className={`text-xs font-bold uppercase tracking-widest leading-none ${active ? 'text-white' : 'text-slate-500 group-hover:text-white'} transition-colors`}>{label}</span>
    </button>
);

export default Sidebar;
