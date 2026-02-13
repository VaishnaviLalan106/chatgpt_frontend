import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Plus,
    ImageIcon,
    Code,
    Send,
    Sparkles,
    CircleHelp,
    Lock
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
        { label: "Tell me a bedtime story", icon: <CircleHelp className="w-4 h-4" /> },
        { label: "Generate a futuristic cityscape", icon: <ImageIcon className="w-4 h-4" /> },
        { label: "Write a React component for a timer", icon: <Code className="w-4 h-4" /> },
        { label: "Explain quantum entanglement", icon: <Sparkles className="w-4 h-4" /> }
    ];

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-hidden">
            <div className="w-full max-w-3xl mx-auto flex flex-col items-center animate-[slideUp_0.6s_ease-out] -mt-12">
                {/* Title */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter leading-tight">
                        What can I help{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                            you with?
                        </span>
                    </h1>
                    <p className="text-zinc-500 text-sm md:text-base font-medium">Ask anything — I'm here to help ✨</p>
                </div>

                {/* Suggestions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-12">
                    {promptPills.map((pill, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSearch(pill.label)}
                            className="flex items-center gap-4 p-5 bg-white/[0.03] border border-white/5 rounded-[2rem] text-left hover:bg-white/[0.06] hover:border-white/15 hover:-translate-y-1 transition-all duration-300 group"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="p-3 bg-white/5 rounded-2xl text-zinc-500 group-hover:text-blue-400 transition-colors">
                                {pill.icon}
                            </div>
                            <span className="text-xs md:text-sm font-semibold text-zinc-400 group-hover:text-white transition-colors leading-relaxed">{pill.label}</span>
                        </button>
                    ))}
                </div>

                <div className="absolute bottom-6 left-0 right-0 px-6">
                    <div className="max-w-3xl mx-auto relative group">
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-sm opacity-10 group-focus-within:opacity-30 transition duration-500"></div>
                        <div className="relative bg-[#0c0f16]/90 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 flex items-center gap-2">
                            <button className="p-2 text-zinc-500 hover:text-blue-400 transition-colors">
                                <Plus className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Ask Dobby anything..."
                                className="flex-1 bg-transparent border-none text-white placeholder-zinc-600 outline-none text-sm font-medium py-2"
                            />
                            <button
                                onClick={() => handleSearch()}
                                className={`p-2.5 rounded-xl transition-all duration-300 ${message.trim() ? "bg-blue-600 text-white shadow-lg hover:bg-blue-500" : "bg-white/5 text-zinc-700"}`}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Auth Prompt Modal */}
                {showAuthPrompt && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" onClick={() => setShowAuthPrompt(false)}>
                        <div className="bg-[#0c0f16] border border-white/10 rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl animate-[slideUp_0.3s_ease-out]" onClick={e => e.stopPropagation()}>
                            <div className="w-14 h-14 mx-auto mb-5 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-2xl flex items-center justify-center">
                                <Lock className="w-7 h-7 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-2">Sign in to chat</h3>
                            <p className="text-zinc-400 text-sm mb-6">Create an account or log in to start chatting with Dobby AI</p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => navigate("/signup")}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                                >
                                    Sign Up — It's Free
                                </button>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-zinc-300 font-bold text-sm hover:bg-white/10 transition-all"
                                >
                                    I already have an account
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            ` }} />
        </div>
    );
};

export default Dashboard;