import { useState, useEffect, useCallback } from "react";
import { API_BASE } from "../config";

export const useChatHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all chats
    const fetchHistory = useCallback(async (searchQuery = "") => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            console.log("Fetching history. Base URL:", API_BASE, "Query:", searchQuery, "Token present:", !!token);

            const url = searchQuery
                ? `${API_BASE}/chats/?q=${encodeURIComponent(searchQuery)}`
                : `${API_BASE}/chats/`;

            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log("Fetch history response status:", response.status);

            if (!response.ok) {
                if (response.status === 401) {
                    console.error("Unauthorized - clearing history");
                    setHistory([]);
                }
                return;
            }

            const data = await response.json();
            console.log("Fetched history data:", data);
            setHistory(data);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    }, []);
    // Create a new chat
    const createChat = async (title) => {
        const token = localStorage.getItem("access_token");
        if (!token) return null;

        try {
            const response = await fetch(`${API_BASE}/chats/`, {
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
            const response = await fetch(`${API_BASE}/chats/${chatId}`, {
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

    // Clear history
    const clearHistory = useCallback(() => {
        setHistory([]);
    }, []);

    return {
        history,
        loading,
        error,
        fetchHistory,
        createChat,
        deleteChat,
        clearHistory
    };
};
