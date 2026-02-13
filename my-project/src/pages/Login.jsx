import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Github, LogIn, ArrowRight, Lock, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { API_BASE } from "../config";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [status, setStatus] = useState({ loading: false, type: "", message: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, type: "", message: "" });

        try {
            console.log("Attempting login to:", `${API_BASE}/login`);
            console.log("Request Payload:", JSON.stringify({ email: formData.email, password: "..." }));

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

            console.log("Response Status:", response.status);
            const data = await response.json();

            if (response.ok) {
                console.log("Login Success. Data received:", data);
                setStatus({ loading: false, type: "success", message: "Login successful! Redirecting..." });

                // Store tokens in localStorage
                if (data.access_token) localStorage.setItem("access_token", data.access_token);
                if (data.token_type) localStorage.setItem("token_type", data.token_type);
                if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);

                console.log("Tokens stored in localStorage:", {
                    access_token: !!localStorage.getItem("access_token"),
                    token_type: !!localStorage.getItem("token_type"),
                    refresh_token: !!localStorage.getItem("refresh_token")
                });

                setTimeout(() => navigate("/"), 1500);
            } else {
                console.error("Login Error Details:", data);
                setStatus({ loading: false, type: "error", message: data.detail || data.message || "Login failed. Please check your credentials." });
            }
        } catch (error) {
            console.error("Network/Fetch Exception:", error);
            setStatus({
                loading: false,
                type: "error",
                message: error.message === "Failed to fetch"
                    ? "Failed to connect to backend. Please ensure the server at http://localhost:8000 is running and CORS is enabled."
                    : "An unexpected error occurred: " + error.message
            });
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#02040a] font-sans selection:bg-blue-500/30">
            {/* Liquid Blue & Purple Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[140px] animate-[pulse_8s_infinite]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[140px] animate-[pulse_10s_infinite_2s]"></div>
                <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] animate-[pulse_12s_infinite_4s]"></div>

                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 pointer-events-none"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md mx-4 animate-[fadeIn_0.8s_ease-out]">
                <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-[50px] rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"></div>

                <div className="relative p-10 flex flex-col items-center">
                    <div className="mb-8 relative">
                        <div className="absolute inset-0 bg-blue-500/40 blur-2xl rounded-full"></div>
                        <div className="relative w-16 h-16 flex items-center justify-center bg-white rounded-2xl shadow-xl border border-white/20 transform hover:rotate-6 transition-transform duration-500">
                            <LogIn className="w-8 h-8 text-blue-600 drop-shadow-md" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight text-center">
                        Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Back</span>
                    </h1>
                    <p className="text-zinc-400 text-center text-sm mb-6 font-medium max-w-[240px]">
                        Access your creative space with your credentials.
                    </p>

                    {/* Status Message */}
                    {status.message && (
                        <div className={`w-full flex items-center gap-3 p-4 mb-6 rounded-2xl border ${status.type === "success" ? "bg-green-500/10 border-green-500/50 text-green-400" : "bg-red-500/10 border-red-500/50 text-red-400"
                            } animate-[fadeIn_0.3s_ease-out]`}>
                            {status.type === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                            <span className="text-sm font-medium">{status.message}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        <div className="group relative">
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-4 w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email address"
                                    className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-zinc-500 outline-none focus:bg-black/60 transition-all duration-300"
                                />
                            </div>
                        </div>

                        <div className="group relative">
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-4 w-5 h-5 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-zinc-500 outline-none focus:bg-black/60 transition-all duration-300"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={status.loading}
                            className="group relative w-full py-4 rounded-2xl overflow-hidden shadow-lg active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
                        </button>
                    </form>

                    <div className="w-full flex items-center gap-4 my-8">
                        <div className="h-[1px] flex-1 bg-white/10"></div>
                        <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">Options</span>
                        <div className="h-[1px] flex-1 bg-white/10"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full">
                        <button className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 rounded-2xl text-zinc-300 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 group-hover:scale-110 transition-transform" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span className="text-xs font-bold uppercase tracking-wider">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 rounded-2xl text-zinc-300 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
                            <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-wider">GitHub</span>
                        </button>
                    </div>

                    <p className="mt-10 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                        New?{" "}
                        <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition-colors">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.2; }
                    50% { transform: scale(1.1); opacity: 0.3; }
                }
            ` }} />
        </div>
    );
};

export default Login;