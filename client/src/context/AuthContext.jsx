import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken") || "");
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("currentUser");
        if (!storedUser) return null;
        try {
            return JSON.parse(storedUser);
        } catch (error) {
            console.error("Failed to parse stored user:", error);
            localStorage.removeItem("currentUser");
            return null;
        }
    });
    const [loading, setLoading] = useState(true);
    const refreshPromiseRef = useRef(null);

    const refreshAccessToken = async () => {
        if (refreshPromiseRef.current) return refreshPromiseRef.current;

        refreshPromiseRef.current = (async () => {
        try {
            const data = await authApi.refreshToken();
            if (data?.accessToken) {
                setAccessToken(data.accessToken);
                localStorage.setItem("accessToken", data.accessToken);
            }
            if (data?.user) {
                setUser(data.user);
                localStorage.setItem("currentUser", JSON.stringify(data.user));
            }
            return { accessToken: data?.accessToken || "" };
        } catch {
            return { accessToken: "" };
        }
        })();

        try {
            return await refreshPromiseRef.current;
        } finally {
            refreshPromiseRef.current = null;
        }
    };

    useEffect(() => {
        // Avoid calling refresh-token on initial mount. Instead, refresh is triggered only when an API
        // returns 401 (see `client/src/api/http.js`), preventing startup timing/proxy errors.
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const signup = async (name, email, password, gender) => {
        try {
            const data = await authApi.register({ name, email, password, gender });
            return { success: true, message: data?.message || "Account created successfully." };
        } catch (err) {
            return { success: false, message: err?.message || "An error occurred during signup." };
        }
    };

    const login = async (email, password) => {
        try {
            const data = await authApi.login({ email, password });
            if (data?.accessToken) {
                setAccessToken(data.accessToken);
                localStorage.setItem("accessToken", data.accessToken);
            }
            await refreshAccessToken();
            return { success: true };
        } catch (err) {
            return { success: false, message: err?.message || "An error occurred during login." };
        }
    };

    const loginWithGoogle = async (credential) => {
        try {
            const data = await authApi.googleLogin({ credential });
            if (data?.accessToken) {
                setAccessToken(data.accessToken);
                localStorage.setItem("accessToken", data.accessToken);
            }
            if (data?.user) {
                setUser(data.user);
                localStorage.setItem("currentUser", JSON.stringify(data.user));
            }
            return { success: true };
        } catch (err) {
            return { success: false, message: err?.message || "Google sign-in failed." };
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch {
            // Cleanup local session even if backend logout request fails.
        }
        try {
            if (typeof window !== "undefined" && window.google?.accounts?.id) {
                window.google.accounts.id.disableAutoSelect();
            }
        } catch {
            // Ignore if GIS is unavailable.
        }
        setUser(null);
        localStorage.removeItem("currentUser");
        setAccessToken("");
        localStorage.removeItem("accessToken");
    };

    const value = useMemo(() => ({
        user,
        setUser,
        accessToken,
        setAccessToken,
        refreshAccessToken,
        signup,
        login,
        loginWithGoogle,
        logout,
        loading,
        isAuthenticated: Boolean(accessToken),
    }), [user, accessToken, loading]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
