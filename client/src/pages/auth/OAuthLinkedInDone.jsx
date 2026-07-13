import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
// Refresh
import { useAuth } from "../../context/AuthContext";

export default function OAuthLinkedInDone() {
    const { refreshAccessToken, setAccessToken, setUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const searchParams = new URLSearchParams(window.location.search);
                const t = searchParams.get("t");
                if (t) {
                    try {
                        const decodedStr = atob(t);
                        const decoded = JSON.parse(decodedStr);
                        if (decoded?.accessToken) {
                            setAccessToken(decoded.accessToken);
                            localStorage.setItem("accessToken", decoded.accessToken);
                            if (decoded.user) {
                                setUser(decoded.user);
                                localStorage.setItem("currentUser", JSON.stringify(decoded.user));
                            }
                            if (!cancelled) {
                                navigate("/", { replace: true });
                            }
                            return;
                        }
                    } catch (e) {
                        console.error("Failed to parse LinkedIn token payload:", e);
                    }
                }

                const r = await refreshAccessToken();
                if (cancelled) return;
                if (r?.accessToken) {
                    navigate("/", { replace: true });
                    return;
                }
            } catch {
                // fall through to login
            }
            if (!cancelled) {
                navigate("/login?oauth_error=Could%20not%20complete%20sign-in.%20Try%20again.", { replace: true });
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [refreshAccessToken, navigate]);

    return (
        <Box
            sx={{
                minHeight: "60vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 2,
            }}
        >
            <CircularProgress sx={{ color: "#0077b5" }} />
            <Typography sx={{ color: "#6B7280", fontWeight: 500 }}>Finishing LinkedIn sign-in…</Typography>
        </Box>
    );
}
