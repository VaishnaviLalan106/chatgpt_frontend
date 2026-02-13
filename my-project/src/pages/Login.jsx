import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Github, LogIn, ArrowRight, Lock, Loader2, AlertCircle, CheckCircle2, Sparkles, Eye, EyeOff } from "lucide-react";
import { API_BASE } from "../config";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [status, setStatus] = useState({ loading: false, type: "", message: "" });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, type: "", message: "" });

        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ loading: false, type: "success", message: "Login successful! Redirecting..." });

                if (data.access_token) localStorage.setItem("access_token", data.access_token);
                if (data.token_type) localStorage.setItem("token_type", data.token_type);
                if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);

                setTimeout(() => navigate("/"), 1500);
            } else {
                setStatus({ loading: false, type: "error", message: data.detail || data.message || "Login failed. Please check your credentials." });
            }
        } catch (error) {
            setStatus({
                loading: false,
                type: "error",
                message: error.message === "Failed to fetch"
                    ? `Failed to connect to backend. Please ensure the server at ${API_BASE} is running and CORS is enabled.`
                    : "An unexpected error occurred: " + error.message
            });
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans"
            style={{ background: 'var(--bg-gradient)', transition: 'background 0.4s ease' }}>
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full animate-gentle-pulse"
                    style={{ background: `radial-gradient(circle, var(--blob-1) 0%, transparent 70%)`, filter: 'blur(100px)' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full animate-gentle-pulse"
                    style={{ background: `radial-gradient(circle, var(--blob-2) 0%, transparent 70%)`, filter: 'blur(100px)', animationDelay: '2s' }} />
                <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full animate-gentle-pulse"
                    style={{ background: `radial-gradient(circle, var(--blob-3) 0%, transparent 70%)`, filter: 'blur(80px)', animationDelay: '4s' }} />
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: `linear-gradient(var(--blob-grid) 1px, transparent 1px), linear-gradient(90deg, var(--blob-grid) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                <div className="absolute inset-0 rounded-[2.5rem]"
                    style={{ background: 'var(--bg-surface)', backdropFilter: 'blur(50px)', border: '1px solid var(--border-medium)', boxShadow: '0 32px 64px -16px rgba(0,0,0,0.5)' }} />

                <div className="relative p-8 md:p-10 flex flex-col items-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-7 relative"
                    >
                        <div className="absolute inset-0 blur-2xl rounded-full" style={{ background: 'rgba(59,130,246,0.3)' }} />
                        <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl shadow-xl hover:rotate-6 transition-transform duration-500"
                            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 8px 32px rgba(59,130,246,0.3)' }}>
                            <LogIn className="w-7 h-7 text-white" />
                        </div>
                    </motion.div>

                    <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight text-center" style={{ color: 'var(--text-heading)' }}>
                        Welcome{" "}
                        <span style={{
                            backgroundImage: 'linear-gradient(135deg, #60a5fa, #818cf8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>Back</span>
                    </h1>
                    <p className="text-slate-500 text-center text-sm mb-6 font-medium max-w-[240px]">
                        Access your creative space with your credentials.
                    </p>

                    {/* Status Message */}
                    {status.message && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`w-full flex items-center gap-3 p-4 mb-6 rounded-2xl ${status.type === "success" ? "text-emerald-400" : "text-red-400"
                                }`}
                            style={{
                                background: status.type === "success" ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                                border: `1px solid ${status.type === "success" ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                            }}
                        >
                            {status.type === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                            <span className="text-sm font-medium">{status.message}</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        <div className="group relative">
                            <div className="absolute -inset-[1px] rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition duration-500"
                                style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.4), rgba(99,102,241,0.4))' }} />
                            <div className="relative flex items-center">
                                <Mail className="absolute left-4 w-5 h-5 text-slate-600 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email address"
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl placeholder-slate-600 outline-none transition-all duration-300"
                                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
                                    onFocus={(e) => { e.target.style.background = 'var(--bg-input-focus)'; }}
                                    onBlur={(e) => { e.target.style.background = 'var(--bg-input)'; }}
                                />
                            </div>
                        </div>

                        <div className="group relative">
                            <div className="absolute -inset-[1px] rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition duration-500"
                                style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.4), rgba(139,92,246,0.4))' }} />
                            <div className="relative flex items-center">
                                <Lock className="absolute left-4 w-5 h-5 text-slate-600 group-focus-within:text-violet-400 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="w-full pl-12 pr-12 py-4 rounded-2xl placeholder-slate-600 outline-none transition-all duration-300"
                                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
                                    onFocus={(e) => { e.target.style.background = 'var(--bg-input-focus)'; }}
                                    onBlur={(e) => { e.target.style.background = 'var(--bg-input)'; }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 text-slate-600 hover:text-slate-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={status.loading}
                            className="group relative w-full py-4 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)' }} />
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative z-10 flex items-center justify-center gap-2 text-white font-bold tracking-wide">
                                {status.loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Continue
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </motion.button>
                    </form>

                    <div className="w-full flex items-center gap-4 my-7">
                        <div className="h-px flex-1" style={{ background: 'rgba(148,163,184,0.08)' }} />
                        <span className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em]">Options</span>
                        <div className="h-px flex-1" style={{ background: 'rgba(148,163,184,0.08)' }} />
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center gap-2 py-4 rounded-2xl text-slate-300 transition-all duration-300 group"
                            style={{ background: 'rgba(148,163,184,0.04)', border: '1px solid rgba(148,163,184,0.06)' }}
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5 group-hover:scale-110 transition-transform" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span className="text-xs font-bold uppercase tracking-wider">Google</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center gap-2 py-4 rounded-2xl text-slate-300 transition-all duration-300 group"
                            style={{ background: 'rgba(148,163,184,0.04)', border: '1px solid rgba(148,163,184,0.06)' }}
                        >
                            <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-wider">GitHub</span>
                        </motion.button>
                    </div>

                    <p className="mt-8 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        New?{" "}
                        <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition-colors">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;