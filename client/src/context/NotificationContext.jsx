import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useSocket } from "./SocketContext";
import * as notificationApi from "../api/notification";
import toast from "react-hot-toast";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { isAuthenticated, accessToken, refreshAccessToken } = useAuth();
    const socket = useSocket();
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated || !accessToken) return;
        try {
            const response = await notificationApi.getNotifications({
                accessToken,
                refreshAccessToken,
            });
            setNotifications(response.notifications || []);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    }, [isAuthenticated, accessToken, refreshAccessToken]);

    // Fetch on mount / login
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchNotifications();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchNotifications]);

    // Listen for real-time notifications via WebSocket
    useEffect(() => {
        if (!socket) return;

        const handleNotification = (data) => {
            console.log("[Notification] Received real-time event:", data);

            // Avoid duplicates if already in list
            setNotifications((prev) => {
                if (prev.find(n => n._id === data._id)) return prev;
                return [data, ...prev];
            });

            const typeLabel = {
                reply: "💬 New Reply",
                like: "❤️ New Like",
                mention: "📣 You were mentioned",
            };
            const title = typeLabel[data.type] || "🔔 Notification";
            const senderName = data.sender?.name || "Someone";

            let message = "";
            if (data.type === "reply") message = `${senderName} replied to your post`;
            else if (data.type === "like") message = `${senderName} liked your post`;
            else if (data.type === "mention") message = `${senderName} mentioned you`;
            else message = `${senderName} sent you a notification`;

            // In-app toast (always show)
            toast(message, {
                duration: 5000,
                position: "top-right",
                icon: title.split(" ")[0],
            });
        };

        socket.on("notification", handleNotification);
        return () => socket.off("notification", handleNotification);
    }, [socket]);

    return (
        <NotificationContext.Provider value={{ notifications, fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};
