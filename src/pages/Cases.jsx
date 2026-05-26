import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cases as casesApi } from "../api/client";

const C = { primary: "#0B3D91", secondary: "#1A6B3C", accent: "#E8A020", danger: "#EF4444", muted: "#6B7280", bg: "#F0F4F8", border: "#E2E8F0" };
const URGENCY_COLOR = { low: "#10B981", medium: "#F59E0B", high: "#EF4444", critical: "#7C3AED" };
const STATUS_LABEL = {
  waiting_for_sponsor: "🤝 Open for Sponsorship", sponsored: "❤️ Sponsored", delivering: "📦 Aid in Delivery",
  proof_uploaded: "📸 Proof Uploaded", completed: "🏁 Completed",
};
const CAT_ICON = { food: "🍚", medical: "🏥", shelter: "🏠", orphan: "👶", disaster: "🌪️", education: "📚", other: "🌍" };

function CaseCard({ c }) {
  const pct = c.targetGoal > 0 ? Math.min(100, Math.round((c.totalRaised / c.targetGoal) * 100)) : 0;
  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: `1px solid ${C.border}`, transition: "transform 0.2s, box-shadow 0.2s" }}
      onMouseOver={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)"; }}
      onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"; }}>
      {/* Card header */}
      <div style={{ background: `linear-gradient(135deg, ${C.primary}15, ${C.secondary}15)`, padding: "20px 20px 16px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <span style={{ fontSize: 28 }}>{CAT_ICON[c.category] || "🌍"}</span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <span style={{ background: (URGENCY_COLOR[c.emergencyLevel] || "#999") + "20", color: URGENCY_COLOR[c.emergencyLevel] || "#999", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
              {c.emergencyLevel}
            </span>
            <span style={{ background: "#D1FAE5", color: "#065F46", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
              ✅ Field Verified
            </span>
          </div>
        </div>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.primary, lineHeight: 1.4 }}>{c.publicTitle || "Emergency Case"}</h3>
        <div style={{ color: C.muted, fontSize: 13, marginTop: 6 }}>📍 {c.publicCity || "Somalia"}</div>
      </div>
      {/* Story */}
      <div style={{ padding: "16px 20px" }}>
        <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {c.publicStory || "Case details are being prepared for public viewing."}
        </p>
        {/* Progress */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
            <span style={{ color: C.secondary, fontWeight: 700 }}>${(c.totalRaised || 0).toLocaleString()} raised</span>
            <span style={{ color: C.muted }}>Goal: ${(c.targetGoal || 0).toLocaleString()}</span>
          </div>
          <div style={{ background: C.bg, borderRadius: 10, height: 8, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.secondary}, ${C.accent})`, borderRadius: 10, transition: "width 0.6s ease" }} />
          </div>
          <div style={{ textAlign: "right", fontSize: 12, color: C.muted, marginTop: 4 }}>{pct}% funded</div>
        </div>
        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
          <span style={{ fontSize: 12, color: C.muted }}>{STATUS_LABEL[c.status] || c.status}</span>
          <Link to={`/donate?caseId=${c.id}`}
            style={{ background: C.primary, color: "#fff", padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "background 0.2s" }}
            onMouseOver={e => e.target.style.background = C.secondary}
            onMouseOut={e => e.target.style.background = C.primary}>
            Sponsor →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Cases() {
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

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color: "#fff", padding: "60px 20px 40px", textAlign: "center" }}>
        <h1 style={{ margin: "0 0 12px", fontSize: "clamp(28px,5vw,44px)", fontWeight: 800 }}>🌍 Verified Emergency Cases</h1>
        <p style={{ margin: 0, opacity: 0.85, fontSize: 16, maxWidth: 600, marginInline: "auto" }}>
          Every case below has been physically verified by our field team and approved by our office. Your sponsorship goes directly to those in need.
        </p>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
          {[["🔍","Field Verified"],["🏢","Office Approved"],["🔐","Privacy Protected"],["💳","Secure Escrow"]].map(([icon,label]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", padding: "8px 16px", borderRadius: 20 }}>
              <span>{icon}</span><span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 24 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search cases..."
              style={{ flex: 1, minWidth: 200, padding: "10px 16px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14 }} />
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
              style={{ padding: "10px 14px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14 }}>
              {cats.map(c => <option key={c} value={c}>{CAT_ICON[c] || "🌍"} {c === "all" ? "All Categories" : c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
            </select>
            <select value={urgFilter} onChange={e => setUrgFilter(e.target.value)}
              style={{ padding: "10px 14px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14 }}>
              {urgs.map(u => <option key={u} value={u}>{u === "all" ? "All Urgency" : u.charAt(0).toUpperCase()+u.slice(1)}</option>)}
            </select>
            <div style={{ display: "flex", gap: 4 }}>
              {[["⊞","grid"],["☰","table"]].map(([icon, v]) => (
                <button key={v} onClick={() => setView(v)} style={{ padding: "8px 12px", border: `1px solid ${C.border}`, borderRadius: 8, background: view===v ? C.primary : "#fff", color: view===v ? "#fff" : C.muted, cursor: "pointer" }}>{icon}</button>
              ))}
            </div>
          </div>
        </div>

        {loading && <div style={{ textAlign: "center", padding: "60px 0", color: C.muted, fontSize: 18 }}>⏳ Loading verified cases...</div>}
        {error && <div style={{ textAlign: "center", padding: "60px 0", color: C.danger }}>{error}</div>}
        {!loading && filtered.length === 0 && <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>No cases found matching your filters.</div>}

        {!loading && filtered.length > 0 && view === "grid" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {filtered.map(c => <CaseCard key={c.id} c={c} />)}
          </div>
        )}

        {!loading && filtered.length > 0 && view === "table" && (
          <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: C.primary, color: "#fff" }}>
                  {["Category","Title","Location","Urgency","Goal","Raised","Status","Action"].map(h => (
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
                      <Link to={`/donate?caseId=${c.id}`} style={{ background: C.primary, color: "#fff", padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>Sponsor</Link>
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
