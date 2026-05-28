import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cases as casesApi } from "../api/client";
import { useLang } from "../context/LanguageContext.jsx";
import { PT } from "../translations.js";
import { useResponsive } from "../hooks/useResponsive.js";

const C = { navy: "#002651", primary: "#004B96", secondary: "#4B7D19", accent: "#E0AB21", danger: "#C0392B", muted: "#5A6E8A", bg: "#F4F7FC", border: "#D8E4F0", text: "#0D1F3C", gold: "#E0AB21", green: "#4B7D19", blue: "#004B96" };
const URGENCY_COLOR = { low: "#10B981", medium: "#F59E0B", high: "#C0392B", critical: "#7C3AED" };
const STATUS_LABEL = {
  waiting_for_sponsor: "🤝 Open for Sponsorship", sponsored: "❤️ Sponsored", delivering: "📦 Aid in Delivery",
  proof_uploaded: "📸 Proof Uploaded", completed: "🏁 Completed",
};
const CAT_ICON = { food: "🍚", medical: "🏥", shelter: "🏠", orphan: "👶", disaster: "🌪️", education: "📚", other: "🌍" };

function CaseCard({ c, P }) {
  const pct = c.targetGoal > 0 ? Math.min(100, Math.round((c.totalRaised / c.targetGoal) * 100)) : 0;
  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: `1px solid ${C.border}`, transition: "transform 0.2s, box-shadow 0.2s" }}
      onMouseOver={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)"; }}
      onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"; }}>
      <div style={{ background: `linear-gradient(135deg, ${C.primary}15, ${C.secondary}15)`, padding: "20px 20px 16px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <span style={{ fontSize: 28 }}>{CAT_ICON[c.category] || "🌍"}</span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <span style={{ background: (URGENCY_COLOR[c.emergencyLevel] || "#999") + "20", color: URGENCY_COLOR[c.emergencyLevel] || "#999", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
              {c.emergencyLevel}
            </span>
            <span style={{ background: "#D1FAE5", color: "#065F46", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
              {P.field_verified}
            </span>
          </div>
        </div>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.primary, lineHeight: 1.4 }}>{c.publicTitle || "Emergency Case"}</h3>
        <div style={{ color: C.muted, fontSize: 13, marginTop: 6 }}>📍 {c.publicCity || "Somalia"}</div>
      </div>
      <div style={{ padding: "16px 20px" }}>
        <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {c.publicStory || "Case details are being prepared for public viewing."}
        </p>
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
            <span style={{ color: C.secondary, fontWeight: 700 }}>${(c.totalRaised || 0).toLocaleString()} {P.raised}</span>
            <span style={{ color: C.muted }}>{P.goal} ${(c.targetGoal || 0).toLocaleString()}</span>
          </div>
          <div style={{ background: C.bg, borderRadius: 10, height: 8, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.secondary}, ${C.accent})`, borderRadius: 10, transition: "width 0.6s ease" }} />
          </div>
          <div style={{ textAlign: "right", fontSize: 12, color: C.muted, marginTop: 4 }}>{pct}% {P.funded}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, gap: 8 }}>
          <Link to={`/cases/${c.id}`}
            style={{ flex: 1, textAlign: "center", background: C.bg, color: C.primary, padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none", border: `1px solid ${C.border}` }}>
            View Details
          </Link>
          <Link to={`/donate?caseId=${c.id}`}
            style={{ flex: 1, textAlign: "center", background: C.primary, color: "#fff", padding: "8px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "background 0.2s" }}
            onMouseOver={e => e.currentTarget.style.background = C.secondary}
            onMouseOut={e => e.currentTarget.style.background = C.primary}>
            {P.sponsor}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Cases() {
  const { lang } = useLang();
  const P = PT.cases[lang] || PT.cases.en;
  const { isMobile } = useResponsive();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [urgFilter, setUrgFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");

  useEffect(() => {
    casesApi.list()
      .then(d => setItems(d.cases || []))
      .catch(() => setError("Failed to load cases"))
      .finally(() => setLoading(false));
  }, []);

  const cats = ["all","food","medical","shelter","orphan","disaster","education"];
  const urgs = ["all","critical","high","medium","low"];

  const filtered = items.filter(c => {
    if (catFilter !== "all" && c.category !== catFilter) return false;
    if (urgFilter !== "all" && c.emergencyLevel !== urgFilter) return false;
    if (search && !(c.publicTitle?.toLowerCase().includes(search.toLowerCase()) || c.publicCity?.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const TRUST_BADGES = [
    ["🔍", P.badge_verified],
    ["🏢", P.badge_approved],
    ["🔐", P.badge_privacy],
    ["💳", P.badge_escrow],
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color: "#fff", padding: "60px 20px 40px", textAlign: "center" }}>
        <h1 style={{ margin: "0 0 12px", fontSize: "clamp(28px,5vw,44px)", fontWeight: 800 }}>{P.hero_title}</h1>
        <p style={{ margin: 0, opacity: 0.85, fontSize: 16, maxWidth: 600, marginInline: "auto" }}>
          {P.hero_sub}
        </p>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
          {TRUST_BADGES.map(([icon, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", padding: "8px 16px", borderRadius: 20 }}>
              <span>{icon}</span><span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: isMobile ? "16px" : "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 24 }}>
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", flexWrap: "wrap", gap: 10, alignItems: "stretch" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={P.search_ph}
              style={{ flex: 1, minWidth: 0, padding: "10px 16px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14 }} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                style={{ flex: 1, minWidth: 110, padding: "10px 14px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14 }}>
                {cats.map(c => <option key={c} value={c}>{CAT_ICON[c] || "🌍"} {c === "all" ? P.cat_all : c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
              </select>
              <select value={urgFilter} onChange={e => setUrgFilter(e.target.value)}
                style={{ flex: 1, minWidth: 100, padding: "10px 14px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14 }}>
                {urgs.map(u => <option key={u} value={u}>{u === "all" ? P.urg_all : u.charAt(0).toUpperCase()+u.slice(1)}</option>)}
              </select>
              <div style={{ display: "flex", gap: 4 }}>
                {[["⊞","grid"],["☰","table"]].map(([icon, v]) => (
                  <button key={v} onClick={() => setView(v)} style={{ padding: "8px 12px", border: `1px solid ${C.border}`, borderRadius: 8, background: view===v ? C.primary : "#fff", color: view===v ? "#fff" : C.muted, cursor: "pointer" }}>{icon}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading && <div style={{ textAlign: "center", padding: "60px 0", color: C.muted, fontSize: 18 }}>{P.loading}</div>}
        {error && <div style={{ textAlign: "center", padding: "60px 0", color: C.danger }}>{error}</div>}
        {!loading && filtered.length === 0 && <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>{P.no_cases}</div>}

        {!loading && filtered.length > 0 && view === "grid" && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))", gap: isMobile ? 16 : 24 }}>
            {filtered.map(c => <CaseCard key={c.id} c={c} P={P} />)}
          </div>
        )}

        {!loading && filtered.length > 0 && view === "table" && (
          <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: C.primary, color: "#fff" }}>
                  {[P.th_cat, P.th_title, P.th_loc, P.th_urg, P.th_goal, P.th_raised, P.th_status, P.th_action].map(h => (
                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 13, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id} style={{ background: i%2===0 ? "#fff" : C.bg, borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "12px 16px" }}>{CAT_ICON[c.category]} {c.category}</td>
                    <td style={{ padding: "12px 16px", maxWidth: 200, fontSize: 13 }}>{c.publicTitle || "—"}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13 }}>📍 {c.publicCity}</td>
                    <td style={{ padding: "12px 16px" }}><span style={{ color: URGENCY_COLOR[c.emergencyLevel], fontWeight: 700, textTransform: "capitalize" }}>{c.emergencyLevel}</span></td>
                    <td style={{ padding: "12px 16px", fontSize: 13 }}>${(c.targetGoal||0).toLocaleString()}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: C.secondary, fontWeight: 600 }}>${(c.totalRaised||0).toLocaleString()}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12 }}>{STATUS_LABEL[c.status] || c.status}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <Link to={`/donate?caseId=${c.id}`} style={{ background: C.primary, color: "#fff", padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>{P.sponsor}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
