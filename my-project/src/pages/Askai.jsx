import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams, useOutletContext } from "react-router-dom";
import {
    Send,
    User,
    Bot,
    Loader2,
    Trash2,
    MessageSquare,
    Lock
} from "lucide-react";
// import { useChatHistory } from "../hooks/useChatHistory"; // Removed

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
    // const { createChat, fetchHistory } = useChatHistory(); // Removed

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load chat history if chatId is present
    useEffect(() => {
        const fetchChatMessages = async () => {
            if (!chatId || !isLoggedIn) {
                setMessages([]);
                return;
            }

            setLoading(true);
            try {
                const token = localStorage.getItem("access_token");
                const response = await fetch(`http://localhost:8000/chats/${chatId}`, {
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

        let currentChatId = chatId;

        // If no chat ID, create a new chat first
        if (!currentChatId) {
            const title = query.length > 30 ? query.substring(0, 30) + "..." : query;
            const newChat = await createChat(title);
            if (newChat) {
                currentChatId = newChat.id;
                // Update URL without reloading
                navigate(`/ask-ai?chatId=${newChat.id}`, { replace: true });
            } else {
                // Failed to create chat
                setMessages(prev => [...prev, { role: "assistant", content: "Failed to start new chat. Please try again." }]);
                return;
            }
        }

        // Add user message to UI immediately
        const userMessage = { role: "user", content: query };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const token = localStorage.getItem("access_token");

            // 1. Save user message to backend
            await fetch(`http://localhost:8000/chats/${currentChatId}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ role: "user", content: query })
            });

            // 2. Get AI response
            const response = await fetch("http://localhost:8000/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: query,
                    system_prompt: "You are Dobby, a friendly, warm, and conversational AI assistant. Talk naturally like a real person — use casual language, emojis, and keep things fun and engaging. Be concise but helpful. Do NOT use markdown formatting like headers, bullet points, or bold text. Just talk like a human friend would in a chat."
                }),
            });

            if (!response.ok) throw new Error("Failed to get AI response");

            const data = await response.json();
            const aiContent = data.response || "Hmm, I couldn't figure that out 🤔";

            // 3. Save AI response to backend
            await fetch(`http://localhost:8000/chats/${currentChatId}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ role: "assistant", content: aiContent })
            });

            setMessages((prev) => [...prev, { role: "assistant", content: aiContent }]);

            // Refresh sidebar history
            fetchHistory();

        } catch (error) {
            console.error("AI Error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Oops! I can't reach the server right now 😅 Make sure the backend is running at http://localhost:8000" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pt-16 pb-6">
                <div className="max-w-3xl mx-auto px-6 space-y-8">
                    {messages.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center py-28 space-y-4 animate-[fadeIn_0.5s_ease-out]">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                <MessageSquare className="w-10 h-10 text-zinc-600" />
                            </div>
                            <p className="text-zinc-500 text-sm font-medium">Start a conversation with Dobby...</p>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex gap-3 animate-[slideUp_0.3s_ease-out] ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                                    : 'bg-white/10 text-purple-400 border border-white/10'
                                    }`}>
                                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                    ? 'bg-blue-600/20 text-white border border-blue-500/20 rounded-tr-sm'
                                    : 'bg-white/[0.06] text-zinc-200 border border-white/5 rounded-tl-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex gap-3 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                                <Bot className="w-4 h-4 text-purple-400" />
                            </div>
                            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.06] text-zinc-400 flex items-center gap-3 border border-white/5">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                                <span className="text-sm">Dobby is thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="px-6 pb-6 pt-2 flex-shrink-0">
                <div className="relative group max-w-3xl mx-auto">
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-sm opacity-10 group-focus-within:opacity-30 transition duration-500"></div>
                    <div className="relative bg-[#0c0f16]/90 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 flex items-center gap-2 shadow-2xl">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
                            placeholder="Send a message..."
                            className="flex-1 bg-transparent border-none text-white placeholder-zinc-600 outline-none text-sm font-medium py-2 px-3"
                            disabled={loading}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={loading || !input.trim()}
                            className={`p-2.5 rounded-xl transition-all duration-300 ${input.trim() && !loading ? "bg-blue-600 text-white shadow-lg hover:bg-blue-500" : "bg-white/5 text-zinc-700"}`}
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

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(12px); }
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

export default Askai;
