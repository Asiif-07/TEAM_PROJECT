import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (isAuthenticated && user) {
            const newSocket = io(
                import.meta.env.VITE_SOCKET_URL || "http://localhost:2000",
                {
                    query: { userId: user._id },
                    withCredentials: true,
                    transports: ["websocket"],
                }
            );

            newSocket.on("connect", () => {
                console.log("Socket connected:", newSocket.id);
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        } else {
            setSocket(null);
        }
    }, [isAuthenticated, user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
