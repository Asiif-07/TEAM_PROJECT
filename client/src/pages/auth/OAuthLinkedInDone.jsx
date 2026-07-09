import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
// Refresh
import { useAuth } from "../../context/AuthContext";

export default function OAuthLinkedInDone() {
    const { refreshAccessToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
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
