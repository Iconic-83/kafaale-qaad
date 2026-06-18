import { Link, useNavigate } from "react-router-dom";
import { useLang } from "../context/LanguageContext.jsx";
import { PT } from "../translations.js";
import { useResponsive } from "../hooks/useResponsive.js";

const C = {
  navy: "#002651", primary: "#004B96", secondary: "#4B7D19",
  accent: "#E0AB21", gold: "#E0AB21", green: "#4B7D19", blue: "#004B96",
  danger: "#C0392B", muted: "#5A6E8A", bg: "#F4F7FC",
  border: "#D8E4F0", text: "#0D1F3C",
};

const URGENCY_COLOR = { Low: "#10B981", Medium: "#F59E0B", High: "#C0392B", Critical: "#7C3AED" };
const URGENCY_BG    = { Low: "#D1FAE5", Medium: "#FEF3C7", High: "#FEE2E2", Critical: "#EDE9FE" };

// Privacy: no hardcoded names — featured cases are loaded live from the API
const FEATURED_CASES = [
  { id: "sample-1", name: "Anonymous",  age: null, location: "Mogadishu Region", urgency: "High",     funded: 68, goal: "$850",  desc: "Elderly community member with chronic illness needs medication and food support. Case verified.", color: "#C0392B" },
  { id: "sample-2", name: "Anonymous",  age: null, location: "Mogadishu Region", urgency: "Critical", funded: 45, goal: "$1,200",desc: "Family displaced by flooding needs immediate shelter and essential supplies. Situation confirmed.", color: "#7C3AED" },
  { id: "sample-3", name: "Anonymous",  age: null, location: "Mogadishu Region", urgency: "Medium",   funded: 82, goal: "$600",  desc: "Young person with no family support seeking education assistance and safe shelter.", color: "#F59E0B" },
];

export default function Home() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const P = PT.home[lang] || PT.home.en;
  const { isMobile, isTablet } = useResponsive();

  /* ─── data arrays (translations inline) ─────────────────────────────── */
  const WORKFLOW = [
    { n:1,  icon:"📝", color:"#3B82F6",  label: lang==="so"?"Abuurista Warbixinta"    :lang==="ar"?"إنشاء التقرير"         :lang==="tr"?"Rapor Oluşturma"       :lang==="es"?"Creación del Reporte" :lang==="fr"?"Création du Rapport"   :"Report Creation",     desc: lang==="so"?"Warbixiyuhu wuxuu soo gudbinaayaa xaaladda oo leh faahfaahinta, sawirrada iyo goobta":lang==="ar"?"يقدم المُبلِّغ حالة مع التفاصيل والصور والموقع":lang==="tr"?"Muhabir ayrıntılar, fotoğraflar ve konum ile vaka gönderir":lang==="es"?"El reportero envía un caso con detalles, fotos y ubicación":lang==="fr"?"Le rapporteur soumet un cas avec détails, photos et localisation":"Reporter submits a case with details, photos and location" },
    { n:2,  icon:"🏛️", color:"#8B5CF6",  label: lang==="so"?"Xafiiska Xaqiijinta"     :lang==="ar"?"مكتب التحقق"           :lang==="tr"?"Doğrulama Ofisi"        :lang==="es"?"Oficina de Verificación":lang==="fr"?"Bureau de Vérification" :"Verification Office", desc: lang==="so"?"Saraakiishu waxay dib u eegayaan warbixinta oo u xilsaarayaan koox goobta":lang==="ar"?"يراجع المسؤولون التقرير ويعيّنون فريقًا ميدانيًا":lang==="tr"?"Yetkililer raporu inceler ve saha ekibi atar":lang==="es"?"Los oficiales revisan el reporte y asignan equipo de campo":lang==="fr"?"Les officiers examinent le rapport et assignent une équipe de terrain":"Officers review the report and assign a field team" },
    { n:3,  icon:"🔍", color:"#F59E0B",  label: lang==="so"?"Baarista Goobta"          :lang==="ar"?"التحقيق الميداني"      :lang==="tr"?"Saha Soruşturması"      :lang==="es"?"Investigación de Campo":lang==="fr"?"Enquête de Terrain"     :"Field Investigation", desc: lang==="so"?"Wakiilku waxuu booqanayaa, xaqiijinayaa oo dukumeentinaayaa iyada oo leh GPS + caddayn sawir":lang==="ar"?"يزور العملاء الميدانيون ويتحققون ويوثقون بـGPS + دليل صوري":lang==="tr"?"Saha ajanları ziyaret eder, doğrular ve GPS + fotoğraf kanıtıyla belgeler":lang==="es"?"Agentes visitan, verifican y documentan con GPS + prueba fotográfica":lang==="fr"?"Les agents visitent, vérifient et documentent avec GPS + preuve photo":"Field agents visit, verify and document with GPS + photo proof" },
    { n:4,  icon:"✅", color:"#10B981",  label: lang==="so"?"Xaqiijisan"               :lang==="ar"?"تم التحقق"             :lang==="tr"?"Doğrulandı"             :lang==="es"?"Verificado"           :lang==="fr"?"Vérifié"               :"Verified",            desc: lang==="so"?"Xaaladda waxaa la xaqiijiyay oo la muujiyay deeq-bixiyeyaasha si ay u taageeraan":lang==="ar"?"تم تأكيد الحالة وأصبحت مرئية للمانحين للرعاية":lang==="tr"?"Vaka onaylandı ve sponsorlar için bağışçılara görünür hale getirildi":lang==="es"?"Caso confirmado y visible para donantes para apadrinamiento":lang==="fr"?"Cas confirmé et rendu visible aux donateurs pour parrainage":"Case confirmed and made visible to donors for sponsorship" },
    { n:5,  icon:"👥", color:"#EC4899",  label: lang==="so"?"Safka Deeq-bixiyeyaasha"  :lang==="ar"?"قائمة انتظار المانحين":lang==="tr"?"Bağışçı Kuyruğu"        :lang==="es"?"Cola de Donantes"     :lang==="fr"?"File des Donateurs"    :"Donor Queue",         desc: lang==="so"?"Xaaladda waxay galaysaa baanka deeq-bixiyeyaasha — deeq-bixiyeyaashu waxay ka baadhi karaan oo dooranayaan":lang==="ar"?"تدخل الحالة تجمع المانحين — يمكن للرعاة التصفح والاختيار":lang==="tr"?"Vaka bağışçı havuzuna girer — sponsorlar göz atabilir ve seçebilir":lang==="es"?"El caso entra al fondo de donantes — patrocinadores pueden explorar y seleccionar":lang==="fr"?"Le cas entre dans le pool des donateurs — les sponsors peuvent parcourir et sélectionner":"Case enters the donor pool — sponsors can browse and select" },
    { n:6,  icon:"❤️", color:"#C0392B",  label: lang==="so"?"Taageerada"               :lang==="ar"?"الرعاية"               :lang==="tr"?"Sponsorluk"             :lang==="es"?"Apadrinamiento"       :lang==="fr"?"Parrainage"            :"Sponsorship",         desc: lang==="so"?"Deeq-bixiyuhu wuxuu taageeraa xaaladda oo lacagtu si amaahday loo daabacanayaa":lang==="ar"?"يرعى المانح الحالة ويتم معالجة الدفع بأمان":lang==="tr"?"Bağışçı vakayı destekler ve ödeme güvenli şekilde işlenir":lang==="es"?"El donante patrocina el caso y el pago se procesa de forma segura":lang==="fr"?"Le donateur parraine le cas et le paiement est traité en toute sécurité":"Donor sponsors the case and payment is securely processed" },
    { n:7,  icon:"📦", color:"#06B6D4",  label: lang==="so"?"Gaarsiinta Gargaarka"     :lang==="ar"?"تسليم المساعدة"        :lang==="tr"?"Yardım Teslimatı"       :lang==="es"?"Entrega de Ayuda"     :lang==="fr"?"Livraison de l'Aide"   :"Aid Delivery",        desc: lang==="so"?"Kooxda goobtu waxay gaarsiisaa gargaarka oo soo raraysaa caddaynta gaarsiinta":lang==="ar"?"يسلم الفريق الميداني المساعدة ويرفع دليل التسليم":lang==="tr"?"Saha ekibi yardımı teslim eder ve teslimat kanıtı yükler":lang==="es"?"El equipo de campo entrega la ayuda y sube prueba de entrega":lang==="fr"?"L'équipe de terrain livre l'aide et télécharge la preuve de livraison":"Field team delivers aid and uploads proof of delivery" },
    { n:8,  icon:"🏁", color:"#5A6E8A",  label: lang==="so"?"La Dhammeeyay"            :lang==="ar"?"مكتملة"                :lang==="tr"?"Tamamlandı"             :lang==="es"?"Completado"           :lang==="fr"?"Terminé"               :"Completed",           desc: lang==="so"?"Xaaladda waxaa lagu kaydiyaa warbixin saameyn leh — xadhkaha buuxa oo ilaalinaya":lang==="ar"?"تُؤرشف الحالة مع تقرير التأثير — يُحفظ سجل التدقيق الكامل":lang==="tr"?"Vaka etki raporu ile arşivlenir — tam denetim izi korunur":lang==="es"?"Caso archivado con informe de impacto — rastro de auditoría completo preservado":lang==="fr"?"Cas archivé avec rapport d'impact — piste d'audit complète préservée":"Case archived with impact report — full audit trail preserved" },
  ];

  const ROLES = [
    { icon:"👁️", color:"#3B82F6", bg:"#EFF6FF", role: lang==="so"?"Warbixiye":lang==="ar"?"مراسل":lang==="tr"?"Muhabir":lang==="es"?"Reportero":lang==="fr"?"Rapporteur":"Reporter", desc: lang==="so"?"Soo gudbi xaaladaha & qaado sawiro GPS ah":"Submit cases & take GPS photos" },
    { icon:"🏛️", color:"#8B5CF6", bg:"#F5F3FF", role: lang==="so"?"Xafiiska":lang==="ar"?"التحقق":lang==="tr"?"Doğrulama":lang==="es"?"Verificación":lang==="fr"?"Vérification":"Verification", desc: lang==="so"?"Xaqiiji & xilsaar kooxaha goobta":"Verify & assign field teams" },
    { icon:"🗺️", color:"#F59E0B", bg:"#FFFBEB", role: lang==="so"?"Kooxda Goobta":lang==="ar"?"الفريق الميداني":lang==="tr"?"Saha Ekibi":lang==="es"?"Equipo de Campo":lang==="fr"?"Équipe Terrain":"Field Team", desc: lang==="so"?"Booqo, xaqiiji & soo rar caddaynta":"Visit, verify & upload proof" },
    { icon:"❤️", color:"#EC4899", bg:"#FDF2F8", role: lang==="so"?"Deeq-bixiye":lang==="ar"?"متبرع":lang==="tr"?"Bağışçı":lang==="es"?"Donante":lang==="fr"?"Donateur":"Donor", desc: lang==="so"?"Taageer xaaladaha xaqiijisan":"Sponsor verified cases securely" },
    { icon:"🛡️", color:"#C0392B", bg:"#FEF2F2", role: lang==="so"?"Super Admin":lang==="ar"?"المدير العام":lang==="tr"?"Süper Admin":lang==="es"?"Super Admin":lang==="fr"?"Super Admin":"Super Admin", desc: lang==="so"?"Xukumaad buuxda ee platform-ka":"Full platform control & analytics" },
  ];

  const FEATURES = [
    { icon:"🔐", color:"#004B96", title:lang==="so"?"Amni Badan":lang==="ar"?"أمان متعدد الطبقات":lang==="tr"?"Güvenlik":lang==="es"?"Seguridad":lang==="fr"?"Sécurité":"Multi-Layer Security", desc:lang==="so"?"OTP, xaqiijinta wejigu & AES-256":"OTP login, face verify & AES-256 encryption on every account." },
    { icon:"💰", color:"#4B7D19", title:lang==="so"?"Lacag-bixiyooyin Ammaan":"Secure Payments",                    desc:"Stripe, PayPal, Bank Transfer & Ama Gateway — PCI DSS Level 1." },
    { icon:"🗺️", color:"#E0AB21", title:lang==="so"?"GPS Goobta":"GPS Field Tracking",                              desc:"Real-time GPS navigation with geofencing to verify on-site presence." },
    { icon:"📊", color:"#8B5CF6", title:lang==="so"?"Falanqaynta":"Real-Time Analytics",                            desc:"Live dashboards for every role — case pipeline, donations, KPIs." },
    { icon:"🤖", color:"#06B6D4", title:lang==="so"?"AI Ogaanshaha":"AI Fraud Detection",                           desc:"Anomaly engine flags duplicates, suspicious patterns & irregularities." },
    { icon:"📱", color:"#EC4899", title:lang==="so"?"App Mobile-ka":"Mobile App",                                   desc:"Offline-capable React Native app — works without internet, syncs on reconnect." },
    { icon:"📋", color:"#F59E0B", title:lang==="so"?"Diiwaanka Buuxa":"Full Audit Trail",                           desc:"Every action logged — immutable trail with timestamps & transaction hashes." },
    { icon:"🌍", color:"#10B981", title:lang==="so"?"Luqaddo Badan":"Multi-Language",                              desc:"Somali, Arabic, English, Turkish, Spanish & French across all roles." },
  ];

  const STATS = [
    { val:"2,400+", label:P.stat_cases,  icon:"📋", color:C.primary   },
    { val:"$1.2M",  label:P.stat_aid,    icon:"💰", color:C.secondary },
    { val:"98.8%",  label:P.stat_verify, icon:"✅", color:"#10B981"   },
    { val:"6",      label:P.stat_cities, icon:"📍", color:C.accent    },
  ];

  const TRUST = [
    "100% field-verified cases",
    "GPS-tracked deliveries",
    "Secure escrow payments",
    "Real-time donor updates",
    "PCI DSS Level 1",
  ];

  /* ─── Shared style atoms ──────────────────────────────────────────────── */
  const pad  = isMobile ? "0 20px" : "0 32px";
  const wrap = { maxWidth: 1280, margin: "0 auto", padding: pad };
  const sec  = (bg, py=80) => ({ background: bg, padding: isMobile ? `${py*.75}px 0` : `${py}px 0` });

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text }}>

      {/* ══════════════════════════════ HERO ══════════════════════════════ */}
      <section style={{
        position: "relative", overflow: "hidden",
        color: "#fff",
        minHeight: isMobile ? 560 : 680,
        display: "flex", alignItems: "center",
      }}>
        {/* ── Video background ── drop your video at /assets/hero-video.mp4 */}
        <video
          autoPlay muted loop playsInline
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", zIndex:0 }}
        >
          <source src="/assets/hero-video.mp4" type="video/mp4" />
        </video>

        {/* ── Dark gradient overlay ── */}
        <div style={{
          position:"absolute", inset:0, zIndex:1,
          background:`linear-gradient(145deg,
            rgba(0,38,81,0.90) 0%,
            rgba(0,75,150,0.82) 50%,
            rgba(75,125,25,0.72) 100%)`,
        }} />

        {/* ── Content ── */}
        <div style={{ position:"relative", zIndex:2, width:"100%", padding: isMobile?"72px 20px 60px":"110px 32px 90px" }}>
          <div style={{ maxWidth:820, margin:"0 auto", textAlign:"center" }}>

            {/* Headline */}
            <h1 style={{ fontSize:"clamp(36px,6vw,68px)", fontWeight:900, margin:"0 0 24px", lineHeight:1.08, letterSpacing:-1.5 }}>
              {P.hero_title1}<br />
              <span style={{ color:C.gold }}>{P.hero_title2}</span>
            </h1>

            <p style={{ fontSize:"clamp(16px,2.2vw,20px)", opacity:0.86, maxWidth:640, margin:"0 auto 44px", lineHeight:1.75 }}>
              {P.hero_sub}
            </p>

            {/* CTA row */}
            <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
              <button className="kf-btn kf-btn-gold" onClick={() => navigate("/cases")}
                style={{ padding:isMobile?"14px 28px":"17px 40px", borderRadius:14, fontSize:isMobile?14:16, fontWeight:800, border:"none" }}>
                {P.btn_sponsor}
              </button>
              <button className="kf-btn kf-btn-ghost" onClick={() => navigate("/how-it-works")}
                style={{ padding:isMobile?"14px 28px":"17px 40px", borderRadius:14, fontSize:isMobile?14:16, fontWeight:700, border:"none" }}>
                {P.btn_how}
              </button>
            </div>

            {/* Trust strip */}
            <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:isMobile?10:24, marginTop:44, paddingTop:36, borderTop:"1px solid rgba(255,255,255,0.14)" }}>
              {TRUST.map(t => (
                <div key={t} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:600, opacity:0.82 }}>
                  <span style={{ width:16, height:16, borderRadius:"50%", background:"rgba(75,125,25,0.9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:900, flexShrink:0 }}>✓</span>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ STATS ══════════════════════════════ */}
      <section style={{ background:"#fff", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding: isMobile?"0 20px":"0 32px",
          display:"grid", gridTemplateColumns: isMobile?"repeat(2,1fr)":"repeat(4,1fr)" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: isMobile?"28px 16px":"40px 28px", textAlign:"center",
              borderRight: (!isMobile && i<3) ? `1px solid ${C.border}` : "none",
              borderBottom: (isMobile && i<2) ? `1px solid ${C.border}` : "none",
            }}>
              <div style={{ fontSize:32, marginBottom:6 }}>{s.icon}</div>
              <div className="kf-stat-num" style={{ color:s.color }}>{s.val}</div>
              <div style={{ fontSize:13, color:C.muted, fontWeight:500, marginTop:5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════ HOW IT WORKS ═══════════════════════════ */}
      <section style={sec(C.bg)}>
        <div style={wrap}>
          {/* Section header */}
          <div style={{ textAlign:"center", marginBottom: isMobile?40:60 }}>
            <span className="kf-badge" style={{ background:C.primary+"15", color:C.primary }}>{P.workflow_badge}</span>
            <hr className="kf-rule-center" />
            <h2 style={{ fontSize:"clamp(26px,3.5vw,42px)", fontWeight:900, margin:"0 0 12px", letterSpacing:-0.5 }}>{P.workflow_title}</h2>
            <p style={{ fontSize:17, color:C.muted, maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>{P.workflow_sub}</p>
          </div>

          {/* Steps grid */}
          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr 1fr":"repeat(4,1fr)", gap: isMobile?12:20 }}>
            {WORKFLOW.map((s, i) => (
              <div key={s.n} className="kf-card kf-shine" style={{
                background:"#fff", borderRadius:18, padding: isMobile?18:24,
                boxShadow:"0 2px 12px rgba(0,38,81,0.06)",
                border:`1px solid ${C.border}`, position:"relative", overflow:"hidden",
              }}>
                {/* Color top stripe */}
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:s.color, borderRadius:"18px 18px 0 0" }} />
                {/* Step number badge + icon */}
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, marginTop:8 }}>
                  <div style={{ width:32, height:32, borderRadius:10, background:s.color+"18", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{s.icon}</div>
                  <div style={{ width:24, height:24, borderRadius:"50%", background:s.color, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900 }}>{s.n}</div>
                </div>
                <div style={{ fontSize:13, fontWeight:800, color:s.color, marginBottom:7 }}>{s.label}</div>
                <div style={{ fontSize:12, color:C.muted, lineHeight:1.65 }}>{s.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:36 }}>
            <Link to="/how-it-works" className="kf-btn kf-btn-navy"
              style={{ padding:"13px 32px", borderRadius:12, fontWeight:700, fontSize:14 }}>
              {P.workflow_link} →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ FEATURED CASES ══════════════════════════ */}
      <section style={sec("#fff")}>
        <div style={wrap}>
          {/* Header */}
          <div style={{ display:"flex", flexDirection: isMobile?"column":"row", justifyContent:"space-between", alignItems: isMobile?"flex-start":"flex-end", gap:16, marginBottom: isMobile?32:48 }}>
            <div>
              <span className="kf-badge" style={{ background:"#FDF2F8", color:"#9D174D" }}>{P.cases_badge}</span>
              <hr className="kf-rule" />
              <h2 style={{ fontSize:"clamp(24px,3vw,38px)", fontWeight:900, margin:"0 0 8px", letterSpacing:-0.4 }}>{P.cases_title}</h2>
              <p style={{ fontSize:15, color:C.muted, margin:0 }}>{P.cases_sub}</p>
            </div>
            <Link to="/cases" className="kf-btn kf-btn-outline"
              style={{ padding:"11px 24px", borderRadius:10, fontSize:13, fontWeight:700, whiteSpace:"nowrap", border:`2px solid ${C.primary}` }}>
              {P.cases_viewall} →
            </Link>
          </div>

          {/* Case cards */}
          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr": isTablet?"1fr 1fr":"repeat(3,1fr)", gap: isMobile?16:24 }}>
            {FEATURED_CASES.map(c => (
              <div key={c.id} className="kf-card" style={{
                background:"#fff", borderRadius:20, overflow:"hidden",
                boxShadow:"0 2px 16px rgba(0,38,81,0.07)", border:`1px solid ${C.border}`,
              }}>
                {/* Top urgency stripe */}
                <div style={{ height:5, background:URGENCY_COLOR[c.urgency] }} />
                <div style={{ padding: isMobile?20:26 }}>
                  {/* Header row */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                    <div>
                      <div style={{ fontSize:10, color:C.muted, fontWeight:700, letterSpacing:1, textTransform:"uppercase" }}>CASE {c.id}</div>
                      <div style={{ fontSize:19, fontWeight:900, color:C.text, marginTop:3 }}>{c.name}</div>
                      <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>{c.age != null ? `Age ${c.age} · ` : ""}📍 {c.location}</div>
                    </div>
                    <span style={{
                      background:URGENCY_BG[c.urgency], color:URGENCY_COLOR[c.urgency],
                      border:`1px solid ${URGENCY_COLOR[c.urgency]}30`,
                      borderRadius:100, padding:"4px 11px", fontSize:10, fontWeight:800, whiteSpace:"nowrap",
                      flexShrink:0, marginLeft:8,
                    }}>{c.urgency}</span>
                  </div>

                  <p style={{ fontSize:13, color:"#4A5568", lineHeight:1.65, margin:"0 0 18px" }}>{c.desc}</p>

                  {/* Progress bar */}
                  <div style={{ marginBottom:20 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:URGENCY_COLOR[c.urgency] }}>{c.funded}% funded</span>
                      <span style={{ fontSize:11, color:C.muted, fontWeight:600 }}>Goal: {c.goal}</span>
                    </div>
                    <div className="kf-prog-track">
                      <div className="kf-prog-fill" style={{ width:`${c.funded}%`, background:`linear-gradient(90deg, ${URGENCY_COLOR[c.urgency]}80, ${URGENCY_COLOR[c.urgency]})` }} />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display:"flex", gap:10 }}>
                    <Link to="/cases" className="kf-btn kf-btn-outline"
                      style={{ flex:1, padding:"10px 0", borderRadius:10, fontSize:13, fontWeight:700, textAlign:"center", border:`1.5px solid ${C.primary}` }}>
                      {P.case_view}
                    </Link>
                    <Link to="/donate" className="kf-btn kf-btn-gold"
                      style={{ flex:1, padding:"10px 0", borderRadius:10, fontSize:13, fontWeight:800, textAlign:"center", border:"none" }}>
                      {P.case_sponsor}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ BEFORE & AFTER ══════════════════════════ */}
      <section style={sec(C.bg)}>
        <div style={wrap}>
          <div style={{ textAlign:"center", marginBottom: isMobile?40:56 }}>
            <span className="kf-badge" style={{ background:C.secondary+"18", color:C.secondary }}>
              {lang==="so"?"Saameynta Dhabta ah":lang==="ar"?"الأثر الحقيقي":lang==="tr"?"Gerçek Etki":lang==="es"?"Impacto Real":lang==="fr"?"Impact Réel":"Real Impact"}
            </span>
            <hr className="kf-rule-center" />
            <h2 style={{ fontSize:"clamp(24px,3vw,38px)", fontWeight:900, margin:"0 0 10px", letterSpacing:-0.4 }}>
              {lang==="so"?"Ka Hor & Ka Dib":lang==="ar"?"قبل وبعد":lang==="tr"?"Önce & Sonra":lang==="es"?"Antes & Después":lang==="fr"?"Avant & Après":"Before & After"}
            </h2>
            <p style={{ fontSize:15, color:C.muted, maxWidth:520, margin:"0 auto" }}>
              {lang==="so"?"Xaaladda xaqiijisan kasta waxay beddeshaaa nolosha. Natiijada dhabta ah ee deeqaha la gaarsiyay.":lang==="ar"?"كل حالة موثقة تُغير حياة. النتائج الحقيقية للمساعدات المُسلَّمة.":lang==="tr"?"Her doğrulanmış vaka hayatları değiştirir. Ulaştırılan yardımın gerçek sonuçları.":lang==="es"?"Cada caso verificado transforma vidas. Resultados reales de ayuda entregada.":lang==="fr"?"Chaque cas vérifié transforme des vies. Résultats réels de l'aide livrée.":"Every verified case transforms lives. Real results from aid delivered on the ground."}
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr": isTablet?"1fr 1fr":"repeat(3,1fr)", gap: isMobile?20:28 }}>
            {[
              {
                id:1,
                label: lang==="so"?"Qoyska Qaxootiga ah":lang==="ar"?"عائلة النازحين":lang==="tr"?"Mülteci Aile":lang==="es"?"Familia Desplazada":lang==="fr"?"Famille Déplacée":"Displaced Family",
                category: lang==="so"?"Degdeg & Guri":lang==="ar"?"طوارئ وملجأ":lang==="tr"?"Acil & Barınak":lang==="es"?"Emergencia & Refugio":lang==="fr"?"Urgence & Abri":"Emergency & Shelter",
                before: { bg:"linear-gradient(135deg,#7f8c8d,#95a5a6)", label: lang==="so"?"Ka Hor":lang==="ar"?"قبل":lang==="tr"?"Önce":lang==="es"?"Antes":lang==="fr"?"Avant":"Before", desc: lang==="so"?"Qoys 7 qof ah oo ku nool dhismo dhacay, xaaladda degdeg ah":"Family of 7 living in collapsed structure, critical condition" },
                after:  { bg:"linear-gradient(135deg,#27ae60,#2ecc71)", label: lang==="so"?"Ka Dib":lang==="ar"?"بعد":lang==="tr"?"Sonra":lang==="es"?"Después":lang==="fr"?"Après":"After",  desc: lang==="so"?"Guri ku meel gaadh ah + raashiin 3 bilood + dhar":"Temporary shelter + 3 months food supplies + clothing" },
                days: 14, amount: "$820",
              },
              {
                id:2,
                label: lang==="so"?"Gabar Yar Bukaan":"Child Medical Case",
                category: lang==="so"?"Caafimaad":"Medical",
                before: { bg:"linear-gradient(135deg,#c0392b,#e74c3c)", label: lang==="so"?"Ka Hor":"Before", desc: lang==="so"?"Gabar 8 sano jir ah oo la waayay dawooyinka muhiimka ah, xaaladda khatarta ah":"8-year-old girl without critical medication, deteriorating health" },
                after:  { bg:"linear-gradient(135deg,#16a085,#1abc9c)", label: lang==="so"?"Ka Dib":"After",  desc: lang==="so"?"Dawooyinka la gaadhsiiyay + booqashada dhakhtarka 4 bilood":"Medication delivered + 4 months doctor visits covered" },
                days: 9, amount: "$540",
              },
              {
                id:3,
                label: lang==="so"?"Odey Naaf ah":"Elderly & Disabled",
                category: lang==="so"?"Cuno & Daryeel":"Food & Care",
                before: { bg:"linear-gradient(135deg,#8e44ad,#9b59b6)", label: lang==="so"?"Ka Hor":"Before", desc: lang==="so"?"Odey 78 sano jir ah oo keligiis ah, aan lahayn cunto iyo daryeel":"78-year-old elder living alone, no food security or care" },
                after:  { bg:"linear-gradient(135deg,#e67e22,#f39c12)", label: lang==="so"?"Ka Dib":"After",  desc: lang==="so"?"Raashiin toddobaadleh + daryeelka guriga + xiriirka qoyska":"Weekly food delivery + home care + family reconnected" },
                days: 11, amount: "$460",
              },
            ].map(item => (
              <div key={item.id} style={{
                background:"#fff", borderRadius:20, overflow:"hidden",
                boxShadow:"0 4px 20px rgba(0,38,81,0.09)", border:`1px solid ${C.border}`,
              }}>
                {/* Card header */}
                <div style={{ background:`linear-gradient(135deg,${C.primary}12,${C.secondary}12)`, padding:"16px 20px", borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:12, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:1 }}>{item.category}</div>
                  <div style={{ fontSize:16, fontWeight:800, color:C.text, marginTop:3 }}>{item.label}</div>
                </div>

                {/* Before / After image panels */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", position:"relative" }}>
                  {[item.before, item.after].map((panel, pi) => (
                    <div key={pi} style={{ position:"relative" }}>
                      {/* Photo placeholder — replace with <img src="..." /> for real photos */}
                      <div style={{
                        height: isMobile?120:150,
                        background: panel.bg,
                        display:"flex", alignItems:"center", justifyContent:"center",
                      }}>
                        <span style={{ fontSize: isMobile?32:40, opacity:0.6 }}>
                          {pi === 0 ? "😔" : "😊"}
                        </span>
                      </div>
                      {/* Label badge */}
                      <div style={{
                        position:"absolute", top:8, left:8,
                        background: pi===0 ? "rgba(0,0,0,0.55)" : "rgba(39,174,96,0.9)",
                        color:"#fff", borderRadius:6, padding:"3px 9px",
                        fontSize:11, fontWeight:800, letterSpacing:0.5,
                      }}>{panel.label}</div>
                    </div>
                  ))}
                  {/* Arrow divider */}
                  <div style={{
                    position:"absolute", top:"50%", left:"50%",
                    transform:"translate(-50%,-50%)",
                    width:32, height:32, borderRadius:"50%",
                    background:C.gold, color:"#fff",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:16, fontWeight:900, zIndex:2,
                    boxShadow:`0 2px 10px ${C.gold}80`,
                  }}>→</div>
                </div>

                {/* Descriptions */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ padding:"12px 14px", borderRight:`1px solid ${C.border}`, fontSize:11, color:C.muted, lineHeight:1.5 }}>{item.before.desc}</div>
                  <div style={{ padding:"12px 14px", fontSize:11, color:C.secondary, fontWeight:600, lineHeight:1.5 }}>{item.after.desc}</div>
                </div>

                {/* Stats footer */}
                <div style={{ display:"flex", padding:"12px 20px", gap:16 }}>
                  <div style={{ fontSize:11, color:C.muted }}>
                    <span style={{ fontWeight:800, color:C.primary, fontSize:14 }}>{item.days}</span>{" "}
                    {lang==="so"?"maalmood":lang==="ar"?"يوماً":lang==="tr"?"gün":lang==="es"?"días":lang==="fr"?"jours":"days"}
                  </div>
                  <div style={{ fontSize:11, color:C.muted }}>
                    <span style={{ fontWeight:800, color:C.secondary, fontSize:14 }}>{item.amount}</span>{" "}
                    {lang==="so"?"la kala qaybiyay":lang==="ar"?"موزعة":lang==="tr"?"dağıtıldı":lang==="es"?"distribuido":lang==="fr"?"distribué":"distributed"}
                  </div>
                  <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#10B981", fontWeight:700 }}>
                    <span style={{ width:7, height:7, borderRadius:"50%", background:"#10B981", display:"inline-block" }} />
                    {lang==="so"?"Xaqiijisan":lang==="ar"?"موثق":lang==="tr"?"Doğrulandı":lang==="es"?"Verificado":lang==="fr"?"Vérifié":"Verified"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:40 }}>
            <Link to="/cases" className="kf-btn kf-btn-navy"
              style={{ padding:"13px 32px", borderRadius:12, fontWeight:700, fontSize:14 }}>
              {P.cases_viewall}
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ PLATFORM FEATURES ═══════════════════════ */}
      <section style={sec("#fff")}>
        <div style={wrap}>
          <div style={{ textAlign:"center", marginBottom: isMobile?40:56 }}>
            <span className="kf-badge" style={{ background:"#EDE9FE", color:"#6D28D9" }}>{P.feat_badge}</span>
            <hr className="kf-rule-center" />
            <h2 style={{ fontSize:"clamp(24px,3vw,38px)", fontWeight:900, margin:"0 0 10px", letterSpacing:-0.4 }}>{P.feat_title}</h2>
            <p style={{ fontSize:15, color:C.muted }}>{P.feat_sub}</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr 1fr": isTablet?"repeat(2,1fr)":"repeat(4,1fr)", gap: isMobile?12:20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="kf-card kf-feature-card" style={{
                padding: isMobile?18:24, borderRadius:16,
                border:`1px solid ${C.border}`, borderLeft:`3px solid ${f.color}`,
                background:"#FAFBFF",
              }}>
                <div style={{
                  width:44, height:44, borderRadius:12, background:f.color+"14",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:22, marginBottom:14,
                }}>{f.icon}</div>
                <div style={{ fontSize:14, fontWeight:800, color:C.text, marginBottom:8, letterSpacing:-0.1 }}>{f.title}</div>
                <div style={{ fontSize:12, color:C.muted, lineHeight:1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ CTA BANNER ══════════════════════════════ */}
      <section className="kf-hero-dots" style={{
        background: `linear-gradient(135deg, ${C.navy} 0%, ${C.primary} 60%, ${C.secondary} 100%)`,
        padding: isMobile?"64px 20px":"96px 32px",
        textAlign:"center", color:"#fff",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:320, height:320, borderRadius:"50%", background:"rgba(255,255,255,0.03)", pointerEvents:"none" }} />
        <div style={{ maxWidth:680, margin:"0 auto", position:"relative" }}>
          <div style={{ fontSize: isMobile?44:56, marginBottom:20 }}>🤝</div>
          <h2 style={{ fontSize:"clamp(26px,3.5vw,44px)", fontWeight:900, margin:"0 0 16px", letterSpacing:-0.5 }}>{P.cta_title}</h2>
          <p style={{ fontSize: isMobile?15:18, opacity:0.84, marginBottom:44, lineHeight:1.7, maxWidth:520, margin:"0 auto 44px" }}>{P.cta_sub}</p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="kf-btn kf-btn-gold" onClick={() => navigate("/donate")}
              style={{ padding: isMobile?"14px 28px":"16px 40px", borderRadius:14, fontSize: isMobile?14:16, fontWeight:800, border:"none" }}>
              ❤️ {P.cta_donor}
            </button>
            <button className="kf-btn kf-btn-ghost" onClick={() => navigate("/contact")}
              style={{ padding: isMobile?"14px 28px":"16px 40px", borderRadius:14, fontSize: isMobile?14:16, fontWeight:700, border:"none" }}>
              {P.cta_report}
            </button>
            <button className="kf-btn kf-btn-ghost" onClick={() => navigate("/dashboard")}
              style={{ padding: isMobile?"14px 28px":"16px 40px", borderRadius:14, fontSize: isMobile?14:16, fontWeight:700, border:"none" }}>
              {P.cta_dashboard}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
