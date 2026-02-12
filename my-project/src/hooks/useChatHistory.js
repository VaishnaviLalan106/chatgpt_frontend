import { useState, useEffect, useCallback } from "react";

export const useChatHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all chats
    const fetchHistory = useCallback(async () => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        setLoading(true);
        try {
            const response = await fetch("http://localhost:8000/chats/", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                localStorage.clear();
                window.location.href = "/login";
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setHistory(data);
            }
        } catch (err) {
            console.error("Failed to fetch history:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Create a new chat
    const createChat = async (title) => {
        const token = localStorage.getItem("access_token");
        if (!token) return null;

        try {
            const response = await fetch("http://localhost:8000/chats/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ title })
            });

            if (response.status === 401) {
                localStorage.clear();
                window.location.href = "/login";
                return null;
            }

            if (response.ok) {
                const newChat = await response.json();
                setHistory(prev => [newChat, ...prev]);
                return newChat;
            }
        } catch (err) {
            console.error("Failed to create chat:", err);
        }
        return null;
    };

    // Delete a chat
    const deleteChat = async (chatId) => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:8000/chats/${chatId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                setHistory(prev => prev.filter(chat => chat.id !== chatId));
            }
        } catch (err) {
            console.error("Failed to delete chat:", err);
        }
    };

    // Load history on mount
    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return {
        history,
        loading,
        error,
        fetchHistory,
        createChat,
        deleteChat
    };
};
