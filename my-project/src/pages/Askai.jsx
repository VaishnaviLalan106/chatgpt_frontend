import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    User,
    Lock,
    Sparkles
} from "lucide-react";
import { API_BASE } from "../config";

const Askai = () => {
    const { isLoggedIn, createChat, fetchHistory } = useOutletContext();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const chatId = searchParams.get("chatId");

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);
    const messagesEndRef = useRef(null);
    const hasFiredInitial = useRef(false);
    const isSending = useRef(false);      // guards against chatId useEffect wiping optimistic messages

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load chat history if chatId is present — BUT skip if we're mid-send
    useEffect(() => {
        if (isSending.current) return;         // don't wipe optimistic messages

        const fetchChatMessages = async () => {
            if (!chatId || !isLoggedIn) {
                setMessages([]);
                return;
            }

            setLoading(true);
            try {
                const token = localStorage.getItem("access_token");
                const response = await fetch(`${API_BASE}/chats/${chatId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data.messages || []);
                }
            } catch (error) {
                console.error("Failed to load chat:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChatMessages();
    }, [chatId, isLoggedIn]);

    // Handle initial message from Dashboard
    useEffect(() => {
        if (location.state?.initialMessage && !hasFiredInitial.current) {
            hasFiredInitial.current = true;
            handleSend(location.state.initialMessage);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleSend = async (messageToSend) => {
        const query = typeof messageToSend === "string" ? messageToSend : input;
        if (!query.trim()) return;

        if (!isLoggedIn) {
            setShowAuthPrompt(true);
            return;
        }

        isSending.current = true;              // prevent chatId useEffect from wiping messages
        let currentChatId = chatId;
        let isNewChat = false;

        // If no chat ID, create a new chat first with a temporary title
        if (!currentChatId) {
            isNewChat = true;
            const title = query.length > 30 ? query.substring(0, 30) + "..." : query;
            const newChat = await createChat(title);
            if (newChat) {
                currentChatId = newChat.id;
                navigate(`/ask-ai?chatId=${newChat.id}`, { replace: true });
            } else {
                isSending.current = false;
                setMessages(prev => [...prev, { role: "assistant", content: "Failed to start new chat. Please try again." }]);
                return;
            }
        }

        // Capture current messages as history BEFORE adding user message
        const conversationHistory = messages.map(m => ({ role: m.role, content: m.content }));

        // Add user message to UI immediately
        const userMessage = { role: "user", content: query };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const token = localStorage.getItem("access_token");

            // Get AI response — backend stores both messages and uses history for context
            const response = await fetch(`${API_BASE}/ask`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    chat_id: currentChatId,
                    message: query,
                    history: conversationHistory,
                    system_prompt: "You are Dobby, a friendly, warm, and conversational AI assistant. Talk naturally like a real person — use casual language, emojis, and keep things fun and engaging. Be concise but helpful. Do NOT use markdown formatting like headers, bullet points, or bold text. Just talk like a human friend would in a chat. Remember and reference our earlier conversation naturally."
                }),
            });

            if (!response.ok) throw new Error("Failed to get AI response");

            const data = await response.json();
            const aiContent = data.response || "Hmm, I couldn't figure that out 🤔";

            setMessages((prev) => [...prev, { role: "assistant", content: aiContent }]);

            // Refresh sidebar history
            fetchHistory();

            // Auto-generate title for new chats (fire-and-forget, don't block UI)
            if (isNewChat) {
                autoGenerateTitle(currentChatId, query, aiContent, token);
            }

        } catch (error) {
            console.error("AI Error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: `Oops! I can't reach the server right now 😅 Make sure the backend is running at ${API_BASE}` }
            ]);
        } finally {
            setLoading(false);
            isSending.current = false;         // allow chatId useEffect to work again
        }
    };

    // Fire-and-forget title generation
    const autoGenerateTitle = async (chatIdForTitle, userMsg, aiReply, token) => {
        try {
            const resp = await fetch(`${API_BASE}/generate-title`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    chat_id: chatIdForTitle,
                    user_message: userMsg,
                    ai_response: aiReply
                })
            });
            if (resp.ok) {
                // Refresh sidebar to show the new AI-generated title
                fetchHistory();
            }
        } catch (err) {
            console.error("Auto-title failed (non-critical):", err);
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* ─── Messages ─── */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pt-8 md:pt-14 pb-6">
                <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-5 md:space-y-6">
                    {/* Empty State */}
                    {messages.length === 0 && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center py-20 md:py-28 space-y-5"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full animate-gentle-pulse"
                                    style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)', filter: 'blur(15px)' }} />
                                <div className="relative p-5 rounded-2xl animate-breathe"
                                    style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.12)' }}>
                                    <Sparkles className="w-10 h-10 text-blue-400" />
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-white mb-1">Start a conversation</h3>
                                <p className="text-slate-500 text-sm">Ask me anything — I'm Dobby, your friendly AI ✨</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Messages */}
                    <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.05 }}
                                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex gap-3 max-w-[90%] md:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar */}
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 transition-all ${msg.role === 'user' ? '' : 'animate-breathe'
                                        }`}
                                        style={msg.role === 'user'
                                            ? { background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }
                                            : { background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.15)' }
                                        }
                                    >
                                        {msg.role === 'user'
                                            ? <User className="w-4 h-4 text-white" />
                                            : <Sparkles className="w-4 h-4 text-violet-400" />
                                        }
                                    </div>
                                    {/* Bubble */}
                                    <div className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                        ? 'rounded-2xl rounded-tr-md'
                                        : 'rounded-2xl rounded-tl-md'
                                        }`}
                                        style={msg.role === 'user'
                                            ? { background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.1))', color: 'var(--text-primary)', border: '1px solid var(--chat-user-border)' }
                                            : { background: 'var(--chat-ai-bg)', color: 'var(--text-secondary)', border: '1px solid var(--chat-ai-border)' }
                                        }
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3"
                        >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center animate-breathe"
                                style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.15)' }}>
                                <Sparkles className="w-4 h-4 text-violet-400" />
                            </div>
                            <div className="px-5 py-3.5 rounded-2xl rounded-tl-md flex items-center gap-2"
                                style={{ background: 'var(--chat-ai-bg)', border: '1px solid var(--chat-ai-border)' }}>
                                <div className="flex gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-blue-400" style={{ animation: 'typingDot 1.2s ease-in-out infinite' }} />
                                    <span className="w-2 h-2 rounded-full bg-indigo-400" style={{ animation: 'typingDot 1.2s ease-in-out 0.2s infinite' }} />
                                    <span className="w-2 h-2 rounded-full bg-violet-400" style={{ animation: 'typingDot 1.2s ease-in-out 0.4s infinite' }} />
                                </div>
                                <span className="text-sm text-slate-500 ml-2">Dobby is thinking...</span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* ─── Input Area ─── */}
            <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2 flex-shrink-0">
                <div className="relative group max-w-3xl mx-auto">
                    <div className="absolute -inset-[1px] rounded-2xl blur-sm opacity-0 group-focus-within:opacity-30 transition-all duration-500"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }} />
                    <div className="relative flex items-center gap-2 p-2 rounded-2xl shadow-2xl"
                        style={{
                            background: 'var(--bg-header)',
                            backdropFilter: 'blur(40px)',
                            border: '1px solid var(--border-medium)',
                        }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
                            placeholder="Send a message..."
                            className="flex-1 bg-transparent border-none placeholder-slate-600 outline-none text-sm font-medium py-2 px-3"
                            style={{ color: 'var(--text-primary)' }}
                            disabled={loading}
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSend()}
                            disabled={loading || !input.trim()}
                            className="p-2.5 rounded-xl transition-all duration-300"
                            style={{
                                background: input.trim() && !loading ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'rgba(148,163,184,0.06)',
                                color: input.trim() && !loading ? '#fff' : 'rgba(148,163,184,0.3)',
                                boxShadow: input.trim() && !loading ? '0 4px 16px rgba(59,130,246,0.3)' : 'none',
                            }}
                        >
                            <Send className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* ─── Auth Modal ─── */}
            <AnimatePresence>
                {showAuthPrompt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
                        style={{ background: 'rgba(0,0,0,0.5)' }}
                        onClick={() => setShowAuthPrompt(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
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
            </AnimatePresence>
        </div>
    );
};

export default Askai;
