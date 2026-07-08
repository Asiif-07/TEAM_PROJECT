import React from "react";

export default function PageLoader() {
  return (
    <div style={styles.overlay}>
      <div className="cf-circle" />
      <style>{`
        .cf-circle {
          width: 48px;
          height: 48px;
          border: 4px solid #e0e7ff;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: cf-spin 0.8s linear infinite;
        }
        @keyframes cf-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
    zIndex: 9999,
  },
};
