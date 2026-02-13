import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Plus,
    ImageIcon,
    Code,
    Send,
    Sparkles,
    CircleHelp,
    Lock,
    Wand2,
    Zap
} from "lucide-react";

const Dashboard = () => {
    const { isLoggedIn } = useOutletContext();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);

    const handleSearch = (customMessage) => {
        const query = typeof customMessage === 'string' ? customMessage : message;
        if (!query.trim()) return;

        if (!isLoggedIn) {
            setShowAuthPrompt(true);
            return;
        }
        navigate("/ask-ai", { state: { initialMessage: query } });
    };

    const promptPills = [
        { label: "Tell me a bedtime story", icon: <Wand2 className="w-5 h-5" />, gradient: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.08))" },
        { label: "Generate a futuristic cityscape", icon: <ImageIcon className="w-5 h-5" />, gradient: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(168,85,247,0.08))" },
        { label: "Write a React component for a timer", icon: <Code className="w-5 h-5" />, gradient: "linear-gradient(135deg, rgba(34,211,238,0.12), rgba(59,130,246,0.08))" },
        { label: "Explain quantum entanglement", icon: <Sparkles className="w-5 h-5" />, gradient: "linear-gradient(135deg, rgba(244,114,182,0.12), rgba(139,92,246,0.08))" }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 overflow-hidden relative">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-3xl mx-auto flex flex-col items-center -mt-8 md:-mt-12"
            >
                {/* ─── Dobby Mascot ─── */}
                <motion.div variants={itemVariants} className="mb-6 relative">
                    <div className="absolute inset-0 rounded-full animate-gentle-pulse"
                        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.2), transparent 70%)', filter: 'blur(20px)' }} />
                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center animate-breathe"
                        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)', boxShadow: '0 8px 32px rgba(59,130,246,0.3)' }}>
                        <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    {/* Orbiting particle */}
                    <div className="absolute inset-0 flex items-center justify-center animate-orbit">
                        <div className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', boxShadow: '0 0 8px rgba(96,165,250,0.5)' }} />
                    </div>
                </motion.div>

                {/* ─── Title ─── */}
                <motion.div variants={itemVariants} className="mb-10 md:mb-12 text-center">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-3 tracking-tight leading-tight" style={{ color: 'var(--text-heading)' }}>
                        What can I help{" "}
                        <span className="animate-gradient" style={{
                            backgroundImage: 'linear-gradient(135deg, #60a5fa, #818cf8, #a78bfa, #60a5fa)',
                            backgroundSize: '200% 200%',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            you with?
                        </span>
                    </h1>
                    <p className="text-xs md:text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Ask anything — I'm here to help ✨</p>
                </motion.div>

                {/* ─── Suggestion Cards ─── */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full mb-10 md:mb-12">
                    {promptPills.map((pill, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ y: -4, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSearch(pill.label)}
                            className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-2xl text-left transition-all duration-300 group"
                            style={{
                                background: pill.gradient,
                                border: '1px solid var(--border-subtle)',
                            }}
                        >
                            <div className="p-2.5 md:p-3 rounded-xl text-slate-400 group-hover:text-blue-400 transition-all duration-300 group-hover:scale-110"
                                style={{ background: 'var(--bg-card-hover)' }}>
                                {pill.icon}
                            </div>
                            <span className="text-xs md:text-sm font-semibold group-hover:text-white transition-colors leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{pill.label}</span>
                        </motion.button>
                    ))}
                </motion.div>
            </motion.div>

            {/* ─── Input Bar ─── */}
            <div className="absolute bottom-4 md:bottom-6 left-0 right-0 px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="max-w-3xl mx-auto relative group"
                >
                    <div className="absolute -inset-[1px] rounded-2xl blur-sm opacity-0 group-focus-within:opacity-40 transition-all duration-500"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }} />
                    <div className="relative flex items-center gap-2 p-2 rounded-2xl shadow-2xl"
                        style={{
                            background: 'var(--bg-header)',
                            backdropFilter: 'blur(40px)',
                            border: '1px solid var(--border-medium)',
                        }}>
                        <button className="p-2 text-slate-500 hover:text-blue-400 transition-colors">
                            <Plus className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Ask Dobby anything..."
                            className="flex-1 bg-transparent border-none placeholder-slate-600 outline-none text-sm font-medium py-2"
                            style={{ color: 'var(--text-primary)' }}
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSearch()}
                            className="p-2.5 rounded-xl transition-all duration-300"
                            style={{
                                background: message.trim() ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'rgba(148,163,184,0.06)',
                                color: message.trim() ? '#fff' : 'rgba(148,163,184,0.3)',
                                boxShadow: message.trim() ? '0 4px 16px rgba(59,130,246,0.3)' : 'none',
                            }}
                        >
                            <Send className="w-4 h-4" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* ─── Auth Modal ─── */}
            {showAuthPrompt && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                    onClick={() => setShowAuthPrompt(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-8 max-w-sm w-full mx-4 text-center rounded-3xl shadow-2xl"
                        style={{ background: 'var(--bg-dropdown)', backdropFilter: 'blur(40px)', border: '1px solid var(--border-medium)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))', border: '1px solid rgba(148,163,184,0.08)' }}>
                            <Lock className="w-7 h-7 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-extrabold text-white mb-2">Sign in to chat</h3>
                        <p className="text-slate-400 text-sm mb-6">Create an account or log in to start chatting with Dobby AI</p>
                        <div className="flex flex-col gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/signup")}
                                className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg"
                                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                            >
                                Sign Up — It's Free
                            </motion.button>
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full py-3 rounded-xl text-slate-300 font-bold text-sm hover:bg-white/5 transition-all"
                                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}
                            >
                                I already have an account
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default Dashboard;