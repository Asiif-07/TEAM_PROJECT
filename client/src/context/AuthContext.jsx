import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
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

    const refreshAccessToken = useCallback(async () => {
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
                // If refresh fails, the session is likely dead. Clear state to trigger redirection.
                setAccessToken("");
                setUser(null);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("currentUser");
                return { accessToken: "" };
            }
        })();

        try {
            return await refreshPromiseRef.current;
        } finally {
            refreshPromiseRef.current = null;
        }
    }, []);

    useEffect(() => {
        // Try a silent refresh on initial mount when we don't already have an access token.
        // This allows reloading the app without forcing the user to sign in again if a refresh
        // cookie is present. If refresh fails, continue without blocking the UI.
        let mounted = true;
        (async () => {
            try {
                if (!accessToken) {
                    setLoading(true);
                    await refreshAccessToken();
                }
            } catch {
                // ignore - user will remain unauthenticated
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [accessToken, refreshAccessToken]);

    const signup = useCallback(async (name, email, password, gender) => {
        try {
            const data = await authApi.register({ name, email, password, gender });
            return { success: true, message: data?.message || "Account created successfully." };
        } catch (err) {
            return { success: false, message: err?.message || "An error occurred during signup." };
        }
    }, []);

    const login = useCallback(async (email, password) => {
        try {
            const data = await authApi.login({ email, password });
            if (data?.accessToken) {
                setAccessToken(data.accessToken);
                localStorage.setItem("accessToken", data.accessToken);
            }
            if (data?.user) {
                setUser(data.user);
                localStorage.setItem("currentUser", JSON.stringify(data.user));
            }
            // Also try to refresh to get latest token + user from cookie (best-effort)
            await refreshAccessToken().catch(() => { });
            return { success: true };
        } catch (err) {
            return { success: false, message: err?.message || "An error occurred during login." };
        }
    }, [refreshAccessToken]);

    const loginWithGoogle = useCallback(async (credentialOrPayload) => {
        try {
            // Accept either a plain credential string or an object { credential } / { code }
            let payload;
            if (typeof credentialOrPayload === "string") {
                payload = { credential: credentialOrPayload };
            } else if (typeof credentialOrPayload === "object" && credentialOrPayload !== null) {
                payload = credentialOrPayload;
            } else {
                payload = {};
            }

            const data = await authApi.googleLogin(payload);
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
    }, []);

    const logout = useCallback(async () => {
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
    }, []);

    const value = useMemo(() => ({
        user,
        setUser,
        accessToken,
        setAccessToken,
        refreshAccessToken,
        signup,
        login,
        // Backwards-compatible alias expected by some components
        googleLogin: loginWithGoogle,
        loginWithGoogle,
        logout,
        loading,
        isAuthenticated: Boolean(accessToken),
    }), [user, accessToken, loading, refreshAccessToken, signup, login, loginWithGoogle, logout]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
