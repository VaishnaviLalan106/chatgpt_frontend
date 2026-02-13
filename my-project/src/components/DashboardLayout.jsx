import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import { useChatHistory } from "../hooks/useChatHistory";
import {
    PanelLeftOpen,
    PanelLeftClose,
    Sparkles,
    LogIn,
    UserPlus,
    ChevronDown,
    Settings,
    LogOut,
    Menu
} from "lucide-react";

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const profileRef = useRef(null);

    // Lifted state for chat history
    const { history, fetchHistory, createChat, deleteChat, clearHistory, loading } = useChatHistory();

    // Responsive check
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsSidebarOpen(false);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Sync login state with localStorage on route changes and storage events
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("access_token");
            const loggedIn = !!token;
            if (loggedIn !== isLoggedIn) {
                setIsLoggedIn(loggedIn);
            }
        };

        checkAuth();
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, [location.pathname, isLoggedIn]);

    // Fetch history when logged in
    useEffect(() => {
        if (isLoggedIn) {
            fetchHistory();
        } else {
            clearHistory();
        }
    }, [isLoggedIn, fetchHistory, clearHistory]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
    };

    return (
        <div className="fixed inset-0 w-full h-full flex font-sans overflow-hidden" style={{ background: 'var(--bg-gradient)', transition: 'background 0.4s ease' }}>
            {/* ─── Animated Background Layers ─── */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Floating orbs */}
                <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full animate-gentle-pulse"
                    style={{ background: `radial-gradient(circle, var(--blob-1) 0%, transparent 70%)`, filter: 'blur(80px)' }} />
                <div className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[60%] rounded-full animate-gentle-pulse"
                    style={{ background: `radial-gradient(circle, var(--blob-2) 0%, transparent 70%)`, filter: 'blur(100px)', animationDelay: '2s' }} />
                <div className="absolute top-[40%] left-[50%] w-[35%] h-[35%] rounded-full animate-gentle-pulse"
                    style={{ background: `radial-gradient(circle, var(--blob-3) 0%, transparent 70%)`, filter: 'blur(90px)', animationDelay: '4s' }} />

                {/* Subtle grid overlay */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: `linear-gradient(var(--blob-grid) 1px, transparent 1px), linear-gradient(90deg, var(--blob-grid) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

                {/* Horizon glow */}
                <div className="absolute bottom-0 left-0 right-0 h-[40%]"
                    style={{ background: `linear-gradient(to top, var(--blob-horizon) 0%, transparent 100%)` }} />
            </div>

            {/* ─── Mobile Overlay ─── */}
            <AnimatePresence>
                {isMobile && isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* ─── Sidebar Toggle (When Closed) ─── */}
            <AnimatePresence>
                {!isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="fixed top-4 left-4 z-50"
                    >
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-3 rounded-2xl text-slate-400 hover:text-white transition-all duration-300 group"
                            style={{ background: 'var(--bg-surface)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-medium)' }}
                            title="Open Sidebar"
                        >
                            <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Sidebar ─── */}
            <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                history={history}
                fetchHistory={fetchHistory}
                deleteChat={deleteChat}
                loading={loading}
                isMobile={isMobile}
            />

            {/* ─── Main Area ─── */}
            <div className="relative z-10 flex-1 flex flex-col h-full min-h-0">
                {/* ─── Top Bar ─── */}
                <header className="relative z-50 flex items-center h-14 md:h-16 px-4 md:px-6 flex-shrink-0"
                    style={{ background: 'var(--bg-header)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.4s ease' }}>
                    {/* Left: Brand */}
                    <div className="flex items-center gap-3">
                        {isMobile && !isSidebarOpen && (
                            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-400 hover:text-white transition-colors mr-1">
                                <Menu className="w-5 h-5" />
                            </button>
                        )}
                        <button onClick={() => navigate("/")} className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg animate-breathe"
                                style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)' }}>
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-extrabold tracking-widest italic uppercase hidden sm:block" style={{ color: 'var(--text-primary)' }}>DOBBY</span>
                        </button>
                    </div>

                    {/* Right: Auth / Profile */}
                    <div className="flex-1 flex justify-end items-center gap-2 md:gap-3">
                        {!isLoggedIn ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigate("/login")}
                                    className="px-3 md:px-4 py-2 transition-colors text-xs font-bold uppercase tracking-wider"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate("/signup")}
                                    className="px-4 md:px-5 py-2 rounded-xl text-white text-xs font-bold uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)' }}
                                >
                                    Sign Up
                                </button>
                            </div>
                        ) : (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 p-1 pl-3 rounded-xl hover:bg-white/5 transition-all group"
                                    style={{ border: '1px solid var(--border-medium)' }}
                                >
                                    <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors hidden sm:block">Dobby Pro</span>
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white"
                                        style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                                        U
                                    </div>
                                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
                                </button>

                                {isProfileOpen && (
                                    <div
                                        className="absolute top-full right-0 mt-2 w-48 p-1 rounded-2xl shadow-2xl z-[100]"
                                        style={{ background: 'var(--bg-dropdown)', backdropFilter: 'blur(40px)', border: '1px solid var(--border-medium)', transition: 'background 0.4s ease' }}
                                    >
                                        <button
                                            onMouseDown={(e) => { e.stopPropagation(); setIsProfileOpen(false); navigate('/settings'); }}
                                            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all font-bold uppercase text-[9px] tracking-widest text-left"
                                        >
                                            <Settings className="w-3.5 h-3.5 text-blue-400" />
                                            Settings
                                        </button>
                                        <div className="h-px my-1" style={{ background: 'var(--border-medium)' }} />
                                        <button
                                            onMouseDown={(e) => { e.stopPropagation(); handleLogout(); }}
                                            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold uppercase text-[9px] tracking-widest"
                                        >
                                            <LogOut className="w-3.5 h-3.5" />
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </header>

                {/* ─── Page Content ─── */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="flex-1 flex flex-col min-h-0 overflow-hidden"
                        >
                            <Outlet context={{ history, fetchHistory, createChat, deleteChat, loading, isLoggedIn }} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const MenuLink = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all font-bold uppercase text-[9px] tracking-widest group text-left">
        {icon}
        {label}
    </button>
);

export default DashboardLayout;
