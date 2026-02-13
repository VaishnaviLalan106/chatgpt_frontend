import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
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
    Zap
} from "lucide-react";

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const profileRef = useRef(null);

    // Lifted state for chat history
    const { history, fetchHistory, createChat, deleteChat, clearHistory, loading } = useChatHistory();

    // Sync login state with localStorage on route changes and storage events
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("access_token");
            const loggedIn = !!token;
            console.log("DashboardLayout: Checking auth status. Token exists:", loggedIn, "Current React State isLoggedIn:", isLoggedIn);
            if (loggedIn !== isLoggedIn) {
                console.log("DashboardLayout: Updating isLoggedIn state to", loggedIn);
                setIsLoggedIn(loggedIn);
            }
        };

        checkAuth();
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, [location.pathname, isLoggedIn]); // Optimized dependency

    // Fetch history when logged in
    useEffect(() => {
        if (isLoggedIn) {
            console.log("DashboardLayout: User is logged in, fetching history...");
            fetchHistory();
        } else {
            console.log("DashboardLayout: User not logged in, clearing history state.");
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
        console.log("Logging out and forcing fresh state reset...");
        localStorage.clear();
        // Clear session storage as well just in case
        sessionStorage.clear();
        // Force complete page reload at the root to ensure all React state is totally gone
        window.location.href = "/";
    };

    return (
        <div className="fixed inset-0 w-full h-full flex bg-[#02040a] font-sans overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[120px] animate-[drift_10s_infinite]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/5 blur-[140px] animate-[drift_12s_infinite_2s]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:60px_60px]"></div>
            </div>

            {/* Sidebar Toggle Overlay (When Closed) */}
            {!isSidebarOpen && (
                <div className="fixed top-4 left-4 z-50 animate-[fadeIn_0.3s_ease-out]">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-3 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all shadow-2xl backdrop-blur-xl group"
                        title="Open Sidebar"
                    >
                        <PanelLeftOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            )}

            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                history={history}
                fetchHistory={fetchHistory}
                deleteChat={deleteChat}
                loading={loading}
            />

            {/* Main Area */}
            <div className="relative z-10 flex-1 flex flex-col h-full min-h-0">
                {/* Top Bar */}
                <header className="flex items-center h-16 px-6 border-b border-white/5 bg-black/30 backdrop-blur-xl flex-shrink-0">
                    {/* Left: Brand (No toggle here, it's floating or in sidebar) */}
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate("/")} className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-black text-white tracking-widest italic uppercase">DOBBY</span>
                        </button>
                    </div>

                    {/* Right: Auth / Profile */}
                    <div className="flex-1 flex justify-end items-center gap-3">
                        {!isLoggedIn ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigate("/login")}
                                    className="px-4 py-2 text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate("/signup")}
                                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white text-xs font-bold uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-lg"
                                >
                                    Sign Up
                                </button>
                            </div>
                        ) : (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 p-1 pl-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all group"
                                >
                                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-white transition-colors hidden sm:block">Dobby Pro</span>
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-[10px] font-black text-white">
                                        U
                                    </div>
                                    <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-[#0c0f16]/95 border border-white/10 rounded-2xl p-1 shadow-2xl backdrop-blur-3xl animate-[fadeIn_0.2s_ease-out] z-50">
                                        <MenuLink icon={<Zap className="w-3.5 h-3.5 text-yellow-500" />} label="Dobby Plus" />
                                        <MenuLink icon={<Settings className="w-3.5 h-3.5 text-blue-400" />} label="Settings" />
                                        <div className="h-px bg-white/5 my-1"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-black uppercase text-[9px] tracking-widest"
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

                {/* Page Content */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <Outlet context={{ history, fetchHistory, createChat, deleteChat, loading, isLoggedIn }} />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes drift {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(10px, -10px) scale(1.05); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.03); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.08); }
            ` }} />
        </div>
    );
};

const MenuLink = ({ icon, label }) => (
    <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all font-black uppercase text-[9px] tracking-widest group text-left">
        {icon}
        {label}
    </button>
);

export default DashboardLayout;
