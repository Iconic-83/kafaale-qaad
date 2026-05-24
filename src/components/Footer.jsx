import { Link } from "react-router-dom";

const COLORS = { primary: "#0B3D91", secondary: "#1A6B3C", accent: "#E8A020" };

export default function Footer() {
  return (
    <footer style={{ background: "#0B1F4A", color: "#fff", fontFamily: "'Segoe UI', system-ui, sans-serif", marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 32 }}>🤝</span>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900 }}>KAFAALE QAAD</div>
                <div style={{ fontSize: 9, opacity: 0.6, letterSpacing: 1.5 }}>HUMANITARIAN AID PLATFORM</div>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.8, opacity: 0.7, maxWidth: 280 }}>
              Transparent, fraud-proof humanitarian aid distribution — bridging the gap between those who need help and those who want to give.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {["📘 Facebook", "🐦 Twitter", "💼 LinkedIn"].map(s => (
                <span key={s} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.5, letterSpacing: 1.5, marginBottom: 16 }}>PLATFORM</div>
            {[["Home", "/"], ["About", "/about"], ["How It Works", "/how-it-works"], ["Active Cases", "/cases"], ["Donate", "/donate"]].map(([label, to]) => (
              <div key={to} style={{ marginBottom: 10 }}>
                <Link to={to} style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: 14 }}>{label}</Link>
              </div>
            ))}
          </div>

          {/* Roles */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.5, letterSpacing: 1.5, marginBottom: 16 }}>ROLES</div>
            {["👁️ Reporter", "🏛️ Verification", "🗺️ Field Team", "❤️ Donor", "🛡️ Super Admin"].map(r => (
              <div key={r} style={{ marginBottom: 10, fontSize: 14, opacity: 0.75 }}>{r}</div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.5, letterSpacing: 1.5, marginBottom: 16 }}>CONTACT</div>
            <div style={{ fontSize: 14, opacity: 0.75, lineHeight: 2.2 }}>
              <div>📧 support@kafaale.so</div>
              <div>📞 +252 611 000 000</div>
              <div>📍 Mogadishu, Somalia</div>
              <div>🌐 kafaale.so</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, opacity: 0.5 }}>
          <span>© 2026 Kafaale Qaad. All rights reserved.</span>
          <span>🔐 OTP · Face Verification · Encrypted Payments · AI Fraud Detection · Audit Trails</span>
        </div>
      </div>
    </footer>
  );
}
