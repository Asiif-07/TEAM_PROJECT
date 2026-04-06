import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { loadGoogleIdentityScript } from "../../utils/loadGoogleIdentityScript";

export default function GoogleSignInButton({ onCredential, disabled }) {
  const containerRef = useRef(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!clientId || disabled || !containerRef.current) return;

    let cancelled = false;

    const mountButton = () => {
      if (cancelled || !containerRef.current || !window.google?.accounts?.id) return;
      const el = containerRef.current;
      el.innerHTML = "";
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (res) => {
          if (res?.credential) onCredential(res.credential);
        },
      });
      const w = Math.max(280, Math.floor(el.getBoundingClientRect().width) || 320);
      window.google.accounts.id.renderButton(el, {
        type: "standard",
        theme: "filled_black",
        size: "large",
        width: w,
        text: "continue_with",
        shape: "pill",
        logo_alignment: "center"
      });
    };

    loadGoogleIdentityScript()
      .then(() => {
        if (!cancelled) mountButton();
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err?.message || "Could not load Google sign-in.");
      });

    return () => {
      cancelled = true;
    };
  }, [clientId, disabled, onCredential]);
  if (!clientId) return null;

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
      {loadError ? (
        <Typography variant="caption" sx={{ color: "#DC2626", textAlign: "center" }}>
          {loadError}
        </Typography>
      ) : null}
      <Box ref={containerRef} sx={{ width: "100%", minHeight: 44, display: "flex", justifyContent: "center" }} />
    </Box>
  );
}
