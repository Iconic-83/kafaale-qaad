import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const C = { primary: "#0B3D91", secondary: "#1A6B3C", accent: "#E8A020" };

const ROLE_BADGE = { super_admin: "🛡️ Super Admin", admin: "🏢 Admin", field_agent: "🔍 Field Agent", donor: "💳 Donor", reporter: "📝 Reporter" };

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/how-it-works", label: "How It Works" },
    { to: "/cases", label: "🌍 Cases" },
    { to: "/donate", label: "💳 Donate" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 500, background: "#fff", boxShadow: "0 2px 16px rgba(11,61,145,.12)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 30 }}>🤝</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: C.primary, letterSpacing: -0.5 }}>KAFAALE QAAD</div>
            <div style={{ fontSize: 9, color: C.secondary, fontWeight: 700, letterSpacing: 1.5 }}>HUMANITARIAN AID PLATFORM</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              textDecoration: "none", padding: "8px 12px", borderRadius: 8, fontSize: 14, fontWeight: 600,
              color: isActive(l.to) ? C.primary : "#374151",
              background: isActive(l.to) ? C.primary + "12" : "transparent",
            }}>{l.label}</Link>
          ))}

          {user ? (
            <div style={{ position: "relative", marginLeft: 8 }}>
              <button onClick={() => setDropOpen(!dropOpen)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: C.primary + "12", border: `1px solid ${C.primary}30`, borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, color: C.primary }}>
                <span style={{ width: 28, height: 28, borderRadius: "50%", background: C.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                  {user.name?.[0]?.toUpperCase() || "U"}
                </span>
                <span>{user.name?.split(" ")[0]}</span>
                <span>▾</span>
              </button>
              {dropOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff", borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.15)", padding: 8, minWidth: 200, zIndex: 600 }}>
                  <div style={{ padding: "10px 14px", borderBottom: "1px solid #f0f0f0", marginBottom: 6 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>{ROLE_BADGE[user.role] || user.role}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>{user.email}</div>
                  </div>
                  <button onClick={() => { navigate("/dashboard"); setDropOpen(false); }}
                    style={{ width: "100%", padding: "10px 14px", background: "none", border: "none", textAlign: "left", cursor: "pointer", borderRadius: 8, fontSize: 14, fontWeight: 600, color: C.primary }}>
                    📊 Dashboard
                  </button>
                  <button onClick={() => { logout(); navigate("/"); setDropOpen(false); }}
                    style={{ width: "100%", padding: "10px 14px", background: "none", border: "none", textAlign: "left", cursor: "pointer", borderRadius: 8, fontSize: 14, color: "#EF4444" }}>
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8, marginLeft: 8 }}>
              <Link to="/login" style={{ padding: "9px 16px", border: `1px solid ${C.primary}`, color: C.primary, borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Sign In</Link>
              <button onClick={() => navigate("/dashboard")}
                style={{ padding: "9px 18px", background: C.primary, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Dashboard →
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
