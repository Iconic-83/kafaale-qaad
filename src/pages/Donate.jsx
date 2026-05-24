import { useState } from "react";
import { Link } from "react-router-dom";

const C = { primary: "#0B3D91", secondary: "#1A6B3C", accent: "#E8A020", muted: "#6B7280", bg: "#F0F4F8", border: "#E2E8F0" };

const SPONSORABLE = [
  { id: "C001", name: "Amina Hassan",  age: 34, location: "Mogadishu, Hodan",    urgency: "Critical", need: 900,  desc: "Single mother of 4, lost home in flood. Field-verified displaced family." },
  { id: "C002", name: "Mohamud Ali",   age: 67, location: "Mogadishu, Bondhere", urgency: "High",     need: 600,  desc: "Elderly diabetic man — critically low on insulin. Medical records verified." },
  { id: "C005", name: "Xalimo Osman",  age: 19, location: "Mogadishu, Wadajir",  urgency: "Medium",   need: 400,  desc: "Young orphan seeking education support and safe shelter. Verified by field team." },
];

const PAYMENT_METHODS = ["💳 Stripe (Card)", "🅿️ PayPal", "🏦 Bank Transfer", "📱 Ama Gateway (EVC/Sahal)"];
const URGENCY = { Low: "#10B981", Medium: "#F59E0B", High: "#EF4444", Critical: "#7C3AED" };

export default function Donate() {
  const [selectedCase, setSelectedCase]   = useState(null);
  const [amount,       setAmount]         = useState("");
  const [method,       setMethod]         = useState("💳 Stripe (Card)");
  const [type,         setType]           = useState("Full Support");
  const [submitted,    setSubmitted]      = useState(false);

  const PRESETS = { "Full Support": selectedCase?.need || 800, "Partial Help": Math.round((selectedCase?.need || 800) / 2), "Custom": "" };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCase) return alert("Please select a case to sponsor.");
    if (!amount) return alert("Please enter an amount.");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', system-ui, sans-serif", background: C.bg, padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: 48, maxWidth: 520, width: "100%", textAlign: "center", boxShadow: "0 16px 48px rgba(0,0,0,.1)" }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: C.secondary, margin: "0 0 12px" }}>Sponsorship Confirmed!</h2>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
            Thank you for sponsoring <strong>{selectedCase?.name}</strong>. Your donation of <strong>${amount}</strong> via {method} has been recorded.
            <br /><br />You will receive a tax certificate and impact report once aid is delivered.
          </p>
          <div style={{ background: "#F0FDF4", border: "1px solid #A7F3D0", borderRadius: 14, padding: 20, marginBottom: 28, textAlign: "left", fontSize: 14, lineHeight: 2 }}>
            <div>📋 Case: <strong>{selectedCase?.id} — {selectedCase?.name}</strong></div>
            <div>💰 Amount: <strong>${amount}</strong></div>
            <div>💳 Method: <strong>{method}</strong></div>
            <div>🤝 Type: <strong>{type}</strong></div>
            <div>📅 Date: <strong>{new Date().toLocaleDateString()}</strong></div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => { setSubmitted(false); setSelectedCase(null); setAmount(""); }}
              style={{ flex: 1, padding: "12px", background: C.secondary, color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              ❤️ Sponsor Another Case
            </button>
            <Link to="/cases" style={{ flex: 1, textAlign: "center", padding: "12px", border: `1.5px solid ${C.primary}`, color: C.primary, borderRadius: 12, textDecoration: "none", fontSize: 14, fontWeight: 700 }}>
              Browse All Cases →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1A202C" }}>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, #EC4899 0%, ${C.primary} 100%)`, color: "#fff", padding: "72px 24px 52px", textAlign: "center" }}>
        <div style={{ maxWidth: 660, margin: "0 auto" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>❤️</div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, margin: "0 0 14px" }}>Sponsor a Case</h1>
          <p style={{ fontSize: 17, opacity: 0.85, lineHeight: 1.7 }}>
            Every case is field-verified before reaching you. Your donation is tracked end-to-end — from payment to proof of delivery.
          </p>
        </div>
      </section>

      <section style={{ padding: "60px 24px 80px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 36, alignItems: "start" }}>

          {/* Case selection */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 20px" }}>Select a Case to Sponsor</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {SPONSORABLE.map(c => (
                <div key={c.id} onClick={() => { setSelectedCase(c); setAmount(String(c.need)); }}
                  style={{ background: "#fff", borderRadius: 16, padding: 20, cursor: "pointer", border: `2px solid ${selectedCase?.id === c.id ? C.accent : C.border}`, boxShadow: selectedCase?.id === c.id ? `0 0 0 3px ${C.accent}25` : "0 2px 8px rgba(0,0,0,.04)", transition: "all .2s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>{c.id}</div>
                      <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Age {c.age} · 📍 {c.location}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                      <span style={{ background: URGENCY[c.urgency] + "20", color: URGENCY[c.urgency], borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{c.urgency}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: C.secondary }}>${c.need}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: C.muted, margin: "10px 0 0", lineHeight: 1.5 }}>{c.desc}</p>
                  {selectedCase?.id === c.id && (
                    <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, color: C.accent, fontSize: 13, fontWeight: 700 }}>
                      ✅ Selected
                    </div>
                  )}
                </div>
              ))}
              <Link to="/cases" style={{ textAlign: "center", padding: "12px", border: `1.5px dashed ${C.border}`, borderRadius: 14, color: C.muted, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
                + Browse more cases →
              </Link>
            </div>
          </div>

          {/* Donation form */}
          <div style={{ background: "#fff", borderRadius: 20, padding: 36, boxShadow: "0 4px 24px rgba(0,0,0,.08)" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>Sponsorship Details</h2>
            {selectedCase && (
              <div style={{ background: "#F0FDF4", border: "1px solid #A7F3D0", borderRadius: 12, padding: 14, marginBottom: 24, fontSize: 13, color: C.secondary }}>
                Sponsoring: <strong>{selectedCase.name}</strong> — {selectedCase.location}
              </div>
            )}
            {!selectedCase && (
              <div style={{ background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: 12, padding: 14, marginBottom: 24, fontSize: 13, color: "#92400E" }}>
                👈 Please select a case first
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Sponsorship type */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 10 }}>Sponsorship Type</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Full Support","Partial Help","Custom"].map(t => (
                    <button type="button" key={t} onClick={() => { setType(t); if (t !== "Custom") setAmount(String(PRESETS[t])); else setAmount(""); }}
                      style={{ padding: "9px 18px", border: `2px solid ${type === t ? C.primary : C.border}`, borderRadius: 10, background: type === t ? C.primary + "10" : "#fff", color: type === t ? C.primary : "#374151", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      {t}
                      {t !== "Custom" && selectedCase && <span style={{ marginLeft: 4, opacity: 0.7 }}>(${PRESETS[t]})</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 8 }}>Amount (USD) *</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, fontWeight: 700, color: C.muted }}>$</span>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} min="1" required
                    style={{ width: "100%", padding: "12px 14px 12px 32px", border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 18, fontWeight: 700, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                </div>
              </div>

              {/* Route */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 8 }}>Sponsorship Route</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { val: "direct", label: "🎯 Direct",       desc: "Goes directly to beneficiary" },
                    { val: "office", label: "🏛️ Office Managed", desc: "Distributed with full proof (Recommended)" },
                  ].map(r => (
                    <div key={r.val} style={{ padding: 14, border: `1.5px solid ${C.border}`, borderRadius: 12, background: "#FAFAFA", cursor: "pointer" }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{r.label}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{r.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment method */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 10 }}>Payment Method</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {PAYMENT_METHODS.map(m => (
                    <button type="button" key={m} onClick={() => setMethod(m)}
                      style={{ padding: "10px 12px", border: `2px solid ${method === m ? C.primary : C.border}`, borderRadius: 10, background: method === m ? C.primary + "10" : "#fff", color: method === m ? C.primary : "#374151", fontSize: 12, fontWeight: 700, cursor: "pointer", textAlign: "left" }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Security notes */}
              <div style={{ background: "#F0FDF4", border: "1px solid #A7F3D0", borderRadius: 12, padding: 14, marginBottom: 24, fontSize: 12, color: C.secondary, lineHeight: 1.7 }}>
                🔐 <strong>Your payment is secure.</strong> PCI DSS Level 1 · AES-256 Encryption · All transactions audited
              </div>

              <button type="submit" style={{ width: "100%", padding: "16px", background: C.accent, color: "#fff", border: "none", borderRadius: 14, fontSize: 17, fontWeight: 800, cursor: "pointer", boxShadow: `0 6px 20px ${C.accent}50` }}>
                ❤️ Confirm Sponsorship {amount ? `— $${amount}` : ""}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section style={{ padding: "60px 24px", background: "#fff", textAlign: "center" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 32 }}>Why Donors Trust Kafaale Qaad</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {[
              { icon: "✅", title: "Verified Cases",    desc: "Every case is field-investigated before you see it" },
              { icon: "📸", title: "Proof of Delivery", desc: "Photo + GPS confirmation when aid is delivered" },
              { icon: "📊", title: "Full Transparency",  desc: "Complete transaction history & impact reports" },
              { icon: "🔐", title: "Secure Payments",   desc: "PCI DSS Level 1 · Stripe & PayPal certified" },
            ].map((t, i) => (
              <div key={i} style={{ padding: 24, borderRadius: 16, background: C.bg, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{t.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>{t.title}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
