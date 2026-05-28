import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext.jsx";
import { useResponsive } from "../hooks/useResponsive.js";
import { partners as partnersApi } from "../api/client.js";

const B = {
  navy:   "#002651",
  blue:   "#004B96",
  green:  "#4B7D19",
  gold:   "#E0AB21",
  bg:     "#F4F7FC",
  border: "#D8E4F0",
  text:   "#0D1F3C",
  muted:  "#5A6E8A",
};

// ── Static Impact Stats ──────────────────────────────────────────────────────
const STATS = [
  { icon: "👨‍👩‍👧‍👦", value: "3,840+", label: "Families Helped",        color: B.blue  },
  { icon: "✅",        value: "5,200+", label: "Verified Deliveries",   color: B.green },
  { icon: "🌍",        value: "14",     label: "Regions Supported",     color: B.gold  },
  { icon: "❤️",        value: "280+",   label: "Active Sponsors",       color: "#C0392B" },
];

// ── Featured Impact Partners ─────────────────────────────────────────────────
const FEATURED = [
  {
    id: 1,
    avatar: "🏛️",
    name: "Al-Khair Foundation",
    type: "International NGO",
    country: "🇬🇧 United Kingdom",
    color: "#3B82F6",
    impact: "Providing emergency food and medical support across East Africa since 2019.",
    casesSupported: 312,
    focus: ["Food Aid", "Medical", "Shelter"],
    verified: true,
  },
  {
    id: 2,
    avatar: "🏥",
    name: "Somali Medical Relief",
    type: "Healthcare Organization",
    country: "🇸🇴 Somalia",
    color: "#10B981",
    impact: "Mobile medical units delivering care to remote communities and displaced families.",
    casesSupported: 198,
    focus: ["Medical", "Emergency Care"],
    verified: true,
  },
  {
    id: 3,
    avatar: "🌱",
    name: "Hope Bridge Initiative",
    type: "Humanitarian Aid Group",
    country: "🇺🇸 United States",
    color: "#8B5CF6",
    impact: "Sponsoring orphan education programs and long-term family resilience projects.",
    casesSupported: 241,
    focus: ["Education", "Orphan Support"],
    verified: true,
  },
  {
    id: 4,
    avatar: "🤝",
    name: "Gulf Humanitarian Council",
    type: "Regional Aid Council",
    country: "🇦🇪 UAE",
    color: "#F59E0B",
    impact: "Coordinating large-scale disaster response and shelter rebuilding efforts.",
    casesSupported: 175,
    focus: ["Disaster Relief", "Shelter"],
    verified: true,
  },
  {
    id: 5,
    avatar: "📚",
    name: "Education Without Borders",
    type: "Education NGO",
    country: "🇨🇦 Canada",
    color: "#EC4899",
    impact: "Funding school supplies, teachers, and learning spaces for conflict-affected children.",
    casesSupported: 133,
    focus: ["Education", "Children"],
    verified: true,
  },
  {
    id: 6,
    avatar: "⛪",
    name: "Diakonia Relief Services",
    type: "Faith-Based Aid Org",
    country: "🇸🇪 Sweden",
    color: "#06B6D4",
    impact: "Long-term partnership for food security and livelihoods in southern Somalia.",
    casesSupported: 89,
    focus: ["Food Security", "Livelihoods"],
    verified: true,
  },
];

// ── Community Supporters ──────────────────────────────────────────────────────
const COMMUNITY = [
  { avatar: "👤", name: "Anonymous Supporter",   country: "🌍 Global",     cases: 14, type: "Individual Donor" },
  { avatar: "💊", name: "Medical Aid Partner",   country: "🇩🇪 Germany",   cases: 7,  type: "Healthcare Sponsor" },
  { avatar: "📖", name: "Education Sponsor",     country: "🇳🇱 Netherlands",cases: 11, type: "Education Partner" },
  { avatar: "🌾", name: "Community Donor",       country: "🌍 Global",     cases: 5,  type: "Community Member" },
  { avatar: "🏗️", name: "Shelter Aid Friend",    country: "🇹🇷 Turkey",    cases: 9,  type: "Infrastructure Partner" },
  { avatar: "💧", name: "Water & WASH Sponsor",  country: "🇫🇷 France",    cases: 6,  type: "WASH Partner" },
  { avatar: "👶", name: "Orphan Care Supporter", country: "🇸🇦 Saudi Arabia", cases: 18, type: "Child Welfare Donor" },
  { avatar: "🚑", name: "Emergency Responder",   country: "🇳🇴 Norway",    cases: 4,  type: "Emergency Partner" },
];

// ── Verified Partner Organizations ───────────────────────────────────────────
const ORGS = [
  { icon: "🏥", name: "Banadir Regional Hospital",    country: "🇸🇴 Mogadishu",   type: "Public Hospital",          color: "#10B981" },
  { icon: "🌿", name: "Mogadishu NGO Consortium",     country: "🇸🇴 Somalia",     type: "NGO Network",              color: "#3B82F6" },
  { icon: "🚜", name: "FAO Somalia Field Office",     country: "🇸🇴 Somalia",     type: "UN Agency Partner",        color: "#F59E0B" },
  { icon: "📦", name: "WFP Local Distribution Hub",  country: "🇸🇴 Somalia",     type: "Food Distribution",        color: "#8B5CF6" },
  { icon: "🧒", name: "UNICEF Child Aid Programme",  country: "🌍 Regional",     type: "Child Welfare Agency",     color: "#EC4899" },
  { icon: "🏗️", name: "Shelter Cluster Somalia",     country: "🇸🇴 Somalia",     type: "Shelter Coordination",     color: "#06B6D4" },
  { icon: "💉", name: "WHO Immunization Partners",   country: "🌍 Regional",     type: "Health Partner",           color: "#C0392B" },
  { icon: "📚", name: "UNHCR Education Initiative",  country: "🌍 Regional",     type: "Refugee Education",        color: "#E0AB21" },
];

// ── Impact Stories ────────────────────────────────────────────────────────────
const STORIES = [
  {
    id: 1,
    icon: "🏠",
    color: "#3B82F6",
    title: "Family of 7 Receives Emergency Shelter",
    location: "📍 Lower Shabelle, Somalia",
    before: "A mother and six children were sleeping in an open field after their home was destroyed by flooding. The case was reported by a local community volunteer.",
    after: "Within 18 days of verification, shelter materials were delivered and assembled. The family now has a safe, weatherproof home.",
    partner: "Al-Khair Foundation",
    impact: "Case #KQ-2024-0441 · Completed & Archived",
    badge: "🏁 Completed",
    badgeColor: "#10B981",
  },
  {
    id: 2,
    icon: "💊",
    color: "#10B981",
    title: "Child Malnutrition Case Fully Resolved",
    location: "📍 Baidoa District, Somalia",
    before: "A 4-year-old boy was referred for severe acute malnutrition. His family had no income and could not afford therapeutic food.",
    after: "Medical aid partner sponsored 3 months of therapeutic nutrition support. The child recovered to healthy weight and was discharged.",
    partner: "Somali Medical Relief",
    impact: "Case #KQ-2024-0189 · Completed & Archived",
    badge: "🏁 Completed",
    badgeColor: "#10B981",
  },
  {
    id: 3,
    icon: "📚",
    color: "#8B5CF6",
    title: "12 Orphaned Children Back in School",
    location: "📍 Kismayo, Somalia",
    before: "12 children aged 6–14 had dropped out of school after losing their parents. No funds for supplies, uniforms, or school fees.",
    after: "Education Without Borders sponsored a full academic year for all 12 children — including materials, uniforms, and teacher support.",
    partner: "Education Without Borders",
    impact: "Case #KQ-2024-0312 · Completed & Archived",
    badge: "🏁 Completed",
    badgeColor: "#10B981",
  },
];

// ── Appreciation Wall Messages ────────────────────────────────────────────────
const APPRECIATION = [
  "Every family sheltered is a life transformed. Thank you.",
  "Your trust makes our verification work meaningful.",
  "Aid without accountability is just charity. You make it justice.",
  "Because of your support, children are eating today.",
  "Each verified delivery is a promise kept.",
  "Together we close the gap between need and relief.",
  "Transparent aid. Real impact. Because of you.",
  "No child should go to sleep hungry. You help make that true.",
];

export default function ImpactPartners() {
  const { lang } = useLang();
  const { isMobile, isTablet } = useResponsive();
  const [activeTab, setActiveTab] = useState("featured");

  // ── Live data from Supabase via API ────────────────────────────
  const [liveData,  setLiveData]  = useState(null);
  const [apiStats,  setApiStats]  = useState(null);
  const [liveStories, setLiveStories] = useState([]);
  const [loadingApi,  setLoadingApi]  = useState(true);

  useEffect(() => {
    Promise.all([partnersApi.all(), partnersApi.stories()])
      .then(([data, storyData]) => {
        if (data?.featured?.length || data?.community?.length || data?.organizations?.length) {
          setLiveData(data);
        }
        if (storyData?.stories?.length) setLiveStories(storyData.stories);
        if (data?.totals) setApiStats(data.totals);
      })
      .catch(() => { /* silently fall back to static data */ })
      .finally(() => setLoadingApi(false));
  }, []);

  // merge live stats into STATS display
  const displayStats = apiStats ? [
    { icon: "👨‍👩‍👧‍👦", value: (apiStats.familiesImpacted || 3840).toLocaleString() + "+", label: "Families Helped",      color: B.blue  },
    { icon: "✅",        value: (apiStats.casesSupported  || 5200).toLocaleString() + "+", label: "Verified Deliveries", color: B.green },
    { icon: "🌍",        value: "14",                                                       label: "Regions Supported",  color: B.gold  },
    { icon: "❤️",        value: (apiStats.activePartners  || 280).toLocaleString()  + "+", label: "Active Sponsors",    color: "#C0392B" },
  ] : STATS;

  const displayFeatured  = (liveData?.featured?.length      ? liveData.featured      : FEATURED);
  const displayCommunity = (liveData?.community?.length     ? liveData.community     : COMMUNITY);
  const displayOrgs      = (liveData?.organizations?.length ? liveData.organizations : ORGS);
  const displayStories   = (liveStories.length              ? liveStories.map(s => ({
    ...s, title: s.impactStory || s.name, before: s.impactBefore, after: s.impactAfter,
    icon: s.avatar, badge: "🏁 Completed", badgeColor: "#10B981",
    location: `${s.countryFlag || "📍"} ${s.country || "Somalia"}`,
    partner: s.name, impact: s.caseRef || "",
  })) : STORIES);

  const partnerCols = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)";
  const orgCols     = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(4, 1fr)";
  const statCols    = isMobile ? "1fr 1fr" : "repeat(4, 1fr)";
  const storyCols   = isMobile ? "1fr" : "repeat(3, 1fr)";

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: B.text, background: B.bg }}>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        className="kf-hero-dots"
        style={{
          background: `linear-gradient(145deg, ${B.navy} 0%, ${B.blue} 60%, ${B.green} 100%)`,
          color: "#fff",
          padding: isMobile ? "72px 20px 56px" : "96px 24px 72px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
        {/* Decorative orbs */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 360, height: 360, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60,  width: 280, height: 280, borderRadius: "50%", background: `rgba(224,171,33,0.07)`, pointerEvents: "none" }} />

        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          <span className="kf-badge" style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", marginBottom: 20, display: "inline-flex" }}>
            🤝 Humanitarian Impact Partners
          </span>

          <h1 style={{
            fontSize: "clamp(34px, 5.5vw, 58px)",
            fontWeight: 900,
            margin: "18px 0 16px",
            lineHeight: 1.15,
            letterSpacing: -1,
          }}>
            Impact Partners
          </h1>

          <p style={{
            fontSize: isMobile ? 16 : 19,
            opacity: 0.85,
            lineHeight: 1.75,
            maxWidth: 600,
            margin: "0 auto 36px",
          }}>
            Organizations, sponsors, and humanitarian supporters helping verified aid reach real people in need.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/donate" className="kf-btn kf-btn-gold kf-shine" style={{ padding: "13px 28px", borderRadius: 12, fontSize: 14, fontWeight: 800, textDecoration: "none" }}>
              ❤️ Become a Partner
            </Link>
            <Link to="/cases" className="kf-btn kf-btn-ghost" style={{ padding: "13px 28px", borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
              🌍 View Open Cases →
            </Link>
          </div>
        </div>
      </section>

      {/* ── GLOBAL IMPACT STATS ──────────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? "0 16px" : "0 24px", marginTop: -36 }}>
        <div style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: statCols,
          gap: isMobile ? 12 : 20,
        }}>
          {displayStats.map(s => (
            <div key={s.label} className="kf-card" style={{
              background: "#fff",
              borderRadius: 18,
              padding: isMobile ? "24px 20px" : "32px 28px",
              textAlign: "center",
              boxShadow: "0 6px 28px rgba(0,38,81,0.10)",
              border: `1px solid ${B.border}`,
              borderTop: `4px solid ${s.color}`,
            }}>
              <div style={{ fontSize: isMobile ? 32 : 38, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: B.muted, fontWeight: 600, marginTop: 8, letterSpacing: 0.3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED IMPACT PARTNERS ─────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? "64px 16px" : "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="kf-badge" style={{ background: B.blue + "12", color: B.blue, border: `1px solid ${B.blue}22`, marginBottom: 14, display: "inline-flex" }}>
              🏆 Featured Impact Partners
            </span>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 900, margin: "0 0 14px", letterSpacing: -0.5 }}>
              Our Leading Supporters
            </h2>
            <hr className="kf-rule-center" />
            <p style={{ fontSize: 16, color: B.muted, maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
              Organizations and supporters who have made a sustained, verified humanitarian impact through this platform.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: partnerCols, gap: isMobile ? 16 : 24 }}>
            {displayFeatured.map(p => (
              <FeaturedCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY SUPPORTERS ─────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: isMobile ? "64px 16px" : "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="kf-badge" style={{ background: B.green + "15", color: B.green, border: `1px solid ${B.green}25`, marginBottom: 14, display: "inline-flex" }}>
              ❤️ Community Supporters
            </span>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 900, margin: "0 0 14px", letterSpacing: -0.5 }}>
              Every Contribution Counts
            </h2>
            <hr className="kf-rule-center" />
            <p style={{ fontSize: 16, color: B.muted, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
              Individual donors and small-group supporters who quietly change lives — one verified case at a time.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : isTablet ? "repeat(4, 1fr)" : "repeat(8, 1fr)",
            gap: isMobile ? 12 : 16,
          }}>
            {displayCommunity.map((c, i) => (
              <CommunityCard key={i} c={c} />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 36 }}>
            <div style={{
              display: "inline-block",
              padding: "14px 28px",
              background: B.bg,
              border: `1px solid ${B.border}`,
              borderRadius: 14,
              fontSize: 13,
              color: B.muted,
              lineHeight: 1.7,
              maxWidth: 480,
            }}>
              🔒 <strong>Privacy-first:</strong> All supporters can choose to remain anonymous. We celebrate impact, not identity.
            </div>
          </div>
        </div>
      </section>

      {/* ── VERIFIED PARTNER ORGANIZATIONS ───────────────────────────────────── */}
      <section style={{ background: B.bg, padding: isMobile ? "64px 16px" : "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="kf-badge" style={{ background: B.gold + "18", color: "#B8861A", border: `1px solid ${B.gold}30`, marginBottom: 14, display: "inline-flex" }}>
              🌍 Verified Partner Organizations
            </span>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 900, margin: "0 0 14px", letterSpacing: -0.5 }}>
              Trusted Organizations
            </h2>
            <hr className="kf-rule-center" />
            <p style={{ fontSize: 16, color: B.muted, maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
              NGOs, hospitals, local aid groups, and relief organizations that have completed full verification on this platform.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: orgCols, gap: isMobile ? 12 : 18 }}>
            {displayOrgs.map((o, i) => (
              <OrgCard key={i} o={o} />
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT STORIES ───────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: isMobile ? "64px 16px" : "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="kf-badge" style={{ background: B.blue + "12", color: B.blue, border: `1px solid ${B.blue}22`, marginBottom: 14, display: "inline-flex" }}>
              📖 Impact Stories
            </span>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 900, margin: "0 0 14px", letterSpacing: -0.5 }}>
              Verified Outcomes
            </h2>
            <hr className="kf-rule-center" />
            <p style={{ fontSize: 16, color: B.muted, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
              Real cases. Real people. Verified from report to delivery — with proof at every step.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: storyCols, gap: isMobile ? 20 : 28 }}>
            {displayStories.map(s => (
              <StoryCard key={s.id} s={s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── APPRECIATION WALL ────────────────────────────────────────────────── */}
      <section style={{
        background: `linear-gradient(145deg, ${B.navy} 0%, ${B.blue} 55%, ${B.green} 100%)`,
        padding: isMobile ? "72px 16px" : "96px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <span className="kf-badge" style={{ background: "rgba(255,255,255,0.14)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", marginBottom: 20, display: "inline-flex" }}>
            🧾 Appreciation Wall
          </span>

          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 900, color: "#fff", margin: "16px 0 12px", letterSpacing: -0.5 }}>
            Thank You
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", marginBottom: 52, lineHeight: 1.7 }}>
            Thank you to every individual and organization helping create verified humanitarian impact.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: 16,
            marginBottom: 52,
          }}>
            {APPRECIATION.map((msg, i) => (
              <div key={i} className="kf-card" style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 16,
                padding: "22px 20px",
                color: "rgba(255,255,255,0.88)",
                fontSize: 14,
                lineHeight: 1.7,
                fontStyle: "italic",
                textAlign: "left",
              }}>
                <span style={{ color: B.gold, fontSize: 18, display: "block", marginBottom: 10 }}>"</span>
                {msg}
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{
            background: "rgba(255,255,255,0.09)",
            border: "1px solid rgba(255,255,255,0.16)",
            borderRadius: 20,
            padding: isMobile ? "32px 20px" : "40px 48px",
          }}>
            <div style={{ fontSize: 13, color: B.gold, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Join Us</div>
            <h3 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, color: "#fff", margin: "0 0 12px", letterSpacing: -0.3 }}>
              Become an Impact Partner
            </h3>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 15, margin: "0 0 28px", lineHeight: 1.7 }}>
              Your contribution — large or small — creates traceable, verified change. Every donation is tracked end-to-end with full transparency.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/donate" className="kf-btn kf-btn-gold kf-shine" style={{ padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 800, textDecoration: "none" }}>
                ❤️ Partner With Us
              </Link>
              <Link to="/contact" className="kf-btn kf-btn-ghost" style={{ padding: "14px 28px", borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                📩 Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FeaturedCard({ p }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: hov ? `0 20px 52px rgba(0,38,81,0.14)` : "0 4px 18px rgba(0,38,81,0.07)",
        border: `1px solid ${B.border}`,
        transform: hov ? "translateY(-6px)" : "translateY(0)",
        transition: "transform 0.22s cubic-bezier(0.34,1.5,0.64,1), box-shadow 0.22s ease",
        display: "flex",
        flexDirection: "column",
      }}>

      {/* Color top stripe */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${p.color}, ${p.color}88)` }} />

      <div style={{ padding: "28px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: p.color + "14",
            border: `2px solid ${p.color}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, flexShrink: 0,
          }}>
            {p.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: B.text, lineHeight: 1.3, marginBottom: 2 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: p.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{p.type}</div>
            <div style={{ fontSize: 12, color: B.muted, marginTop: 2 }}>{p.country}</div>
          </div>
          {p.verified && (
            <span style={{ background: "#D1FAE5", color: "#065F46", fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0 }}>
              ✓ Verified
            </span>
          )}
        </div>

        {/* Impact text */}
        <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.7, margin: "0 0 18px", flex: 1 }}>
          {p.impact}
        </p>

        {/* Focus tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
          {p.focus.map(f => (
            <span key={f} style={{
              background: p.color + "14", color: p.color,
              border: `1px solid ${p.color}28`,
              borderRadius: 20, padding: "3px 10px",
              fontSize: 11, fontWeight: 700,
            }}>{f}</span>
          ))}
        </div>

        {/* Cases supported */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px",
          background: B.bg,
          borderRadius: 12,
          border: `1px solid ${B.border}`,
        }}>
          <span style={{ fontSize: 13, color: B.muted, fontWeight: 600 }}>Cases Supported</span>
          <span style={{ fontSize: 18, fontWeight: 900, color: p.color }}>{p.casesSupported}</span>
        </div>
      </div>
    </div>
  );
}

function CommunityCard({ c }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? B.blue + "07" : "#fff",
        borderRadius: 16,
        padding: "18px 14px",
        textAlign: "center",
        border: `1px solid ${hov ? B.blue + "30" : B.border}`,
        boxShadow: hov ? `0 8px 24px rgba(0,38,81,0.09)` : "none",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.2s ease",
        cursor: "default",
      }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{c.avatar}</div>
      <div style={{ fontSize: 12, fontWeight: 800, color: B.text, marginBottom: 4, lineHeight: 1.3 }}>{c.name}</div>
      <div style={{ fontSize: 11, color: B.muted, marginBottom: 6 }}>{c.country}</div>
      <div style={{ fontSize: 11, color: B.blue, fontWeight: 700, background: B.blue + "10", borderRadius: 20, padding: "2px 8px", display: "inline-block" }}>
        {c.cases} cases
      </div>
    </div>
  );
}

function OrgCard({ o }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="kf-feature-card"
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "22px 18px",
        border: `1px solid ${B.border}`,
        borderLeft: `4px solid ${hov ? o.color : B.border}`,
        boxShadow: hov ? `0 10px 30px rgba(0,38,81,0.10)` : "0 2px 8px rgba(0,38,81,0.04)",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.2s ease",
      }}>
      <div style={{ fontSize: 30, marginBottom: 10 }}>{o.icon}</div>
      <div style={{ fontWeight: 800, fontSize: 13, color: B.text, marginBottom: 4, lineHeight: 1.4 }}>{o.name}</div>
      <div style={{ fontSize: 11, color: o.color, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>{o.type}</div>
      <div style={{ fontSize: 11, color: B.muted }}>{o.country}</div>
      <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 4, background: "#D1FAE5", color: "#065F46", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 20 }}>
        ✓ Partner Verified
      </div>
    </div>
  );
}

function StoryCard({ s }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: hov ? `0 18px 48px rgba(0,38,81,0.12)` : "0 4px 16px rgba(0,38,81,0.06)",
        border: `1px solid ${B.border}`,
        transform: hov ? "translateY(-5px)" : "translateY(0)",
        transition: "transform 0.22s cubic-bezier(0.34,1.5,0.64,1), box-shadow 0.22s ease",
        display: "flex",
        flexDirection: "column",
      }}>

      {/* Header band */}
      <div style={{
        background: `linear-gradient(135deg, ${s.color}18, ${s.color}08)`,
        borderBottom: `1px solid ${s.color}20`,
        padding: "22px 22px 18px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: s.color + "18", border: `2px solid ${s.color}30`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
          }}>{s.icon}</div>
          <div>
            <span style={{ background: s.badgeColor + "18", color: s.badgeColor, fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 20, display: "inline-block", marginBottom: 6 }}>
              {s.badge}
            </span>
            <div style={{ fontSize: 13, color: B.muted }}>{s.location}</div>
          </div>
        </div>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: B.text, lineHeight: 1.4 }}>{s.title}</h3>
      </div>

      {/* Before / After */}
      <div style={{ padding: "20px 22px", flex: 1 }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#C0392B", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
            BEFORE
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{s.before}</p>
        </div>
        <div style={{ width: "100%", height: 1, background: B.border, margin: "14px 0" }} />
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#10B981", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
            AFTER
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{s.after}</p>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "14px 22px",
        borderTop: `1px solid ${B.border}`,
        background: B.bg,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        gap: 8, flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 11, color: B.muted }}>🤝 {s.partner}</span>
        <span style={{ fontSize: 10, color: B.muted, fontStyle: "italic" }}>{s.impact}</span>
      </div>
    </div>
  );
}
