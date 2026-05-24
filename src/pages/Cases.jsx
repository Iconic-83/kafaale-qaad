import { useState } from "react";
import { Link } from "react-router-dom";

const C = { primary: "#0B3D91", secondary: "#1A6B3C", accent: "#E8A020", danger: "#EF4444", muted: "#6B7280", bg: "#F0F4F8", border: "#E2E8F0" };
const URGENCY = { Low: "#10B981", Medium: "#F59E0B", High: "#EF4444", Critical: "#7C3AED" };
const STATUS_COLORS = {
  "Pending Verification": "#F59E0B", "Under Review": "#3B82F6", "Investigating": "#8B5CF6",
  "Verified": "#10B981", "Waiting Sponsor": "#F59E0B", "Sponsored": "#EC4899",
  "Aid Delivered": "#06B6D4", "Completed": "#6B7280",
};

const ALL_CASES = [
  { id: "C001", name: "Amina Hassan",   age: 34, gender: "Female", location: "Mogadishu, Hodan",    urgency: "Critical", status: "Verified",        desc: "Single mother of 4, lost home in flood, urgent shelter needed. Family confirmed displaced, living in makeshift shelter near Hodan district.",     donated: 0,    need: 900  },
  { id: "C002", name: "Mohamud Ali",    age: 67, gender: "Male",   location: "Mogadishu, Bondhere", urgency: "High",     status: "Waiting Sponsor", desc: "Elderly man with chronic illness, needs medication and food support. Medical records verified — critically low on insulin for diabetes.",           donated: 0,    need: 600  },
  { id: "C003", name: "Fadumo Warsame", age: 28, gender: "Female", location: "Kismayo",             urgency: "High",     status: "Sponsored",       desc: "Widow with 3 children, no income source, severe food insecurity. Children confirmed malnourished. Sponsorship secured — aid in progress.",       donated: 500,  need: 500  },
  { id: "C004", name: "Cabdi Xasan",    age: 45, gender: "Male",   location: "Beledweyne",          urgency: "Medium",   status: "Aid Delivered",   desc: "Person with disability, cannot work, family of 6 without support. Disability confirmed via medical documents. Aid successfully delivered.",    donated: 800,  need: 800  },
  { id: "C005", name: "Xalimo Osman",   age: 19, gender: "Female", location: "Mogadishu, Wadajir",  urgency: "Medium",   status: "Pending Verification", desc: "Young orphan with no family support, seeking education and shelter assistance. Recently displaced from previous living arrangement.",             donated: 0,    need: 400  },
  { id: "C006", name: "Bashir Nuur",    age: 52, gender: "Male",   location: "Garowe",              urgency: "High",     status: "Investigating",   desc: "Lost livelihood due to prolonged drought, has 8 dependents. Field team currently investigating and collecting evidence on site.",              donated: 0,    need: 700  },
  { id: "C007", name: "Hodan Ismail",   age: 39, gender: "Female", location: "Hargeisa",            urgency: "Critical", status: "Under Review",    desc: "Domestic violence survivor in need of emergency safe housing and counseling services. Case currently under verification office review.",      donated: 0,    need: 1100 },
  { id: "C008", name: "Mahad Jimcaale", age: 8,  gender: "Male",   location: "Baidoa",              urgency: "Critical", status: "Completed",       desc: "Orphan child with severe malnutrition, needed immediate nutrition support. Case successfully completed — full impact report available.",          donated: 1200, need: 1200 },
];

const STATUS_ICON = { "Pending Verification": "⏳", "Under Review": "🔍", "Investigating": "🕵️", "Verified": "✅", "Waiting Sponsor": "🤝", "Sponsored": "❤️", "Aid Delivered": "📦", "Completed": "🏁" };

export default function Cases() {
  const [search,      setSearch]      = useState("");
  const [urgFilter,   setUrgFilter]   = useState("All");
  const [statFilter,  setStatFilter]  = useState("All");
  const [view,        setView]        = useState("grid"); // grid | table

  const filtered = ALL_CASES.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
    const matchU = urgFilter  === "All" || c.urgency === urgFilter;
    const matchS = statFilter === "All" || c.status  === statFilter;
    return matchQ && matchU && matchS;
  });

  const sponsorable = ALL_CASES.filter(c => c.status === "Waiting Sponsor").length;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1A202C" }}>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.secondary} 100%)`, color: "#fff", padding: "64px 24px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 28 }}>
            <span style={{ background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.25)", borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700 }}>Active Cases Registry</span>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, margin: "16px 0 10px" }}>Cases Awaiting Support</h1>
            <p style={{ fontSize: 16, opacity: 0.85 }}>Browse verified humanitarian cases — every case is field-verified before appearing here.</p>
          </div>

          {/* Quick stats */}
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { icon: "📋", val: ALL_CASES.length, label: "Total Cases" },
              { icon: "🤝", val: sponsorable,       label: "Need Sponsor" },
              { icon: "✅", val: ALL_CASES.filter(c => c.status === "Completed").length, label: "Completed" },
              { icon: "💰", val: "$" + ALL_CASES.reduce((a, c) => a + c.donated, 0).toLocaleString(), label: "Aid Delivered" },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,.12)", borderRadius: 12, padding: "12px 20px", border: "1px solid rgba(255,255,255,.2)", textAlign: "center" }}>
                <div style={{ fontSize: 20, marginBottom: 2 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 900 }}>{s.val}</div>
                <div style={{ fontSize: 11, opacity: 0.75 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "20px 24px", position: "sticky", top: 68, zIndex: 90, boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search by name, location, ID…"
            style={{ flex: 1, minWidth: 200, padding: "10px 16px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "inherit" }} />

          <select value={urgFilter} onChange={e => setUrgFilter(e.target.value)}
            style={{ padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 13, fontWeight: 600, outline: "none", background: "#fff", fontFamily: "inherit" }}>
            <option value="All">All Urgency</option>
            {["Critical","High","Medium","Low"].map(u => <option key={u}>{u}</option>)}
          </select>

          <select value={statFilter} onChange={e => setStatFilter(e.target.value)}
            style={{ padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 13, fontWeight: 600, outline: "none", background: "#fff", fontFamily: "inherit" }}>
            <option value="All">All Status</option>
            {["Pending Verification","Under Review","Investigating","Verified","Waiting Sponsor","Sponsored","Aid Delivered","Completed"].map(s => <option key={s}>{s}</option>)}
          </select>

          <div style={{ display: "flex", gap: 4, background: C.bg, borderRadius: 10, padding: 4 }}>
            {[["grid","⊞"],["table","☰"]].map(([v, ico]) => (
              <button key={v} onClick={() => setView(v)}
                style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: view === v ? "#fff" : "transparent", fontWeight: 700, cursor: "pointer", fontSize: 14, boxShadow: view === v ? "0 1px 4px rgba(0,0,0,.1)" : "none" }}>
                {ico}
              </button>
            ))}
          </div>

          <span style={{ fontSize: 13, color: C.muted, fontWeight: 600, whiteSpace: "nowrap" }}>{filtered.length} cases found</span>
        </div>
      </section>

      {/* Cases */}
      <section style={{ padding: "32px 24px 80px", background: C.bg, minHeight: 500 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 18, color: C.muted }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>No cases match your filters</div>
            </div>
          ) : view === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 22 }}>
              {filtered.map(c => {
                const canSponsor = c.status === "Waiting Sponsor";
                const pct = c.need > 0 ? Math.round((c.donated / c.need) * 100) : 0;
                return (
                  <div key={c.id} style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 14px rgba(0,0,0,.07)", border: `1px solid ${C.border}`, transition: "transform .2s, box-shadow .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,.12)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 14px rgba(0,0,0,.07)"; }}>
                    {/* Top bar by urgency */}
                    <div style={{ height: 5, background: URGENCY[c.urgency] }} />
                    <div style={{ padding: 22 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>CASE {c.id}</div>
                          <div style={{ fontSize: 17, fontWeight: 800, marginTop: 2 }}>{c.name}</div>
                          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Age {c.age} · {c.gender} · 📍 {c.location}</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
                          <span style={{ background: URGENCY[c.urgency] + "20", color: URGENCY[c.urgency], border: `1px solid ${URGENCY[c.urgency]}30`, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{c.urgency}</span>
                          <span style={{ background: (STATUS_COLORS[c.status] || "#6B7280") + "15", color: STATUS_COLORS[c.status] || "#6B7280", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{STATUS_ICON[c.status]} {c.status}</span>
                        </div>
                      </div>

                      <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: "0 0 16px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.desc}</p>

                      {/* Progress bar */}
                      {c.need > 0 && (
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                            <span style={{ fontWeight: 600, color: C.muted }}>Funded</span>
                            <span style={{ fontWeight: 700, color: C.secondary }}>${c.donated.toLocaleString()} / ${c.need.toLocaleString()}</span>
                          </div>
                          <div style={{ height: 8, background: "#F3F4F6", borderRadius: 6, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: pct >= 100 ? C.secondary : C.accent, borderRadius: 6, transition: "width .4s" }} />
                          </div>
                          <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>{pct}% funded</div>
                        </div>
                      )}

                      <div style={{ display: "flex", gap: 8 }}>
                        <button style={{ flex: 1, padding: "9px", border: `1.5px solid ${C.primary}`, color: C.primary, borderRadius: 10, background: "transparent", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                          View Details
                        </button>
                        {canSponsor ? (
                          <Link to="/donate" style={{ flex: 1, textAlign: "center", padding: "9px", background: C.accent, color: "#fff", borderRadius: 10, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
                            ❤️ Sponsor
                          </Link>
                        ) : (
                          <span style={{ flex: 1, textAlign: "center", padding: "9px", background: "#F3F4F6", color: C.muted, borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
                            {c.status === "Completed" ? "🏁 Completed" : "🔄 In Progress"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table view */
            <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {["Case ID","Name","Age","Location","Urgency","Status","Funded","Action"].map(h => (
                      <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.muted, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr key={c.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                      <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: C.primary }}>{c.id}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>{c.gender}</div>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{c.age}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: C.muted }}>📍 {c.location}</td>
                      <td style={{ padding: "12px 16px" }}><span style={{ background: URGENCY[c.urgency] + "20", color: URGENCY[c.urgency], borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{c.urgency}</span></td>
                      <td style={{ padding: "12px 16px" }}><span style={{ background: (STATUS_COLORS[c.status]||"#6B7280") + "15", color: STATUS_COLORS[c.status]||"#6B7280", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{STATUS_ICON[c.status]} {c.status}</span></td>
                      <td style={{ padding: "12px 16px", fontSize: 12 }}>
                        <div style={{ fontWeight: 700, color: C.secondary }}>${c.donated}</div>
                        <div style={{ color: C.muted }}>of ${c.need}</div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {c.status === "Waiting Sponsor"
                          ? <Link to="/donate" style={{ padding: "7px 14px", background: C.accent, color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 700 }}>❤️ Sponsor</Link>
                          : <span style={{ padding: "7px 14px", background: "#F3F4F6", color: C.muted, borderRadius: 8, fontSize: 12, fontWeight: 600 }}>In Progress</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
