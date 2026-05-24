import { useState } from "react";

const C = { primary: "#0B3D91", secondary: "#1A6B3C", accent: "#E8A020", muted: "#6B7280", bg: "#F0F4F8", border: "#E2E8F0" };

export default function Contact() {
  const [tab,      setTab]      = useState("report"); // report | contact
  const [form,     setForm]     = useState({ name: "", age: "", gender: "Female", location: "", urgency: "Medium", desc: "", phone: "" });
  const [contact,  setContact]  = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted,setSubmitted]= useState(false);
  const [cSubmit,  setCSubmit]  = useState(false);

  const set  = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setC = (k, v) => setContact(c => ({ ...c, [k]: v }));

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1A202C" }}>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.secondary} 100%)`, color: "#fff", padding: "72px 24px 52px", textAlign: "center" }}>
        <div style={{ maxWidth: 660, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, margin: "0 0 14px" }}>Get In Touch</h1>
          <p style={{ fontSize: 17, opacity: 0.85, lineHeight: 1.7 }}>
            Report a case in your community, or reach out to our team. We respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Tab selector */}
      <section style={{ background: "#fff", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", display: "flex", gap: 4 }}>
          {[
            { id: "report",  label: "📝 Report a Case" },
            { id: "contact", label: "✉️ Contact Us"   },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: "16px 24px", fontSize: 15, fontWeight: 700, border: "none", background: "none", cursor: "pointer", color: tab === t.id ? C.primary : C.muted, borderBottom: tab === t.id ? `3px solid ${C.primary}` : "3px solid transparent", marginBottom: -1 }}>
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <section style={{ padding: "60px 24px 80px", background: C.bg }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 36, alignItems: "start" }}>

          {/* Left info panel */}
          <div>
            {tab === "report" ? (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 16px" }}>How Reporting Works</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { n: 1, icon: "📝", title: "Submit Report",   desc: "Fill in the case details, location, and urgency level." },
                    { n: 2, icon: "🏛️", title: "Office Reviews",  desc: "Verification office reviews within 24-48 hours." },
                    { n: 3, icon: "🔍", title: "Field Visit",     desc: "Field team visits and verifies the case on-site." },
                    { n: 4, icon: "❤️", title: "Aid Delivered",   desc: "If verified, case enters donor queue and aid is distributed." },
                  ].map(s => (
                    <div key={s.n} style={{ display: "flex", gap: 14, background: "#fff", borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.primary + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800 }}>Step {s.n}: {s.title}</div>
                        <div style={{ fontSize: 12, color: C.muted, marginTop: 3, lineHeight: 1.5 }}>{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: 12, padding: 16, marginTop: 20, fontSize: 13, color: "#92400E" }}>
                  ⚠️ <strong>Important:</strong> False reports are tracked and result in account suspension. Please only report genuine cases.
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 20px" }}>Contact Information</h3>
                {[
                  { icon: "📧", label: "Email",    val: "support@kafaale.so"    },
                  { icon: "📞", label: "Phone",    val: "+252 611 000 000"      },
                  { icon: "📍", label: "Address",  val: "Mogadishu, Somalia"    },
                  { icon: "🌐", label: "Website",  val: "kafaale.so"            },
                  { icon: "⏰", label: "Hours",    val: "Mon–Fri, 8am – 6pm EAT" },
                ].map(i => (
                  <div key={i.label} style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "flex-start" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: C.primary + "12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{i.icon}</div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.muted }}>{i.label.toUpperCase()}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{i.val}</div>
                    </div>
                  </div>
                ))}

                <div style={{ background: "#F0FDF4", border: "1px solid #A7F3D0", borderRadius: 14, padding: 20, marginTop: 24 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.secondary, marginBottom: 10 }}>For Donors & Partners</div>
                  <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
                    If you represent an NGO, government agency, or corporate partner interested in joining our platform, please email <strong>partners@kafaale.so</strong> or use the form.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div style={{ background: "#fff", borderRadius: 20, padding: 36, boxShadow: "0 4px 24px rgba(0,0,0,.08)" }}>
            {tab === "report" ? (
              submitted ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: C.secondary, margin: "0 0 10px" }}>Report Submitted!</h3>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
                    Your case has been submitted with status <strong>Pending Verification</strong>. Our verification team will review it within 24-48 hours. You'll be notified via SMS/email.
                  </p>
                  <div style={{ background: "#F0FDF4", borderRadius: 12, padding: 16, marginBottom: 24, textAlign: "left", fontSize: 13, lineHeight: 2 }}>
                    <div>🔖 Reference: <strong>#RPT-{Math.floor(Math.random()*90000)+10000}</strong></div>
                    <div>📅 Submitted: <strong>{new Date().toLocaleString()}</strong></div>
                    <div>📍 Location: <strong>{form.location}</strong></div>
                    <div>⚡ Urgency: <strong>{form.urgency}</strong></div>
                  </div>
                  <button onClick={() => { setSubmitted(false); setForm({ name:"", age:"", gender:"Female", location:"", urgency:"Medium", desc:"", phone:"" }); }}
                    style={{ padding: "12px 28px", background: C.primary, color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                    Submit Another Report
                  </button>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); if (!form.name || !form.location || !form.desc) return alert("Please fill required fields"); setSubmitted(true); }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 24px" }}>📝 Report a Case</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>Victim Full Name *</label>
                      <input required value={form.name} onChange={e => set("name", e.target.value)} placeholder="Full name"
                        style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>Age</label>
                      <input type="number" value={form.age} onChange={e => set("age", e.target.value)} placeholder="Age"
                        style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>Gender</label>
                      <select value={form.gender} onChange={e => set("gender", e.target.value)} style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: "none", background: "#fff", boxSizing: "border-box" }}>
                        <option>Female</option><option>Male</option><option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>Urgency Level</label>
                      <select value={form.urgency} onChange={e => set("urgency", e.target.value)} style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: "none", background: "#fff", boxSizing: "border-box" }}>
                        <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>Location *</label>
                    <input required value={form.location} onChange={e => set("location", e.target.value)} placeholder="City, District"
                      style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>Contact Phone</label>
                    <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+252..."
                      style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>Description *</label>
                    <textarea required value={form.desc} onChange={e => set("desc", e.target.value)} rows={4} placeholder="Describe the situation in detail — who needs help, why, and what kind of support is needed…"
                      style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
                  </div>
                  <button type="submit" style={{ width: "100%", marginTop: 20, padding: "14px", background: C.primary, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
                    Submit Report →
                  </button>
                </form>
              )
            ) : (
              cSubmit ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>📬</div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: C.primary, margin: "0 0 10px" }}>Message Sent!</h3>
                  <p style={{ fontSize: 14, color: C.muted, marginBottom: 24, lineHeight: 1.7 }}>We'll get back to you at <strong>{contact.email}</strong> within 24 hours.</p>
                  <button onClick={() => { setCSubmit(false); setContact({ name:"", email:"", subject:"", message:"" }); }}
                    style={{ padding: "12px 28px", background: C.primary, color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setCSubmit(true); }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 24px" }}>✉️ Send a Message</h3>
                  {[
                    { key: "name",    label: "Your Name *",       type: "text",  required: true  },
                    { key: "email",   label: "Email Address *",    type: "email", required: true  },
                    { key: "subject", label: "Subject *",          type: "text",  required: true  },
                  ].map(f => (
                    <div key={f.key} style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>{f.label}</label>
                      <input required={f.required} type={f.type} value={contact[f.key]} onChange={e => setC(f.key, e.target.value)}
                        style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                    </div>
                  ))}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>Message *</label>
                    <textarea required value={contact.message} onChange={e => setC("message", e.target.value)} rows={5}
                      style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
                  </div>
                  <button type="submit" style={{ width: "100%", padding: "14px", background: C.primary, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
                    Send Message →
                  </button>
                </form>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
