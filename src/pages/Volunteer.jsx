import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "../context/LanguageContext.jsx";
import { useResponsive } from "../hooks/useResponsive.js";

const C = {
  navy:"#002651", primary:"#004B96", secondary:"#4B7D19",
  gold:"#E0AB21", muted:"#5A6E8A", bg:"#F4F7FC",
  border:"#D8E4F0", text:"#0D1F3C",
};

const ROLES = [
  { icon:"📝", title:"Community Reporter", color:"#3B82F6", bg:"#EFF6FF",
    desc:"Submit cases from your community. No experience needed — just a smartphone and the willingness to help.",
    skills:["Smartphone & basic internet","Knowledge of your local area","Willingness to document cases"],
    commitment:"Flexible — report when you see need",
  },
  { icon:"🗺️", title:"Field Verification Agent", color:"#F59E0B", bg:"#FFFBEB",
    desc:"Visit reported cases, verify facts on the ground, collect GPS-tagged photo evidence, and upload field reports.",
    skills:["Transportation to case locations","GPS documentation skills","Interview and reporting ability"],
    commitment:"Part-time or full-time, paid role",
  },
  { icon:"🏥", title:"Medical Liaison", color:"#EF4444", bg:"#FEF2F2",
    desc:"Help medical cases navigate the healthcare system. Connect patients with clinics, verify medical needs.",
    skills:["Medical or healthcare background","Clinic connections in your region","Case coordination experience"],
    commitment:"On-call as medical cases arise",
  },
  { icon:"🎓", title:"Education Support", color:"#8B5CF6", bg:"#F5F3FF",
    desc:"Help children access schooling — verify enrollment, liaise with schools, follow up on education cases.",
    skills:["Connection to local schools","Child welfare experience","Follow-up and documentation"],
    commitment:"Flexible, school term aligned",
  },
  { icon:"💻", title:"Platform Translator", color:"#10B981", bg:"#ECFDF5",
    desc:"Help translate case descriptions and platform content into Somali, Arabic, Turkish, or other languages.",
    skills:["Fluency in Somali, Arabic, Turkish, or other language","Written communication skills"],
    commitment:"Remote, flexible hours",
  },
  { icon:"🤝", title:"Community Coordinator", color:"#06B6D4", bg:"#ECFEFF",
    desc:"Coordinate a network of reporters and agents in your district. Act as the local point of contact.",
    skills:["Community leadership experience","Network of trusted contacts","Organizational ability"],
    commitment:"Regular weekly commitment",
  },
];

const STEPS = [
  { n:1, icon:"📋", label:"Fill the application below", desc:"Tell us your location, skills, and which role fits you best." },
  { n:2, icon:"📞", label:"We contact you within 3 days",  desc:"Our team reviews applications and schedules a brief phone/video call." },
  { n:3, icon:"✅", label:"Onboarding & training",         desc:"Short training session, access to the platform, and your first assignment." },
  { n:4, icon:"🌍", label:"Start making impact",           desc:"Begin reporting or verifying cases, and watch the difference you make." },
];

export default function Volunteer() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const { isMobile, isTablet } = useResponsive();
  const [form, setForm] = useState({ name:"", email:"", phone:"", location:"", role:"", message:"" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]:v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) return;
    setSubmitting(true);
    // Opens mailto as a reliable fallback
    const subject = encodeURIComponent(`Volunteer Application — ${form.role}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nLocation: ${form.location}\nRole: ${form.role}\n\nMessage:\n${form.message}`
    );
    window.open(`mailto:volunteers@kafaale.so?subject=${subject}&body=${body}`, "_blank");
    setTimeout(() => { setSubmitting(false); setDone(true); }, 800);
  };

  const wrap = { maxWidth:1100, margin:"0 auto", padding: isMobile?"0 16px":"0 32px" };
  const sec  = (bg) => ({ background:bg, padding: isMobile?"48px 0":"72px 0" });
  const inp  = { width:"100%", padding:"11px 14px", borderRadius:9, border:`1px solid ${C.border}`, fontSize:14, boxSizing:"border-box", fontFamily:"inherit", outline:"none" };
  const F    = ({ label, children, required }) => (
    <div style={{ marginBottom:18 }}>
      <label style={{ display:"block", fontSize:12, fontWeight:700, color:C.muted, marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>
        {label}{required && <span style={{color:"#EF4444"}}> *</span>}
      </label>
      {children}
    </div>
  );

  return (
    <>
      {/* Hero */}
      <section style={{ background:`linear-gradient(135deg,${C.navy} 0%,${C.primary} 55%,${C.secondary} 100%)`, color:"#fff", padding: isMobile?"60px 16px 48px":"100px 32px 72px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:280, height:280, borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }} />
        <div style={{ position:"relative", maxWidth:700, margin:"0 auto" }}>
          <span style={{ background:"rgba(255,255,255,0.15)", borderRadius:100, padding:"6px 18px", fontSize:12, fontWeight:800, letterSpacing:1.5, textTransform:"uppercase" }}>
            {lang==="so"?"Ku Biir Kooxda":lang==="ar"?"انضم إلى الفريق":lang==="tr"?"Ekibe Katıl":lang==="es"?"Únete al Equipo":lang==="fr"?"Rejoignez l'Équipe":"Join The Team"}
          </span>
          <h1 style={{ fontSize:"clamp(28px,5vw,56px)", fontWeight:900, margin:"20px 0 18px", lineHeight:1.1, letterSpacing:-1 }}>
            {lang==="so"?"Noqo Farqiga Dhabta ah":"Be the Real Difference"}
          </h1>
          <p style={{ fontSize:"clamp(14px,2vw,18px)", opacity:0.85, lineHeight:1.7, marginBottom:32, maxWidth:560, margin:"0 auto 32px" }}>
            {lang==="so"?"Waxaad u baahan tahay xiriir iyo telefoon kaliya si aad noqoto qayb ka mid ah nidaamka gargaarka Somalia.":"All it takes is a connection and a phone to become part of Somalia's aid verification network."}
          </p>
          <button onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior:"smooth" })}
            style={{ padding:"15px 36px", background:C.gold, color:"#fff", border:"none", borderRadius:12, fontSize:16, fontWeight:800, cursor:"pointer" }}>
            Apply Now →
          </button>
        </div>
      </section>

      {/* How it works */}
      <section style={sec("#fff")}>
        <div style={wrap}>
          <div style={{ textAlign:"center", marginBottom: isMobile?40:56 }}>
            <h2 style={{ fontSize:"clamp(22px,3vw,36px)", fontWeight:900, margin:"0 0 12px" }}>How Volunteering Works</h2>
            <p style={{ fontSize:15, color:C.muted }}>From application to first impact — four simple steps.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":"repeat(4,1fr)", gap: isMobile?16:24 }}>
            {STEPS.map(s => (
              <div key={s.n} style={{ textAlign:"center", padding: isMobile?16:24 }}>
                <div style={{ width:56, height:56, borderRadius:"50%", background:C.primary, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, margin:"0 auto 14px", boxShadow:`0 4px 16px ${C.primary}40` }}>
                  {s.icon}
                </div>
                <div style={{ fontSize:11, fontWeight:800, color:C.muted, letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Step {s.n}</div>
                <div style={{ fontSize:15, fontWeight:800, color:C.text, marginBottom:8 }}>{s.label}</div>
                <div style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles grid */}
      <section style={sec(C.bg)}>
        <div style={wrap}>
          <div style={{ textAlign:"center", marginBottom: isMobile?40:56 }}>
            <h2 style={{ fontSize:"clamp(22px,3vw,36px)", fontWeight:900, margin:"0 0 12px" }}>Choose Your Role</h2>
            <p style={{ fontSize:15, color:C.muted }}>Find the role that matches your skills, location, and availability.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr": isTablet?"1fr 1fr":"repeat(3,1fr)", gap: isMobile?16:22 }}>
            {ROLES.map(r => (
              <div key={r.title} style={{ background:"#fff", borderRadius:18, padding: isMobile?20:26, border:`1px solid ${C.border}`, boxShadow:"0 2px 10px rgba(0,38,81,0.05)" }}>
                <div style={{ width:52, height:52, borderRadius:14, background:r.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:16, boxShadow:`0 4px 12px ${r.color}22` }}>
                  {r.icon}
                </div>
                <div style={{ fontSize:16, fontWeight:800, color:r.color, marginBottom:8 }}>{r.title}</div>
                <p style={{ fontSize:13, color:C.muted, lineHeight:1.6, marginBottom:14 }}>{r.desc}</p>
                <div style={{ marginBottom:14 }}>
                  {r.skills.map((s, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:7, marginBottom:5 }}>
                      <span style={{ color:r.color, fontSize:12, marginTop:2 }}>✓</span>
                      <span style={{ fontSize:12, color:C.muted }}>{s}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background:r.bg, borderRadius:8, padding:"7px 12px", fontSize:11, fontWeight:700, color:r.color }}>
                  ⏱ {r.commitment}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" style={sec("#fff")}>
        <div style={{ ...wrap, maxWidth:680 }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <h2 style={{ fontSize:"clamp(22px,3vw,36px)", fontWeight:900, margin:"0 0 12px" }}>Apply to Volunteer</h2>
            <p style={{ fontSize:15, color:C.muted }}>Fill in the form below and we'll get back to you within 3 working days.</p>
          </div>
          {done ? (
            <div style={{ background:"#ECFDF5", border:"1px solid #86EFAC", borderRadius:16, padding:32, textAlign:"center" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🎉</div>
              <div style={{ fontSize:20, fontWeight:800, color:C.secondary, marginBottom:8 }}>Application Sent!</div>
              <div style={{ fontSize:15, color:C.muted, marginBottom:24 }}>Thank you for stepping up. Our team will contact you within 3 days.</div>
              <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
                <Link to="/how-it-works" style={{ padding:"11px 24px", background:C.primary, color:"#fff", borderRadius:10, fontWeight:700, fontSize:14, textDecoration:"none" }}>Learn How It Works</Link>
                <Link to="/cases" style={{ padding:"11px 24px", background:"none", border:`1.5px solid ${C.primary}`, color:C.primary, borderRadius:10, fontWeight:600, fontSize:14, textDecoration:"none" }}>Browse Cases</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background:C.bg, borderRadius:18, padding: isMobile?20:36, border:`1px solid ${C.border}` }}>
              <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":"1fr 1fr", gap:16 }}>
                <F label="Full Name" required><input style={inp} value={form.name} onChange={e=>set("name",e.target.value)} required placeholder="Your full name" /></F>
                <F label="Email Address" required><input style={inp} type="email" value={form.email} onChange={e=>set("email",e.target.value)} required placeholder="your@email.com" /></F>
                <F label="Phone Number"><input style={inp} type="tel" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="+252..." /></F>
                <F label="Your Location / City" required><input style={inp} value={form.location} onChange={e=>set("location",e.target.value)} required placeholder="Mogadishu, Baidoa…" /></F>
              </div>
              <F label="Role Applying For" required>
                <select style={inp} value={form.role} onChange={e=>set("role",e.target.value)} required>
                  <option value="">Select a role…</option>
                  {ROLES.map(r => <option key={r.title} value={r.title}>{r.icon} {r.title}</option>)}
                </select>
              </F>
              <F label="Tell us about yourself">
                <textarea style={{...inp, resize:"vertical"}} rows={4} value={form.message} onChange={e=>set("message",e.target.value)}
                  placeholder="Your experience, motivation, and availability…" />
              </F>
              <button type="submit" disabled={submitting || !form.name || !form.email || !form.role}
                style={{ width:"100%", padding:"14px", background: submitting?"#9CA3AF":C.primary, color:"#fff", border:"none", borderRadius:11, fontSize:15, fontWeight:800, cursor:submitting?"not-allowed":"pointer" }}>
                {submitting ? "Sending…" : "📩 Submit Application"}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
