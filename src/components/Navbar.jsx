import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const COLORS = { primary: "#0B3D91", secondary: "#1A6B3C", accent: "#E8A020" };

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: "/",           label: "Home"        },
    { to: "/about",      label: "About"       },
    { to: "/how-it-works", label: "How It Works" },
    { to: "/cases",      label: "Cases"       },
    { to: "/donate",     label: "Donate"      },
    { to: "/contact",    label: "Contact"     },
  ];

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 200, background: "#fff", boxShadow: "0 2px 16px rgba(11,61,145,.12)", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 30 }}>🤝</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: COLORS.primary, letterSpacing: -0.5 }}>KAFAALE QAAD</div>
            <div style={{ fontSize: 9, color: COLORS.secondary, fontWeight: 700, letterSpacing: 1.5 }}>HUMANITARIAN AID PLATFORM</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              textDecoration: "none", padding: "8px 14px", borderRadius: 8, fontSize: 14, fontWeight: 600,
              color: isActive(l.to) ? COLORS.primary : "#374151",
              background: isActive(l.to) ? COLORS.primary + "12" : "transparent",
              transition: "all 0.15s"
            }}>
              {l.label}
            </Link>
          ))}
          <button onClick={() => navigate("/dashboard")}
            style={{ marginLeft: 8, padding: "9px 20px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Dashboard →
          </button>
        </div>
      </div>
    </nav>
  );
}
