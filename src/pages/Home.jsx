import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { impact } from "../api/client";

const C = { primary: "#0B3D91", secondary: "#1A6B3C", accent: "#E8A020", danger: "#EF4444", muted: "#6B7280", bg: "#F0F4F8", border: "#E2E8F0" };

const WORKFLOW = [
  { n: 1, icon: "📝", label: "Report Creation",     desc: "Reporter submits a case with details, photos and location",          color: "#3B82F6" },
  { n: 2, icon: "🏛️", label: "Verification Office", desc: "Officers review the report and assign a field team",                 color: "#8B5CF6" },
  { n: 3, icon: "🔍", label: "Field Investigation", desc: "Field agents visit, verify and document with GPS + photo proof",     color: "#F59E0B" },
  { n: 4, icon: "✅", label: "Verified",             desc: "Case confirmed and made visible to donors for sponsorship",          color: "#10B981" },
  { n: 5, icon: "👥", label: "Donor Queue",          desc: "Case enters the donor pool — sponsors can browse and select",       color: "#EC4899" },
  { n: 6, icon: "❤️", label: "Sponsorship",          desc: "Donor sponsors the case and payment is securely processed",         color: "#EF4444" },
  { n: 7, icon: "📦", label: "Aid Delivery",         desc: "Field team delivers aid and uploads proof of delivery",             color: "#06B6D4" },
  { n: 8, icon: "🏁", label: "Completed",            desc: "Case archived with impact report — full audit trail preserved",     color: "#6B7280" },
];

const STATS = [
  { val: "2,400+", label: "Cases Processed",    icon: "📋", color: C.primary   },
  { val: "$1.2M",  label: "Aid Distributed",    icon: "💰", color: C.secondary },
  { val: "98.8%",  label: "Verification Rate",  icon: "✅", color: "#10B981"   },
  { val: "6",      label: "Cities Covered",     icon: "📍", color: C.accent    },
];

const ROLES = [
  { icon: "👁️", role: "Observer / Reporter", color: "#3B82F6", bg: "#DBEAFE", desc: "Submit case reports for vulnerable people in your area. Take photos, add GPS location, and track your submissions in real time." },
  { icon: "🏛️", role: "Verification Office", color: "#8B5CF6", bg: "#EDE9FE", desc: "Review incoming reports, verify their legitimacy, assign field investigation teams, and manage the case workflow." },
  { icon: "🗺️", role: "Field Team",          color: "#F59E0B", bg: "#FEF3C7", desc: "Receive assignments on your phone, navigate to locations via GPS, collect evidence, and upload verified findings." },
  { icon: "❤️", role: "Donor / Sponsor",     color: "#EC4899", bg: "#FCE7F3", desc: "Browse verified cases, choose who to sponsor, make secure payments, and track exactly how your donation is delivered." },
  { icon: "🛡️", role: "Super Admin",         color: C.danger,  bg: "#FEE2E2", desc: "Full platform control — manage all users, monitor case pipeline, view financial analytics, and detect fraud in real time." },
];

const FEATURES = [
  { icon: "🔐", title: "Multi-Layer Security",      desc: "OTP login, face verification, ID verification, and AES-256 encryption protect every account." },
  { icon: "💰", title: "Secure Payments",           desc: "Stripe, PayPal, Bank Transfer & Ama Gateway — all transactions encrypted and PCI DSS Level 1." },
  { icon: "🗺️", title: "GPS Field Tracking",       desc: "Real-time GPS navigation for field teams with geofencing to verify on-site presence." },
  { icon: "📊", title: "Real-Time Analytics",       desc: "Live dashboards for every role — case pipeline, team performance, donation trends and KPIs." },
  { icon: "🤖", title: "AI Fraud Detection",        desc: "Anomaly detection engine flags duplicate cases, suspicious patterns and payment irregularities." },
  { icon: "📱", title: "Mobile App (React Native)", desc: "Offline-capable mobile app for field teams — works without internet and syncs on reconnect." },
  { icon: "📋", title: "Full Audit Trail",          desc: "Every action is logged — immutable audit trail with timestamps, user IDs and transaction hashes." },
  { icon: "🌍", title: "Multi-Language",            desc: "Full Somali and English support throughout the platform for all user roles." },
];

const FEATURED_CASES = [
  { id: "C002", name: "Mohamud Ali",    age: 67, location: "Mogadishu, Bondhere", urgency: "High",     desc: "Elderly man with chronic illness needs medication and food support. Medical records verified.",   color: "#EF4444", bg: "#FEF2F2" },
  { id: "C001", name: "Amina Hassan",  age: 34, location: "Mogadishu, Hodan",    urgency: "Critical", desc: "Single mother of 4 lost her home in flooding. Family confirmed displaced in makeshift shelter.", color: "#7C3AED", bg: "#F5F3FF" },
  { id: "C005", name: "Xalimo Osman",  age: 19, location: "Mogadishu, Wadajir",  urgency: "Medium",   desc: "Young orphan with no family support seeking education assistance and safe shelter.",              color: "#F59E0B", bg: "#FFFBEB" },
];

const URGENCY_COLOR = { Low: "#10B981", Medium: "#F59E0B", High: "#EF4444", Critical: "#7C3AED" };

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1A202C" }}>

      {/* ── HERO ── */}
      <section style={{ background: `linear-gradient(135deg, ${C.primary} 0%, #1e40af 40%, ${C.secondary} 100%)`, color: "#fff", padding: "100px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 24, border: "1px solid rgba(255,255,255,0.25)" }}>
            🌍 Qaabka Isku Xirka System-ka · Humanitarian Aid Platform
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, margin: "0 0 20px", lineHeight: 1.1, letterSpacing: -1 }}>
            Transparent Aid,<br />
            <span style={{ color: C.accent }}>From Report to Delivery</span>
          </h1>
          <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", opacity: 0.85, maxWidth: 680, margin: "0 auto 40px", lineHeight: 1.7 }}>
            KAFAALE QAAD is a comprehensive humanitarian aid platform that bridges the gap between vulnerable communities, field investigators, donors, and aid distributors — with full transparency and fraud protection.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/cases")}
              style={{ padding: "16px 36px", background: C.accent, color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 24px rgba(232,160,32,.4)" }}>
              ❤️ Sponsor a Case
            </button>
            <button onClick={() => navigate("/how-it-works")}
              style={{ padding: "16px 36px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "2px solid rgba(255,255,255,0.4)", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              How It Works →
            </button>
          </div>

          {/* Tech badges */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 40, opacity: 0.7 }}>
            {["React + Next.js", "Node.js / NestJS", "PostgreSQL", "AWS Cloud", "Stripe + PayPal", "Google Maps API"].map(t => (
              <span key={t} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: "#fff", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ padding: "36px 24px", textAlign: "center", borderRight: i < 3 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 14, color: C.muted, fontWeight: 500, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS (PREVIEW) ── */}
      <section style={{ padding: "80px 24px", background: C.bg }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ background: C.primary + "15", color: C.primary, borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 700 }}>8-Step Verified Workflow</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, margin: "16px 0 12px" }}>How Kafaale Qaad Works</h2>
            <p style={{ fontSize: 17, color: C.muted, maxWidth: 560, margin: "0 auto" }}>Every case follows a strict, transparent pipeline — from first report to verified delivery.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {WORKFLOW.map((s, i) => (
              <div key={s.n} style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,.06)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: s.color }} />
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: s.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{s.icon}</div>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: s.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>{s.n}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: s.color, marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.desc}</div>
                {i < WORKFLOW.length - 1 && (
                  <div style={{ position: "absolute", top: "50%", right: -12, transform: "translateY(-50%)", fontSize: 18, color: C.border, zIndex: 1 }}>→</div>
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <Link to="/how-it-works" style={{ display: "inline-block", padding: "12px 32px", background: C.primary, color: "#fff", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 15 }}>
              See Full Workflow Details →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED CASES ── */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
            <div>
              <span style={{ background: "#FCE7F3", color: "#DB2777", borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 700 }}>💝 Awaiting Your Support</span>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, margin: "14px 0 8px" }}>Cases Needing Sponsors</h2>
              <p style={{ fontSize: 16, color: C.muted }}>Verified cases ready for sponsorship — every dollar tracked end-to-end.</p>
            </div>
            <Link to="/cases" style={{ padding: "12px 24px", border: `2px solid ${C.primary}`, color: C.primary, borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>
              View All Cases →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {FEATURED_CASES.map(c => (
              <div key={c.id} style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,.08)", border: `1px solid ${C.border}`, transition: "transform .2s, box-shadow .2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.08)"; }}>
                <div style={{ height: 6, background: URGENCY_COLOR[c.urgency] }} />
                <div style={{ padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>CASE {c.id}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>{c.name}</div>
                      <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Age {c.age} · 📍 {c.location}</div>
                    </div>
                    <span style={{ background: URGENCY_COLOR[c.urgency] + "20", color: URGENCY_COLOR[c.urgency], border: `1px solid ${URGENCY_COLOR[c.urgency]}40`, borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                      {c.urgency}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: "0 0 20px" }}>{c.desc}</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <Link to={`/cases`} style={{ flex: 1, textAlign: "center", padding: "10px", border: `1.5px solid ${C.primary}`, color: C.primary, borderRadius: 10, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>View Details</Link>
                    <Link to="/donate" style={{ flex: 1, textAlign: "center", padding: "10px", background: C.accent, color: "#fff", borderRadius: 10, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>❤️ Sponsor</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── USER ROLES ── */}
      <section style={{ padding: "80px 24px", background: C.bg }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ background: C.secondary + "20", color: C.secondary, borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 700 }}>5 Dedicated Roles</span>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, margin: "14px 0 10px" }}>Who Uses Kafaale Qaad?</h2>
            <p style={{ fontSize: 16, color: C.muted }}>Every role has a tailored dashboard and workflow access.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 18 }}>
            {ROLES.map(r => (
              <div key={r.role} style={{ background: "#fff", borderRadius: 16, padding: 24, textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,.05)", border: `1px solid ${C.border}` }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: r.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>{r.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: r.color, marginBottom: 10 }}>{r.role}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ background: "#EDE9FE", color: "#7C3AED", borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 700 }}>Platform Capabilities</span>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, margin: "14px 0 10px" }}>Everything You Need</h2>
            <p style={{ fontSize: 16, color: C.muted }}>Built for security, scale, and real humanitarian impact.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ padding: 24, borderRadius: 16, border: `1px solid ${C.border}`, background: "#FAFAFA" }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.secondary} 100%)`, padding: "80px 24px", textAlign: "center", color: "#fff" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 52, marginBottom: 20 }}>🤝</div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, margin: "0 0 16px" }}>Ready to Make a Difference?</h2>
          <p style={{ fontSize: 18, opacity: 0.85, marginBottom: 40, lineHeight: 1.6 }}>
            Whether you want to report a case, sponsor a family, or join our field team — every role matters.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/donate")}
              style={{ padding: "16px 36px", background: C.accent, color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: "pointer" }}>
              ❤️ Become a Donor
            </button>
            <button onClick={() => navigate("/contact")}
              style={{ padding: "16px 36px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "2px solid rgba(255,255,255,.4)", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              Report a Case →
            </button>
            <button onClick={() => navigate("/dashboard")}
              style={{ padding: "16px 36px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "2px solid rgba(255,255,255,.4)", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              Access Dashboard →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
