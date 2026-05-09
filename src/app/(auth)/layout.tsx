import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "24px", position: "relative", overflow: "hidden" }}>
      {/* Background blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", width: "500px", height: "500px", background: "rgba(99,102,241,0.07)", borderRadius: "50%", top: "-150px", left: "-120px", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", width: "420px", height: "420px", background: "rgba(139,92,246,0.06)", borderRadius: "50%", bottom: "-120px", right: "-100px", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", width: "300px", height: "300px", background: "rgba(99,102,241,0.05)", borderRadius: "50%", top: "35%", right: "10%", filter: "blur(60px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "460px" }}>
        {children}
      </div>

      <style>{`
        @media (max-width: 480px) {
          .auth-card { padding: 28px 20px !important; }
        }
      `}</style>
    </div>
  );
}
