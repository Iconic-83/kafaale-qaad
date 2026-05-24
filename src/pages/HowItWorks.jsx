import { Link } from "react-router-dom";

const C = { primary: "#0B3D91", secondary: "#1A6B3C", accent: "#E8A020", muted: "#6B7280", bg: "#F0F4F8", border: "#E2E8F0" };

const STEPS = [
  {
    n: 1, icon: "📝", label: "Report Creation", status: "Pending Verification", color: "#3B82F6",
    who: "Observer / Reporter",
    detail: "A reporter (community member or NGO worker) submits a case through the web or mobile app. They fill in the beneficiary's name, age, location, urgency level, a description of the situation, and upload photos.",
    actions: ["Fill in beneficiary details", "Upload supporting photos", "Set urgency level", "Submit — case status: Pending Verification"],
  },
  {
    n: 2, icon: "🏛️", label: "Verification Office", status: "Under Review", color: "#8B5CF6",
    who: "Verification Officer",
    detail: "A verification officer reviews the submitted report for completeness and legitimacy. They check for duplicate cases, review photos, and decide whether to approve or reject the case.",
    actions: ["Review report details and photos", "Check for duplicates (AI-assisted)", "Approve → assign a field team", "Reject → archive with reason"],
  },
  {
    n: 3, icon: "🔍", label: "Field Investigation", status: "Investigating", color: "#F59E0B",
    who: "Field Team Member",
    detail: "An assigned field team member travels to the location using GPS navigation. They physically verify the situation, interview the beneficiary, take photos/videos as proof, and log their findings.",
    actions: ["Receive mission on mobile app", "Navigate to location via GPS", "Conduct investigation + take photos", "Upload findings — 90% image compression for low bandwidth"],
  },
  {
    n: 4, icon: "✅", label: "Verified", status: "Verified", color: "#10B981",
    who: "Verification Officer",
    detail: "After the field team submits their findings, the verification officer reviews the evidence. If confirmed legitimate, the case is marked Verified and enters the donor pool.",
    actions: ["Review field findings and photos", "Confirm GPS coordinates match", "Mark case as Verified", "Case becomes visible to donors"],
  },
  {
    n: 5, icon: "👥", label: "Donor Queue", status: "Waiting Sponsor", color: "#EC4899",
    who: "Donor / Sponsor",
    detail: "Verified cases appear in the donor dashboard. Donors can browse by urgency, location, age, or type of need. Full case details, investigation findings, and photos are available for review.",
    actions: ["Browse verified cases in donor dashboard", "Filter by urgency, location, type", "View full case details + evidence", "Choose sponsorship type"],
  },
  {
    n: 6, icon: "❤️", label: "Sponsorship", status: "Sponsored", color: "#EF4444",
    who: "Donor / Sponsor",
    detail: "The donor selects a case and makes a secure payment via Stripe, PayPal, Bank Transfer, or Ama Gateway. They choose between direct sponsorship or office-managed distribution.",
    actions: ["Select case to sponsor", "Choose sponsorship type (Full / Partial)", "Make secure payment (Stripe/PayPal/Bank)", "Receive confirmation + tax certificate"],
  },
  {
    n: 7, icon: "📦", label: "Aid Delivery", status: "Aid Delivered", color: "#06B6D4",
    who: "Field Team / Aid Distribution",
    detail: "The field team or aid distribution team delivers the aid to the beneficiary. They upload proof of delivery — photos at the location, GPS coordinates, and the beneficiary's signature or confirmation.",
    actions: ["Receive delivery assignment", "Navigate to beneficiary location", "Deliver aid + take proof photos", "Upload GPS-tagged delivery confirmation"],
  },
  {
    n: 8, icon: "🏁", label: "Completed", status: "Completed", color: "#6B7280",
    who: "System / Admin",
    detail: "The case is marked complete. An impact report is automatically generated showing the full journey — from submission to delivery. The donor receives a final impact report. The case is archived in the immutable audit trail.",
    actions: ["Auto-generate impact report", "Notify donor with final proof", "Archive case with full audit trail", "Analytics updated in real time"],
  },
];

const ROLES_FLOW = [
  { icon: "👁️", role: "Reporter",     color: "#3B82F6", steps: [1],    desc: "Submits the case, tracks its progress" },
  { icon: "🏛️", role: "Verifier",     color: "#8B5CF6", steps: [2, 4], desc: "Approves/rejects, assigns teams, releases to donors" },
  { icon: "🗺️", role: "Field Team",   color: "#F59E0B", steps: [3, 7], desc: "Investigates on-site, delivers aid" },
  { icon: "❤️", role: "Donor",        color: "#EC4899", steps: [5, 6], desc: "Browses verified cases, makes payments" },
  { icon: "🛡️", role: "Admin",        color: "#EF4444", steps: [8],    desc: "Oversees everything, monitors fraud, generates reports" },
];

export default function HowItWorks() {
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1A202C" }}>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.secondary} 100%)`, color: "#fff", padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <span style={{ background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.25)", borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700 }}>8-Step Verified Workflow</span>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, margin: "20px 0 16px" }}>How Kafaale Qaad Works</h1>
          <p style={{ fontSize: 18, opacity: 0.85, lineHeight: 1.7 }}>
            Every case follows a strict, multi-party verified pipeline. No step can be skipped, no actor can bypass the system.
          </p>
        </div>
      </section>

      {/* Pipeline Overview */}
      <section style={{ padding: "60px 24px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", overflowX: "auto", paddingBottom: 8 }}>
            {STEPS.map((s, i) => (
              <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: s.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto", boxShadow: `0 4px 12px ${s.color}50` }}>{s.icon}</div>
                  <div style={{ fontSize: 10, marginTop: 6, fontWeight: 700, color: s.color, maxWidth: 70, lineHeight: 1.3 }}>{s.label}</div>
                </div>
                {i < STEPS.length - 1 && <div style={{ width: 32, height: 2, background: `linear-gradient(90deg, ${s.color}, ${STEPS[i+1].color})`, flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Steps */}
      <section style={{ padding: "20px 24px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ display: "flex", gap: 32, marginBottom: 48, alignItems: "flex-start" }}>
              {/* Step indicator */}
              <div style={{ flexShrink: 0, textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${s.color}, ${s.color}bb)`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: `0 6px 20px ${s.color}40` }}>{s.icon}</div>
                {i < STEPS.length - 1 && <div style={{ width: 2, height: 40, background: s.color + "30", margin: "8px auto 0" }} />}
              </div>

              {/* Content */}
              <div style={{ flex: 1, background: "#FAFAFA", borderRadius: 18, padding: 28, border: `1px solid ${C.border}`, borderLeft: `4px solid ${s.color}` }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: s.color, background: s.color + "15", border: `1px solid ${s.color}30`, borderRadius: 20, padding: "3px 10px" }}>STEP {s.n}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#1A202C" }}>{s.label}</div>
                  <div style={{ marginLeft: "auto", background: "#F3F4F6", borderRadius: 20, padding: "4px 12px", fontSize: 12, color: C.muted, fontWeight: 600 }}>🙋 {s.who}</div>
                </div>
                <div style={{ display: "inline-block", background: s.color + "15", border: `1px solid ${s.color}30`, borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700, color: s.color, marginBottom: 14 }}>
                  Status: {s.status}
                </div>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, margin: "0 0 16px" }}>{s.detail}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {s.actions.map((a, j) => (
                    <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: C.muted }}>
                      <span style={{ color: s.color, fontWeight: 700, flexShrink: 0 }}>✓</span>
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who Does What */}
      <section style={{ padding: "80px 24px", background: C.bg }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, margin: "0 0 10px" }}>Who Does What?</h2>
            <p style={{ fontSize: 16, color: C.muted }}>Each role is responsible for specific steps in the pipeline.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 18 }}>
            {ROLES_FLOW.map(r => (
              <div key={r.role} style={{ background: "#fff", borderRadius: 16, padding: 24, textAlign: "center", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{r.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: r.color, marginBottom: 8 }}>{r.role}</div>
                <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginBottom: 10 }}>
                  {r.steps.map(n => (
                    <span key={n} style={{ background: r.color + "20", color: r.color, borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>{n}</span>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, margin: "0 0 10px" }}>Security at Every Step</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {[
              { icon: "🔑", title: "OTP 2FA",             desc: "Every login requires a one-time password sent to your phone." },
              { icon: "🪪", title: "ID Verification",     desc: "All users are identity-verified before gaining access." },
              { icon: "😶", title: "Face Verification",   desc: "AWS Rekognition powers biometric login checks." },
              { icon: "🔐", title: "AES-256 Encryption",  desc: "All data encrypted at rest and in transit via TLS 1.3." },
              { icon: "💳", title: "PCI DSS Level 1",     desc: "Highest level of payment security certification." },
              { icon: "🤖", title: "AI Fraud Detection",  desc: "Real-time anomaly detection flags suspicious patterns." },
              { icon: "📜", title: "Immutable Audit Log", desc: "Every action logged with timestamp, user ID, and hash." },
              { icon: "🌐", title: "GDPR Compliant",      desc: "Full data privacy compliance — right to erasure supported." },
            ].map((f, i) => (
              <div key={i} style={{ padding: 20, borderRadius: 14, background: "#F8FAFC", border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.secondary} 100%)`, padding: "60px 24px", textAlign: "center", color: "#fff" }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 16px" }}>Ready to Experience It?</h2>
        <p style={{ fontSize: 17, opacity: 0.85, marginBottom: 32 }}>Log into the live dashboard and see the full system in action.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/dashboard" style={{ padding: "14px 32px", background: C.accent, color: "#fff", borderRadius: 12, textDecoration: "none", fontWeight: 800, fontSize: 15 }}>Open Dashboard →</Link>
          <Link to="/cases"     style={{ padding: "14px 32px", background: "rgba(255,255,255,.15)", color: "#fff", border: "2px solid rgba(255,255,255,.4)", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 15 }}>Browse Cases →</Link>
        </div>
      </section>
    </div>
  );
}
