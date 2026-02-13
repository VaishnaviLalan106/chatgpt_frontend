import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import {
    User, Mail, Shield, Trash2, LogOut, Key, Palette, Bell,
    ChevronRight, Sparkles, AlertTriangle, Check, X, Loader2
} from "lucide-react";
import { API_BASE } from "../config";
import { useTheme } from "../ThemeContext";

const Settings = () => {
    const navigate = useNavigate();
    const { isLoggedIn, fetchHistory } = useOutletContext();
    const [userEmail, setUserEmail] = useState("");
    const [userInitial, setUserInitial] = useState("U");
    const [activeSection, setActiveSection] = useState("profile");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [clearingChats, setClearingChats] = useState(false);
    const [notification, setNotification] = useState(null);
    const { theme: activeTheme, setTheme: setActiveTheme } = useTheme();
    const [notificationsOn, setNotificationsOn] = useState(() => localStorage.getItem("dobby_notifications") !== "false");

    // Decode email from JWT token
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                if (payload.email) {
                    setUserEmail(payload.email);
                    setUserInitial(payload.email.charAt(0).toUpperCase());
                }
            } catch (e) {
                console.error("Failed to decode token:", e);
            }
        }
    }, []);

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleClearAllChats = async () => {
        setClearingChats(true);
        try {
            const token = localStorage.getItem("access_token");
            const res = await fetch(`${API_BASE}/chats/`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const chats = await res.json();
                for (const chat of chats) {
                    await fetch(`${API_BASE}/chats/${chat.id}`, {
                        method: "DELETE",
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                }
                fetchHistory();
                showNotification("All chats cleared successfully");
            }
        } catch (err) {
            showNotification("Failed to clear chats", "error");
        } finally {
            setClearingChats(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
    };

    const sections = [
        { id: "profile", label: "Profile", icon: User },
        { id: "account", label: "Account", icon: Shield },
        { id: "appearance", label: "Appearance", icon: Palette },
    ];

    return (
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            {/* Notification Toast */}
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl flex items-center gap-2 shadow-2xl"
                    style={{
                        background: notification.type === "error" ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
                        border: `1px solid ${notification.type === "error" ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
                        backdropFilter: 'blur(20px)'
                    }}
                >
                    {notification.type === "error"
                        ? <X className="w-4 h-4 text-red-400" />
                        : <Check className="w-4 h-4 text-green-400" />
                    }
                    <span className={`text-xs font-bold ${notification.type === "error" ? 'text-red-300' : 'text-green-300'}`}>
                        {notification.message}
                    </span>
                </motion.div>
            )}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-3xl w-full mx-auto p-4 sm:p-6 md:p-10 space-y-5"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="space-y-1">
                    <h1 className="text-2xl font-black text-white tracking-tight">Settings</h1>
                    <p className="text-xs text-slate-500 font-semibold">Manage your profile and preferences</p>
                </motion.div>

                {/* Navigation Tabs — right after header */}
                <motion.div variants={itemVariants} className="flex gap-1 p-1 rounded-2xl" style={{ background: 'rgba(148,163,184,0.04)', border: '1px solid rgba(148,163,184,0.06)' }}>
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all duration-300"
                            style={{
                                background: activeSection === section.id ? 'rgba(59,130,246,0.1)' : 'transparent',
                                color: activeSection === section.id ? '#60a5fa' : '#64748b',
                                border: `1px solid ${activeSection === section.id ? 'rgba(59,130,246,0.15)' : 'transparent'}`
                            }}
                        >
                            <section.icon className="w-3.5 h-3.5" />
                            {section.label}
                        </button>
                    ))}
                </motion.div>

                {/* ═══ Profile Section ═══ */}
                {activeSection === "profile" && (
                    <motion.div
                        key="profile"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        {/* Profile Card */}
                        <div className="rounded-3xl p-6 space-y-5"
                            style={{ background: 'rgba(148,163,184,0.03)', border: '1px solid rgba(148,163,184,0.06)' }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-2xl"
                                        style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)', boxShadow: '0 8px 32px rgba(99,102,241,0.3)' }}>
                                        {userInitial}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 flex items-center justify-center"
                                        style={{ borderColor: 'rgba(10,14,26,0.9)' }}>
                                        <Check className="w-2.5 h-2.5 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-lg font-bold text-white truncate">{userEmail || "User"}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest"
                                            style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
                                            Free Plan
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <SettingsCard
                            icon={<User className="w-4 h-4 text-blue-400" />}
                            title="Display Name"
                            description="Your display name across Dobby AI"
                            value={userEmail ? userEmail.split("@")[0] : "User"}
                        />
                        <SettingsCard
                            icon={<Mail className="w-4 h-4 text-violet-400" />}
                            title="Email Address"
                            description="Your account email"
                            value={userEmail}
                        />
                        <SettingsCard
                            icon={<Sparkles className="w-4 h-4 text-amber-400" />}
                            title="Plan"
                            description="Your current subscription"
                            value="Free"
                        />
                    </motion.div>
                )}

                {/* ═══ Account Section ═══ */}
                {activeSection === "account" && (
                    <motion.div
                        key="account"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                    >
                        <div className="rounded-3xl p-5 space-y-4" style={{ background: 'rgba(148,163,184,0.03)', border: '1px solid rgba(148,163,184,0.06)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-white font-bold">Clear All Chats</p>
                                    <p className="text-[10px] text-slate-500 font-semibold">Delete all your conversation history</p>
                                </div>
                                {!showDeleteConfirm ? (
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all"
                                        style={{ border: '1px solid rgba(239,68,68,0.2)' }}
                                    >
                                        Clear
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleClearAllChats}
                                            disabled={clearingChats}
                                            className="px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest text-white transition-all flex items-center gap-2"
                                            style={{ background: 'rgba(239,68,68,0.3)', border: '1px solid rgba(239,68,68,0.4)' }}
                                        >
                                            {clearingChats ? <Loader2 className="w-3 h-3 animate-spin" /> : <AlertTriangle className="w-3 h-3" />}
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:bg-white/5 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-3xl p-5" style={{ background: 'rgba(148,163,184,0.03)', border: '1px solid rgba(148,163,184,0.06)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
                                    <LogOut className="w-4 h-4 text-red-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-white font-bold">Sign Out</p>
                                    <p className="text-[10px] text-slate-500 font-semibold">Log out of your account</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all"
                                    style={{ border: '1px solid rgba(239,68,68,0.2)' }}
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ═══ Appearance Section ═══ */}
                {activeSection === "appearance" && (
                    <motion.div
                        key="appearance"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                    >
                        <div className="rounded-3xl p-5 space-y-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
                                    <Palette className="w-4 h-4 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-white font-bold">Theme</p>
                                    <p className="text-[10px] text-slate-500 font-semibold">Choose your preferred theme</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                {[
                                    { id: "dark", label: "Dark", bg: "linear-gradient(135deg, #0f172a, #1e293b)" },
                                    { id: "midnight", label: "Midnight", bg: "linear-gradient(135deg, #000000, #0a0a0a)" },
                                    { id: "ocean", label: "Ocean", bg: "linear-gradient(135deg, #dbeafe, #bfdbfe)" },
                                ].map((theme) => {
                                    const isActive = activeTheme === theme.id;
                                    return (
                                        <button
                                            key={theme.id}
                                            onClick={() => {
                                                setActiveTheme(theme.id);
                                                showNotification(`Theme changed to ${theme.label}`);
                                            }}
                                            className="flex-1 rounded-2xl p-3 space-y-2 transition-all duration-300 hover:scale-[1.03] active:scale-95"
                                            style={{
                                                background: isActive ? 'rgba(59,130,246,0.08)' : 'rgba(148,163,184,0.03)',
                                                border: `1px solid ${isActive ? 'rgba(59,130,246,0.2)' : 'rgba(148,163,184,0.06)'}`,
                                            }}
                                        >
                                            <div className="w-full h-8 rounded-xl" style={{ background: theme.bg }} />
                                            <p className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-blue-400' : 'text-slate-600'}`}>
                                                {theme.label}
                                                {isActive && " ✓"}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rounded-3xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
                                    <Bell className="w-4 h-4 text-violet-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-white font-bold">Notifications</p>
                                    <p className="text-[10px] text-slate-500 font-semibold">Sound effects for messages</p>
                                </div>
                                <button
                                    onClick={() => {
                                        const newVal = !notificationsOn;
                                        setNotificationsOn(newVal);
                                        localStorage.setItem("dobby_notifications", String(newVal));
                                        showNotification(newVal ? "Notifications enabled" : "Notifications disabled");
                                    }}
                                    className="w-10 h-5 rounded-full p-0.5 cursor-pointer transition-all duration-300"
                                    style={{
                                        background: notificationsOn ? 'rgba(59,130,246,0.3)' : 'rgba(148,163,184,0.15)',
                                        border: `1px solid ${notificationsOn ? 'rgba(59,130,246,0.3)' : 'rgba(148,163,184,0.1)'}`,
                                    }}
                                >
                                    <div className={`w-4 h-4 rounded-full transition-all duration-300 ${notificationsOn ? 'bg-blue-400 ml-auto' : 'bg-slate-500 ml-0'}`} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Footer */}
                <motion.div variants={itemVariants} className="text-center pt-4 pb-6 space-y-1">
                    <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">Dobby AI · v1.0</p>
                    <p className="text-[8px] text-slate-800">Made with ♥ by the Dobby team</p>
                </motion.div>
            </motion.div>
        </div>
    );
};

const SettingsCard = ({ icon, title, description, value }) => (
    <div className="rounded-3xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.08)' }}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-bold">{title}</p>
                <p className="text-[10px] text-slate-500 font-semibold">{description}</p>
            </div>
            <span className="text-xs text-slate-400 font-semibold truncate max-w-[150px]">{value}</span>
        </div>
    </div>
);

export default Settings;
