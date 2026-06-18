import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "../context/LanguageContext.jsx";
import { useResponsive } from "../hooks/useResponsive.js";

const C = {
  navy:"#002651", primary:"#004B96", secondary:"#4B7D19",
  gold:"#E0AB21", muted:"#5A6E8A", bg:"#F4F7FC",
  border:"#D8E4F0", text:"#0D1F3C",
};

const STORIES_KEY = "kf_impact_stories";
const SUBMISSIONS_KEY = "kf_story_submissions";

const CATS = ["Medical","Shelter","Education","Food","Water","Orphan","Emergency","Other"];

function StorySubmitSection({ isMobile }) {
  const EMPTY = { name:"", anonymous:false, title:"", category:"Medical", location:"", what:"", outcome:"", consent:false };
  const [form,    setForm]    = useState(EMPTY);
  const [phase,   setPhase]   = useState("form"); // form | success
  const [errors,  setErrors]  = useState({});

  const id = "share";

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title.trim())   e.title   = "Please enter a story title";
    if (!form.what.trim())    e.what    = "Please describe what happened";
    if (!form.outcome.trim()) e.outcome = "Please describe the outcome";
    if (!form.consent)        e.consent = "Please confirm your consent";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const sub = {
      id: "sub_" + Date.now(),
      submittedAt: new Date().toISOString(),
      status: "pending",
      authorName: form.anonymous ? "Anonymous" : (form.name || "Community Member"),
      title: form.title,
      category: form.category,
      location: form.location,
      beforeDesc: form.what,
      afterDesc: form.outcome,
      icon: "✍️",
      date: new Date().toLocaleDateString("en-GB", { month:"long", year:"numeric" }),
    };
    try {
      const existing = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || "[]");
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([sub, ...existing]));
      window.dispatchEvent(new Event("storage"));
    } catch {}
    setPhase("success");
  };

  const inp = (extra={}) => ({
    fontFamily:"inherit", fontSize:14, color:C.text, padding:"10px 14px",
    border:`1.5px solid ${C.border}`, borderRadius:10, width:"100%",
    background:"#fff", boxSizing:"border-box", outline:"none",
    ...extra,
  });

  return (
    <section id={id} style={{ background:C.bg, padding: isMobile?"48px 20px":"72px 32px" }}>
      <div style={{ maxWidth:760, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <span style={{ background:C.secondary+"20", color:C.secondary, borderRadius:99, padding:"5px 16px", fontSize:12, fontWeight:800, letterSpacing:1, textTransform:"uppercase" }}>
            Community Stories
          </span>
          <h2 style={{ fontSize:"clamp(24px,3.5vw,36px)", fontWeight:900, color:C.navy, margin:"14px 0 10px", letterSpacing:-0.4 }}>
            ✍️ Share Your Story
          </h2>
          <p style={{ fontSize:15, color:C.muted, maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>
            Are you a beneficiary, volunteer, or community member? Tell us what happened — our team reviews every submission and publishes verified stories to inspire more donors.
          </p>
        </div>

        {phase === "success" ? (
          <div style={{ background:"#fff", borderRadius:20, padding:"48px 32px", textAlign:"center", boxShadow:"0 4px 24px rgba(0,38,81,0.09)", border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
            <h3 style={{ fontSize:24, fontWeight:900, color:C.navy, margin:"0 0 12px" }}>Story Submitted!</h3>
            <p style={{ fontSize:15, color:C.muted, maxWidth:400, margin:"0 auto 28px", lineHeight:1.7 }}>
              Thank you for sharing. Our team will review your submission and may reach out for more details before publishing.
            </p>
            <button onClick={() => { setForm(EMPTY); setPhase("form"); }} style={{
              padding:"12px 28px", borderRadius:10, border:`1.5px solid ${C.primary}`,
              color:C.primary, fontWeight:700, fontSize:14, cursor:"pointer", background:"#fff",
            }}>Submit Another Story</button>
          </div>
        ) : (
          <div style={{ background:"#fff", borderRadius:20, padding: isMobile?"24px 18px":"36px 40px", boxShadow:"0 4px 24px rgba(0,38,81,0.09)", border:`1px solid ${C.border}` }}>
            <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":"1fr 1fr", gap:18, marginBottom:18 }}>
              {/* Name */}
              <div>
                <label style={{ display:"block", fontSize:12, fontWeight:700, color:C.muted, marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Your Name (optional)</label>
                <input value={form.name} onChange={e=>set("name",e.target.value)} disabled={form.anonymous}
                  placeholder="e.g. Halima Mohamed" style={{ ...inp(), opacity: form.anonymous ? 0.4 : 1 }} />
                <label style={{ display:"flex", alignItems:"center", gap:8, marginTop:8, fontSize:13, color:C.muted, cursor:"pointer" }}>
                  <input type="checkbox" checked={form.anonymous} onChange={e=>set("anonymous",e.target.checked)} />
                  Submit anonymously
                </label>
              </div>
              {/* Category */}
              <div>
                <label style={{ display:"block", fontSize:12, fontWeight:700, color:C.muted, marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Category *</label>
                <select value={form.category} onChange={e=>set("category",e.target.value)} style={inp()}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom:18 }}>
              <label style={{ display:"block", fontSize:12, fontWeight:700, color:C.muted, marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Story Title *</label>
              <input value={form.title} onChange={e=>set("title",e.target.value)}
                placeholder="e.g. My child received the surgery she needed" style={inp()} />
              {errors.title && <div style={{ fontSize:12, color:"#C0392B", marginTop:4 }}>⚠ {errors.title}</div>}
            </div>

            {/* Location */}
            <div style={{ marginBottom:18 }}>
              <label style={{ display:"block", fontSize:12, fontWeight:700, color:C.muted, marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Location</label>
              <input value={form.location} onChange={e=>set("location",e.target.value)}
                placeholder="e.g. Mogadishu, Baidoa, Kismayo…" style={inp()} />
            </div>

            {/* What happened */}
            <div style={{ marginBottom:18 }}>
              <label style={{ display:"block", fontSize:12, fontWeight:700, color:C.muted, marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>What Happened? *</label>
              <textarea rows={4} value={form.what} onChange={e=>set("what",e.target.value)}
                placeholder="Describe the situation before help arrived — what was the challenge or hardship?"
                style={{ ...inp(), resize:"vertical", lineHeight:1.7 }} />
              {errors.what && <div style={{ fontSize:12, color:"#C0392B", marginTop:4 }}>⚠ {errors.what}</div>}
            </div>

            {/* Outcome */}
            <div style={{ marginBottom:24 }}>
              <label style={{ display:"block", fontSize:12, fontWeight:700, color:C.muted, marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>What Changed? *</label>
              <textarea rows={4} value={form.outcome} onChange={e=>set("outcome",e.target.value)}
                placeholder="Describe the outcome — how did the support change the situation?"
                style={{ ...inp(), resize:"vertical", lineHeight:1.7 }} />
              {errors.outcome && <div style={{ fontSize:12, color:"#C0392B", marginTop:4 }}>⚠ {errors.outcome}</div>}
            </div>

            {/* Consent */}
            <div style={{ background:C.bg, borderRadius:12, padding:"14px 16px", marginBottom:24 }}>
              <label style={{ display:"flex", gap:10, cursor:"pointer", fontSize:13, color:C.text, lineHeight:1.6 }}>
                <input type="checkbox" checked={form.consent} onChange={e=>set("consent",e.target.checked)} style={{ marginTop:2, flexShrink:0 }} />
                <span>I confirm that this story is true and I consent to Kafaala Qaad reviewing and potentially publishing it on their platform and social media. My identity will remain protected unless I chose otherwise.</span>
              </label>
              {errors.consent && <div style={{ fontSize:12, color:"#C0392B", marginTop:6 }}>⚠ {errors.consent}</div>}
            </div>

            <button onClick={submit} style={{
              width:"100%", padding:"14px", borderRadius:12, border:"none", cursor:"pointer",
              background:`linear-gradient(135deg,${C.primary},${C.navy})`,
              color:"#fff", fontWeight:800, fontSize:16,
              boxShadow:`0 4px 20px ${C.primary}40`,
            }}>
              Submit My Story →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

const STATIC_STORIES = [
  {
    id:"st1", category:"Success Story", date:"2026-05-12", location:"Mogadishu",
    title:"Family of Seven Finds Safety After Flood Displacement",
    excerpt:"After losing their home to seasonal flooding, a family of seven was living in a collapsed structure. Within 14 days of verification, Kafaala Qaad delivered emergency shelter, three months of food supplies, and clothing for all children.",
    beforeImg:null, afterImg:null,
    beforeDesc:"Family of 7 living in collapsed structure with no clean water or food.",
    afterDesc:"Temporary shelter erected, food supply secured for 3 months, children back in school.",
    daysToDeliver:"14", amountDistributed:"$820",
    tags:["shelter","food","emergency"],
    featured: true,
  },
  {
    id:"st2", category:"Medical", date:"2026-04-28", location:"Baidoa",
    title:"8-Year-Old Girl Receives Critical Medication",
    excerpt:"A young girl in Baidoa had been without essential medication for weeks, causing rapid health deterioration. After case verification, sponsors covered four months of doctor visits and medication costs.",
    beforeImg:null, afterImg:null,
    beforeDesc:"Critical medication unavailable, health deteriorating rapidly.",
    afterDesc:"Full medication course delivered, 4 months of specialist visits funded.",
    daysToDeliver:"9", amountDistributed:"$540",
    tags:["medical","child"],
    featured: false,
  },
  {
    id:"st3", category:"Education", date:"2026-04-10", location:"Kismayo",
    title:"Three Orphaned Brothers Return to School",
    excerpt:"Three brothers aged 9, 11, and 13 had dropped out after losing both parents. An education program sponsor covered school fees, uniforms, and stationery for a full academic year.",
    beforeImg:null, afterImg:null,
    beforeDesc:"Three brothers out of school, surviving on charity from neighbours.",
    afterDesc:"All three enrolled, school fees paid, uniforms and supplies provided.",
    daysToDeliver:"21", amountDistributed:"$960",
    tags:["education","orphan","children"],
    featured: true,
  },
  {
    id:"st4", category:"Food & Nutrition", date:"2026-03-22", location:"Garowe",
    title:"Weekly Food Deliveries Reach Isolated Elder",
    excerpt:"A 78-year-old man living alone with no income had no reliable access to food. A monthly food program now ensures weekly deliveries and a community health worker visits regularly.",
    beforeImg:null, afterImg:null,
    beforeDesc:"No food security, no family contact, deteriorating health.",
    afterDesc:"Weekly food delivery, monthly health check, reconnected with distant family.",
    daysToDeliver:"11", amountDistributed:"$460",
    tags:["food","elderly"],
    featured: false,
  },
  {
    id:"st5", category:"Press Release", date:"2026-03-05", location:"Mogadishu",
    title:"Kafaala Qaad Reaches 500 Verified Cases Milestone",
    excerpt:"The platform announces the verification and aid delivery for its 500th case, representing families in 12 regions across Somalia. Total funds distributed exceed $380,000.",
    beforeImg:null, afterImg:null,
    beforeDesc:"", afterDesc:"",
    daysToDeliver:null, amountDistributed:"$380,000+",
    tags:["milestone","platform"],
    featured: true,
  },
  {
    id:"st6", category:"Partnership", date:"2026-02-18", location:"",
    title:"New Partnership with Regional Health Ministry",
    excerpt:"A formal agreement enables Kafaala Qaad field agents to coordinate directly with regional health clinics for medical cases, reducing verification time from 14 days to under 5 days.",
    beforeImg:null, afterImg:null,
    beforeDesc:"", afterDesc:"",
    daysToDeliver:null, amountDistributed:null,
    tags:["partnership","health"],
    featured: false,
  },
];

const CAT_COLORS = {
  "Success Story":    { bg:"#D1FAE5", text:"#065F46" },
  "Medical":          { bg:"#DBEAFE", text:"#1E40AF" },
  "Education":        { bg:"#FEF3C7", text:"#92400E" },
  "Food & Nutrition": { bg:"#FDE8D8", text:"#9A3412" },
  "Press Release":    { bg:"#EDE9FE", text:"#5B21B6" },
  "Partnership":      { bg:"#FCE7F3", text:"#831843" },
  "Emergency":        { bg:"#FEE2E2", text:"#991B1B" },
  "Program Update":   { bg:"#ECFDF5", text:"#065F46" },
};
const catStyle = (cat) => CAT_COLORS[cat] || { bg:"#F3F4F6", text:"#374151" };

const fmt = (d) => {
  try { return new Date(d).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" }); }
  catch { return d; }
};

function StoryModal({ story, onClose, navigate }) {
  if (!story) return null;
  const cs = catStyle(story.category);
  const handleShare = () => {
    const url = window.location.origin + "/stories";
    if (navigator.share) {
      navigator.share({ title: story.title, text: story.excerpt, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => alert("Link copied to clipboard!")).catch(() => {});
    }
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:"#fff", borderRadius:20, maxWidth:740, width:"100%", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.25)" }}>
        {/* Modal header */}
        <div style={{ padding:"24px 28px 0", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
          <div style={{ flex:1 }}>
            <span style={{ background:cs.bg, color:cs.text, borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:700 }}>{story.category}</span>
            {story.date && <span style={{ fontSize:12, color:C.muted, marginLeft:10 }}>{fmt(story.date)}</span>}
            {story.location && <span style={{ fontSize:12, color:C.muted }}> · 📍 {story.location}</span>}
          </div>
          <button onClick={onClose} style={{ background:"#F3F4F6", border:"none", borderRadius:"50%", width:34, height:34, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>×</button>
        </div>

        <div style={{ padding:"16px 28px 28px" }}>
          <h2 style={{ fontSize:22, fontWeight:900, color:C.text, margin:"12px 0 16px", lineHeight:1.3 }}>{story.title}</h2>
          <p style={{ fontSize:15, color:C.muted, lineHeight:1.75, marginBottom:20 }}>{story.excerpt}</p>

          {/* Before / After panels — only if both descriptions exist */}
          {(story.beforeDesc || story.afterDesc) && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0, borderRadius:14, overflow:"hidden", marginBottom:20, border:`1px solid ${C.border}` }}>
              {[
                { side:"Before", img:story.beforeImg, desc:story.beforeDesc, bg:"linear-gradient(135deg,#6B7280,#9CA3AF)", badge:"rgba(0,0,0,0.6)", emoji:"😔" },
                { side:"After",  img:story.afterImg,  desc:story.afterDesc,  bg:"linear-gradient(135deg,#059669,#10B981)",  badge:"rgba(5,150,105,0.9)", emoji:"😊" },
              ].map((p, pi) => (
                <div key={pi} style={{ borderRight: pi===0 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ position:"relative" }}>
                    {p.img
                      ? <img src={p.img} alt={p.side} style={{ width:"100%", height:180, objectFit:"cover", display:"block" }} />
                      : <div style={{ height:180, background:p.bg, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:48, opacity:0.6 }}>{p.emoji}</span></div>
                    }
                    <div style={{ position:"absolute", top:8, left:8, background:p.badge, color:"#fff", borderRadius:6, padding:"3px 10px", fontSize:11, fontWeight:800 }}>{p.side}</div>
                  </div>
                  {p.desc && <div style={{ padding:"12px 14px", fontSize:13, color:pi===0?C.muted:C.secondary, fontWeight:pi===0?400:600, lineHeight:1.6 }}>{p.desc}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Stats row */}
          {(story.daysToDeliver || story.amountDistributed) && (
            <div style={{ display:"flex", gap:20, background:C.bg, borderRadius:12, padding:"14px 18px", marginBottom:20 }}>
              {story.daysToDeliver && (
                <div>
                  <div style={{ fontSize:22, fontWeight:900, color:C.primary }}>{story.daysToDeliver}</div>
                  <div style={{ fontSize:11, color:C.muted }}>days to deliver</div>
                </div>
              )}
              {story.amountDistributed && (
                <div>
                  <div style={{ fontSize:22, fontWeight:900, color:C.secondary }}>{story.amountDistributed}</div>
                  <div style={{ fontSize:11, color:C.muted }}>distributed</div>
                </div>
              )}
              <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:"#10B981", display:"inline-block" }} />
                <span style={{ fontSize:12, color:"#10B981", fontWeight:700 }}>Verified & Delivered</span>
              </div>
            </div>
          )}

          {/* Tags */}
          {story.tags?.length > 0 && (
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
              {story.tags.map(tag => (
                <span key={tag} style={{ background:"#F3F4F6", color:C.muted, borderRadius:20, padding:"3px 12px", fontSize:12 }}>#{tag}</span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <button onClick={handleShare}
              style={{ padding:"11px 22px", background:C.primary, color:"#fff", border:"none", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:7 }}>
              🔗 Share This Story
            </button>
            <button onClick={() => { navigate("/donate"); onClose(); }}
              style={{ padding:"11px 22px", background:C.gold, color:"#fff", border:"none", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer" }}>
              ❤️ Sponsor a Case
            </button>
            <button onClick={() => { navigate("/cases"); onClose(); }}
              style={{ padding:"11px 22px", background:"none", color:C.primary, border:`1.5px solid ${C.primary}`, borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer" }}>
              View All Cases
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Stories() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const { isMobile, isTablet } = useResponsive();

  const [adminStories, setAdminStories] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORIES_KEY) || "[]").map(s => ({
        ...s, date: s.createdAt?.split("T")[0] || new Date().toISOString().split("T")[0],
        excerpt: [s.beforeDesc, s.afterDesc].filter(Boolean).join(" → ").slice(0, 160) + "…",
        tags: [s.category?.toLowerCase().replace(/\s+/g,"-")].filter(Boolean),
        featured: false,
      }));
    } catch { return []; }
  });

  useEffect(() => {
    const sync = () => {
      try {
        setAdminStories(JSON.parse(localStorage.getItem(STORIES_KEY) || "[]").map(s => ({
          ...s, date: s.createdAt?.split("T")[0] || new Date().toISOString().split("T")[0],
          excerpt: [s.beforeDesc, s.afterDesc].filter(Boolean).join(" → ").slice(0, 160) + "…",
          tags: [s.category?.toLowerCase().replace(/\s+/g,"-")].filter(Boolean),
          featured: false,
        })));
      } catch {}
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const allStories = [...adminStories, ...STATIC_STORIES];
  const CATEGORIES = ["All", ...Array.from(new Set(allStories.map(s => s.category)))];
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const displayed = allStories.filter(s => {
    const matchCat = activeCat === "All" || s.category === activeCat;
    const q = search.toLowerCase();
    const matchSearch = !q || s.title.toLowerCase().includes(q) || s.excerpt?.toLowerCase().includes(q) || s.location?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const featured = displayed.filter(s => s.featured);
  const rest     = displayed.filter(s => !s.featured);

  const wrap  = { maxWidth:1200, margin:"0 auto", padding: isMobile?"0 16px":"0 32px" };
  const sec   = (bg) => ({ background:bg, padding: isMobile?"48px 0":"72px 0" });

  return (
    <>
      {/* Hero */}
      <section style={{ background:`linear-gradient(135deg,${C.navy} 0%,${C.primary} 60%,${C.secondary} 100%)`, color:"#fff", padding: isMobile?"60px 16px 48px":"100px 32px 72px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-80, right:-80, width:340, height:340, borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }} />
        <div style={{ position:"relative", maxWidth:700, margin:"0 auto" }}>
          <span style={{ background:"rgba(255,255,255,0.15)", borderRadius:100, padding:"6px 18px", fontSize:12, fontWeight:800, letterSpacing:1.5, textTransform:"uppercase" }}>
            {lang==="so"?"Wararkii & Xikaayada":lang==="ar"?"الأخبار والقصص":lang==="tr"?"Haberler & Hikayeler":lang==="es"?"Noticias & Historias":lang==="fr"?"Actualités & Histoires":"News & Stories"}
          </span>
          <h1 style={{ fontSize:"clamp(28px,5vw,56px)", fontWeight:900, margin:"20px 0 18px", lineHeight:1.1, letterSpacing:-1 }}>
            {lang==="so"?"Xikaayada Saameynta Dhabta ah":lang==="ar"?"قصص الأثر الحقيقي":lang==="tr"?"Gerçek Etki Hikayeleri":lang==="es"?"Historias de Impacto Real":lang==="fr"?"Histoires d'Impact Réel":"Real Impact Stories"}
          </h1>
          <p style={{ fontSize:"clamp(14px,2vw,18px)", opacity:0.85, lineHeight:1.7, marginBottom:32 }}>
            {lang==="so"?"Xaaladda la xaqiijiyay kasta waxay bedeshaa nolosha. Halkan waxaad ka akhrin kartaa siday u dhacday.":lang==="ar"?"كل حالة موثقة تغير حياة. اقرأ هنا كيف حدث ذلك.":lang==="tr"?"Her doğrulanmış vaka hayatları değiştirir. Nasıl olduğunu buradan okuyun.":lang==="es"?"Cada caso verificado transforma vidas. Lea aquí cómo ocurrió.":lang==="fr"?"Chaque cas vérifié transforme des vies. Lisez ici comment cela s'est passé.":"Every verified case transforms lives. Read here how it happened."}
          </p>
          {/* Search */}
          <div style={{ maxWidth:440, margin:"0 auto", position:"relative" }}>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder={lang==="so"?"Raadi xikaayo...":lang==="ar"?"ابحث عن قصة...":lang==="tr"?"Hikaye ara...":lang==="es"?"Buscar historia...":lang==="fr"?"Chercher une histoire...":"Search stories…"}
              style={{ width:"100%", padding:"13px 46px 13px 16px", borderRadius:12, border:"none", fontSize:14, boxSizing:"border-box", outline:"none" }}
            />
            <span style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", fontSize:18, opacity:0.5 }}>🔍</span>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <div style={{ background:"#fff", borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:10 }}>
        <div style={{ ...wrap, paddingTop:0, paddingBottom:0 }}>
          <div style={{ display:"flex", gap:0, overflowX:"auto", scrollbarWidth:"none" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)}
                style={{
                  padding:"14px 20px", background:"none", border:"none", cursor:"pointer", whiteSpace:"nowrap",
                  fontSize:13, fontWeight:700,
                  color:      activeCat===cat ? C.primary : C.muted,
                  borderBottom: activeCat===cat ? `3px solid ${C.primary}` : "3px solid transparent",
                  transition:"all .15s",
                }}>
                {cat}
                <span style={{ marginLeft:6, fontSize:11, opacity:0.6 }}>
                  ({cat==="All" ? allStories.length : allStories.filter(s=>s.category===cat).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured stories */}
      {featured.length > 0 && (
        <section style={sec("#fff")}>
          <div style={wrap}>
            <h2 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:24 }}>
              ⭐ {lang==="so"?"Xikaayada Muhiimka ah":lang==="ar"?"القصص المميزة":lang==="tr"?"Öne Çıkan Hikayeler":lang==="es"?"Historias Destacadas":lang==="fr"?"Histoires à la Une":"Featured Stories"}
            </h2>
            <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr": featured.length===1?"1fr":"1fr 1fr", gap:24 }}>
              {featured.slice(0,2).map(story => {
                const cs = catStyle(story.category);
                return (
                  <div key={story.id} onClick={() => setSelected(story)}
                    style={{ background:"#fff", borderRadius:18, overflow:"hidden", boxShadow:"0 4px 24px rgba(0,38,81,0.10)", border:`1px solid ${C.border}`, cursor:"pointer", transition:"transform .15s, box-shadow .15s" }}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 32px rgba(0,38,81,0.14)";}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 24px rgba(0,38,81,0.10)";}}>
                    {/* Image area */}
                    {story.beforeImg
                      ? <img src={story.beforeImg} alt={story.title} style={{ width:"100%", height:220, objectFit:"cover", display:"block" }} />
                      : <div style={{ height:220, background:`linear-gradient(135deg,${C.primary},${C.secondary})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:64 }}>
                          {story.category==="Education"?"🎓":story.category==="Medical"?"🩺":story.category==="Press Release"?"📣":story.category==="Partnership"?"🤝":"❤️"}
                        </div>
                    }
                    <div style={{ padding:"20px 24px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                        <span style={{ background:cs.bg, color:cs.text, borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:700 }}>{story.category}</span>
                        <span style={{ fontSize:11, color:C.muted }}>{fmt(story.date)}</span>
                        {story.location && <span style={{ fontSize:11, color:C.muted }}>📍 {story.location}</span>}
                      </div>
                      <h3 style={{ fontSize:20, fontWeight:800, color:C.text, margin:"0 0 10px", lineHeight:1.3 }}>{story.title}</h3>
                      <p style={{ fontSize:14, color:C.muted, lineHeight:1.7, margin:"0 0 16px" }}>{story.excerpt}</p>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <span style={{ fontSize:13, fontWeight:700, color:C.primary }}>Read More →</span>
                        <button onClick={e=>{e.stopPropagation();const url=window.location.href;navigator.clipboard?.writeText(url).then(()=>alert("Link copied!")).catch(()=>{});}}
                          style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer", color:C.muted }}>
                          🔗 Share
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* All stories grid */}
      <section style={sec(C.bg)}>
        <div style={wrap}>
          {rest.length > 0 && (
            <h2 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:24 }}>
              {lang==="so"?"Dhammaan Xikaayada":lang==="ar"?"جميع القصص":lang==="tr"?"Tüm Hikayeler":lang==="es"?"Todas las Historias":lang==="fr"?"Toutes les Histoires":"All Stories"}
              <span style={{ fontSize:14, color:C.muted, fontWeight:400, marginLeft:10 }}>({rest.length})</span>
            </h2>
          )}
          {displayed.length === 0 && (
            <div style={{ textAlign:"center", padding:"60px 0", color:C.muted }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
              <div style={{ fontSize:18, fontWeight:700 }}>No stories found</div>
              <div style={{ fontSize:14, marginTop:8 }}>Try a different search or category</div>
            </div>
          )}
          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr": isTablet?"1fr 1fr":"repeat(3,1fr)", gap: isMobile?16:24 }}>
            {rest.map(story => {
              const cs = catStyle(story.category);
              return (
                <div key={story.id} onClick={() => setSelected(story)}
                  style={{ background:"#fff", borderRadius:16, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,38,81,0.07)", border:`1px solid ${C.border}`, cursor:"pointer", transition:"transform .15s, box-shadow .15s" }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 24px rgba(0,38,81,0.12)";}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 2px 12px rgba(0,38,81,0.07)";}}>
                  {/* Image */}
                  {story.beforeImg
                    ? <img src={story.beforeImg} alt={story.title} style={{ width:"100%", height:160, objectFit:"cover", display:"block" }} />
                    : <div style={{ height:160, background:`linear-gradient(135deg,${C.primary}22,${C.secondary}22)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:40 }}>
                        {story.category==="Education"?"🎓":story.category==="Medical"?"🩺":story.category==="Press Release"?"📣":story.category==="Partnership"?"🤝":story.category==="Emergency"?"🚨":"❤️"}
                      </div>
                  }
                  <div style={{ padding:"16px 18px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                      <span style={{ background:cs.bg, color:cs.text, borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:700 }}>{story.category}</span>
                      <span style={{ fontSize:11, color:C.muted }}>{fmt(story.date)}</span>
                    </div>
                    {story.location && <div style={{ fontSize:11, color:C.muted, marginBottom:6 }}>📍 {story.location}</div>}
                    <h3 style={{ fontSize:15, fontWeight:800, color:C.text, margin:"0 0 8px", lineHeight:1.35 }}>{story.title}</h3>
                    <p style={{ fontSize:13, color:C.muted, lineHeight:1.65, margin:"0 0 14px", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                      {story.excerpt}
                    </p>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:12, fontWeight:700, color:C.primary }}>Read more →</span>
                      {(story.daysToDeliver || story.amountDistributed) && (
                        <span style={{ fontSize:11, color:C.muted }}>
                          {story.daysToDeliver ? `${story.daysToDeliver}d · ` : ""}{story.amountDistributed || ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ SHARE YOUR STORY FORM ══ */}
      <StorySubmitSection isMobile={isMobile} />

      {/* CTA section */}
      <section style={{ background:`linear-gradient(135deg,${C.navy},${C.primary})`, color:"#fff", padding: isMobile?"48px 16px":"64px 32px", textAlign:"center" }}>
        <div style={{ maxWidth:640, margin:"0 auto" }}>
          <h2 style={{ fontSize:"clamp(22px,4vw,38px)", fontWeight:900, margin:"0 0 16px" }}>
            {lang==="so"?"Noqo Qayb Ka Mid ah Xikaayadan":"Be Part of the Next Story"}
          </h2>
          <p style={{ fontSize:16, opacity:0.85, lineHeight:1.75, marginBottom:32 }}>
            {lang==="so"?"Deeqadaada ayaa abuuraysa xikaayo cusub. Taageer xaaladda xaqiijisan maanta.":"Your donation creates the next story. Sponsor a verified case today."}
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <Link to="/cases" style={{ padding:"14px 32px", background:C.gold, color:"#fff", borderRadius:12, fontWeight:800, fontSize:15, textDecoration:"none" }}>
              ❤️ Sponsor a Case
            </Link>
          </div>
        </div>
      </section>

      {/* Full story modal */}
      {selected && <StoryModal story={selected} onClose={() => setSelected(null)} navigate={navigate} />}
    </>
  );
}
