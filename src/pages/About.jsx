import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext.jsx";
import { PT } from "../translations.js";

const C = { navy: "#002651", primary: "#004B96", secondary: "#4B7D19", accent: "#E0AB21", danger: "#C0392B", muted: "#5A6E8A", bg: "#F4F7FC", border: "#D8E4F0", text: "#0D1F3C", gold: "#E0AB21", green: "#4B7D19", blue: "#004B96" };

const TEAM = [
  { name: "Abdimalik Hassan", role: "Project Lead & CEO",       icon: "👨‍💼", bg: "#DBEAFE", color: "#1D4ED8" },
  { name: "Asha Mohammed",    role: "Product Manager",          icon: "👩‍💼", bg: "#D1FAE5", color: "#065F46" },
  { name: "Fatima Ali",       role: "Design Lead",              icon: "👩‍🎨", bg: "#FCE7F3", color: "#9D174D" },
  { name: "Omar Ibrahim",     role: "Lead Backend Engineer",    icon: "👨‍💻", bg: "#EDE9FE", color: "#5B21B6" },
  { name: "Hodan Warsame",    role: "Field Operations Manager", icon: "👩‍🔬", bg: "#FEF3C7", color: "#92400E" },
  { name: "Mahad Yusuf",      role: "Security & DevOps",        icon: "👨‍🔧", bg: "#FEE2E2", color: "#991B1B" },
];

const MILESTONES = [
  { year: "2025 Q1", done: true  },
  { year: "2025 Q2", done: true  },
  { year: "2025 Q3", done: true  },
  { year: "2025 Q4", done: true  },
  { year: "2026 Q1", done: true  },
  { year: "2026 Q2", done: true  },
  { year: "2026 Q3", done: false },
  { year: "2027",    done: false },
];

export default function About() {
  const { lang } = useLang();
  const P = PT.about[lang] || PT.about.en;

  const MILESTONE_EVENTS = [
    lang === "so" ? "Fikradda mashruuca iyo uruurinta shuruucda"                                         : lang === "ar" ? "مفهوم المشروع وجمع المتطلبات"                                    : lang === "tr" ? "Proje konsepti ve gereksinim toplama"                                           : lang === "es" ? "Concepto del proyecto y recopilación de requisitos"                     : lang === "fr" ? "Concept du projet et collecte des exigences"                                    : "Project concept & requirements gathering",
    lang === "so" ? "Naqshadaynta nidaamka iyo qorshaha xogta"                                           : lang === "ar" ? "تصميم بنية النظام ومخطط قاعدة البيانات"                           : lang === "tr" ? "Sistem mimarisi tasarımı ve veritabanı şeması"                                  : lang === "es" ? "Diseño de arquitectura del sistema y esquema de base de datos"          : lang === "fr" ? "Conception de l'architecture système et schéma de base de données"              : "System architecture design and database schema",
    lang === "so" ? "Horumarinta platform-ka aasaasiga (frontend + backend)"                             : lang === "ar" ? "بدء تطوير المنصة الأساسية (الواجهة الأمامية + الخلفية)"          : lang === "tr" ? "Temel platform geliştirmesi başlıyor (frontend + backend)"                    : lang === "es" ? "Desarrollo de la plataforma principal comienza (frontend + backend)"    : lang === "fr" ? "Développement de la plateforme principale (frontend + backend)"                : "Core platform development begins (frontend + backend)",
    lang === "so" ? "App mobile-ka kooxda goobta + isku-dhafka GPS"                                      : lang === "ar" ? "تطبيق الجوال لفريق الميدان + تكامل GPS"                          : lang === "tr" ? "Saha ekibi mobil uygulaması + GPS entegrasyonu"                                 : lang === "es" ? "App móvil para equipo de campo + integración GPS"                       : lang === "fr" ? "Application mobile équipe terrain + intégration GPS"                           : "Field team mobile app + GPS integration",
    lang === "so" ? "Isku-dhafka boobka lacag-bixinta (Stripe, PayPal, Ama)"                             : lang === "ar" ? "تكامل بوابة الدفع (Stripe وPayPal وAma)"                        : lang === "tr" ? "Ödeme ağ geçidi entegrasyonu (Stripe, PayPal, Ama)"                           : lang === "es" ? "Integración de pasarela de pago (Stripe, PayPal, Ama)"                 : lang === "fr" ? "Intégration de la passerelle de paiement (Stripe, PayPal, Ama)"               : "Payment gateway integration (Stripe, PayPal, Ama)",
    lang === "so" ? "Bilaabista Platform-ka — diyaar u ah waxsoosaarka ✅"                               : lang === "ar" ? "إطلاق المنصة — جاهزة للإنتاج ✅"                                : lang === "tr" ? "Platform lansmanı — üretime hazır ✅"                                           : lang === "es" ? "Lanzamiento de la plataforma — lista para producción ✅"                 : lang === "fr" ? "Lancement de la plateforme — prête pour la production ✅"                      : "Platform launch — production ready ✅",
    lang === "so" ? "Ogeysiisyada SMS/WhatsApp + falanqaynta horumarsan"                                 : lang === "ar" ? "إشعارات SMS/WhatsApp + تحليلات متقدمة"                          : lang === "tr" ? "SMS/WhatsApp bildirimleri + gelişmiş analitik"                                 : lang === "es" ? "Notificaciones SMS/WhatsApp + análisis avanzado"                      : lang === "fr" ? "Notifications SMS/WhatsApp + analytique avancée"                              : "SMS/WhatsApp notifications + advanced analytics",
    lang === "so" ? "AI-ga kala-soocida xaaladda + isku-dhafka xogta UNHCR"                             : lang === "ar" ? "تحديد أولويات الحالات بالذكاء الاصطناعي + تكامل قاعدة بيانات UNHCR": lang === "tr" ? "Yapay zeka vaka önceliklendirme + UNHCR veritabanı entegrasyonu"               : lang === "es" ? "Priorización de casos con IA + integración base de datos UNHCR"        : lang === "fr" ? "Priorisation des cas par IA + intégration base de données UNHCR"              : "AI case prioritization + UNHCR database integration",
  ];

  const VALUES = [
    { icon: "🔍", title: lang === "so" ? "Shafafnaanta"  : lang === "ar" ? "الشفافية"   : lang === "tr" ? "Şeffaflık"    : lang === "es" ? "Transparencia" : lang === "fr" ? "Transparence" : "Transparency",  desc: lang === "so" ? "Xaaladda kasta, macaamiil kastaa, iyo ficil kastaa waxaa lagu duubaa oo la xisaabin karaa. Wax lama qariyaan." : lang === "ar" ? "كل حالة وكل معاملة وكل إجراء مُسجَّل وقابل للتدقيق. لا شيء مخفي." : lang === "tr" ? "Her vaka, her işlem ve her eylem kayıt altında ve denetlenebilir. Hiçbir şey gizli değil." : lang === "es" ? "Cada caso, cada transacción y cada acción está registrada y es auditable. Nada está oculto." : lang === "fr" ? "Chaque cas, chaque transaction et chaque action est enregistré et auditable. Rien n'est caché." : "Every case, every transaction, and every action is logged and auditable. Nothing is hidden." },
    { icon: "🛡️", title: lang === "so" ? "Aaminaad"      : lang === "ar" ? "الثقة"      : lang === "tr" ? "Güven"        : lang === "es" ? "Confianza"     : lang === "fr" ? "Confiance"    : "Trust",         desc: lang === "so" ? "Xaqiijinta dhinacyo badan, ogaanshaha sixitaanka, iyo lacag-bixiyaadka sir ah waxay dhisaan kalsooni deeq-bixiyeyaasha." : lang === "ar" ? "التحقق متعدد الطبقات وكشف الاحتيال والمدفوعات المشفرة تبني ثقة المانحين." : lang === "tr" ? "Çok katmanlı doğrulama, dolandırıcılık tespiti ve şifreli ödemeler bağışçı güvenini inşa eder." : lang === "es" ? "La verificación multicapa, la detección de fraude y los pagos cifrados generan confianza en los donantes." : lang === "fr" ? "La vérification multi-couches, la détection de fraude et les paiements chiffrés renforcent la confiance des donateurs." : "Multi-layer verification, fraud detection, and encrypted payments build donor confidence." },
    { icon: "⚡", title: lang === "so" ? "Hufnaanta"     : lang === "ar" ? "الكفاءة"    : lang === "tr" ? "Verimlilik"   : lang === "es" ? "Eficiencia"    : lang === "fr" ? "Efficacité"   : "Efficiency",    desc: lang === "so" ? "Nidaamka shaqada ee 8-tallaabada wuxuu yaraynayaa shaqada gacanta, dheereynayaa gaarsiinta gargaarka oo samaynayaa caqabadaha." : lang === "ar" ? "سير العمل التلقائي من 8 خطوات يقلل العمل اليدوي ويسرّع توزيع المساعدات ويزيل الاختناقات." : lang === "tr" ? "8 adımlı otomatik iş akışı manuel çalışmayı azaltır, yardım teslimatını hızlandırır ve darboğazları ortadan kaldırır." : lang === "es" ? "El flujo de trabajo automatizado de 8 pasos reduce el trabajo manual, acelera la entrega de ayuda y elimina cuellos de botella." : lang === "fr" ? "Le flux de travail automatisé en 8 étapes réduit le travail manuel, accélère la distribution de l'aide et élimine les goulots d'étranglement." : "8-step automated workflow reduces manual work, speeds up aid delivery and eliminates bottlenecks." },
    { icon: "🌍", title: lang === "so" ? "Saameynta"     : lang === "ar" ? "الأثر"      : lang === "tr" ? "Etki"         : lang === "es" ? "Impacto"       : lang === "fr" ? "Impact"       : "Impact",        desc: lang === "so" ? "Saameynta dunida dhabta ah oo lagu cabiro sawirrada caddaynta-gaarsiinta, xaqiijinta GPS, iyo warbixinnada saameynta." : lang === "ar" ? "تأثير حقيقي يُقاس بصور دليل التسليم والتحقق عبر GPS وتقارير التأثير." : lang === "tr" ? "Teslimat kanıt fotoğrafları, GPS doğrulama ve etki raporları ile ölçülen gerçek dünya etkisi." : lang === "es" ? "Impacto en el mundo real medido con fotos de prueba de entrega, verificación GPS e informes de impacto." : lang === "fr" ? "Impact réel mesuré avec des photos de preuve de livraison, la vérification GPS et des rapports d'impact." : "Real-world impact measured with proof-of-delivery photos, GPS verification, and impact reports." },
    { icon: "🤝", title: lang === "so" ? "Iskaashiga"    : lang === "ar" ? "التعاون"    : lang === "tr" ? "İşbirliği"    : lang === "es" ? "Colaboración"  : lang === "fr" ? "Collaboration": "Collaboration",  desc: lang === "so" ? "Xidid warbixiyeyaasha, kooxaha goobta, deeq-bixiyeyaasha, iyo maamulayaasha hal platform oo toosan." : lang === "ar" ? "ربط المراسلين وفرق الميدان والمانحين والمديرين في منصة واحدة متكاملة." : lang === "tr" ? "Muhabirler, saha ekipleri, bağışçılar ve yöneticileri tek bir platformda birbirine bağlar." : lang === "es" ? "Conectando reporteros, equipos de campo, donantes y administradores en una plataforma sin interrupciones." : lang === "fr" ? "Connecter les rapporteurs, les équipes de terrain, les donateurs et les administrateurs sur une seule plateforme." : "Connecting reporters, field teams, donors, and administrators in one seamless platform." },
    { icon: "📱", title: lang === "so" ? "Helitaan"      : lang === "ar" ? "إمكانية الوصول" : lang === "tr" ? "Erişilebilirlik" : lang === "es" ? "Accesibilidad" : lang === "fr" ? "Accessibilité" : "Accessibility", desc: lang === "so" ? "Web, mobile, iyo waxqabadka la'aanta internet — wuxuu u shaqeeyaa xaaladaha xiriirka yar ee goobta." : lang === "ar" ? "ويب وجوال ويعمل دون إنترنت — يعمل في بيئات منخفضة الاتصال في الميدان." : lang === "tr" ? "Web, mobil ve çevrimdışı yetenekli — sahada düşük bağlantılı ortamlarda çalışır." : lang === "es" ? "Web, móvil y con capacidad offline — funciona en entornos de baja conectividad en el campo." : lang === "fr" ? "Web, mobile et hors ligne — fonctionne dans des environnements à faible connectivité sur le terrain." : "Web, mobile, and offline-capable — works in low-connectivity environments in the field." },
  ];

  const PROBLEMS = [
    { icon: "🚨", title: lang === "so" ? "Sixitaanka & Laba Jibbaarka"  : lang === "ar" ? "الاحتيال والازدواجية"   : lang === "tr" ? "Dolandırıcılık ve Tekrarlar" : lang === "es" ? "Fraude y Duplicados"    : lang === "fr" ? "Fraude et Doublons"         : "Fraud & Duplicates",    desc: lang === "so" ? "Xaaladaha been abuur ah iyo codsiyada laba jibbaaran ayaa miisaaniyatka gargaarka mariya. Xaqiijin la'aantii, kheyraadku wuxuu u tagaa dadka khaldan." : lang === "ar" ? "الحالات المزيفة والطلبات المكررة تستنزف ميزانيات المساعدات. بدون تحقق، تذهب الموارد للأشخاص الخطأ." : lang === "tr" ? "Sahte vakalar ve mükerrer başvurular yardım bütçelerini tüketir. Doğrulama olmadan kaynaklar yanlış kişilere gider." : lang === "es" ? "Los casos falsos y las solicitudes duplicadas agotan los presupuestos de ayuda. Sin verificación, los recursos van a las personas equivocadas." : lang === "fr" ? "Les faux cas et les demandes en double épuisent les budgets d'aide. Sans vérification, les ressources vont aux mauvaises personnes." : "Fake cases and duplicate applications drain aid budgets. Without verification, resources go to the wrong people.", color: "#C0392B", bg: "#FEF2F2" },
    { icon: "🌫️", title: lang === "so" ? "Shafafnaan La'aan"            : lang === "ar" ? "غياب الشفافية"         : lang === "tr" ? "Şeffaflık Yok"             : lang === "es" ? "Sin Transparencia"    : lang === "fr" ? "Aucune Transparence"       : "No Transparency",       desc: lang === "so" ? "Deeq-bixiyeyaashu ma heli karaan hab ay ku xaqiijiyaan lacagtoodu inay gaartay faa'iideyaasha. Kalsoonigu wuu baxaa, deeqahuna wey yaraadaan." : lang === "ar" ? "لا توجد طريقة للمانحين للتحقق من وصول أموالهم للمستفيدين. تتآكل الثقة وتتراجع التبرعات." : lang === "tr" ? "Bağışçıların paralarının yararlanıcılara ulaştığını doğrulamanın yolu yok. Güven azalır, bağışlar düşer." : lang === "es" ? "Los donantes no tienen forma de verificar que su dinero llegó a los beneficiarios. La confianza se erosiona, las donaciones disminuyen." : lang === "fr" ? "Les donateurs n'ont aucun moyen de vérifier que leur argent a atteint les bénéficiaires. La confiance s'érode, les dons diminuent." : "Donors have no way to verify their money reached beneficiaries. Trust erodes, donations decline.", color: "#F59E0B", bg: "#FFFBEB" },
    { icon: "🐢", title: lang === "so" ? "Hababka Gacanta Gaabiska ah"  : lang === "ar" ? "إجراءات يدوية بطيئة"   : lang === "tr" ? "Yavaş Manuel Süreçler"    : lang === "es" ? "Procesos Manuales Lentos": lang === "fr" ? "Processus Manuels Lents"    : "Slow Manual Processes",  desc: lang === "so" ? "Nidaamyada warqadda ku salaysan ama kala goosan ayaa tardiya gaarsiinta gargaarka. Xaaladaha ayaa istaagayaan safaf todobaadyo badan iyagoon u baahnayn." : lang === "ar" ? "الأنظمة الورقية أو المنفصلة تبطئ توزيع المساعدات. تقبع الحالات في قوائم الانتظار أسابيع دون داعٍ." : lang === "tr" ? "Kağıt tabanlı veya bağlantısız sistemler yardım dağıtımını yavaşlatır. Vakalar gereksiz yere haftalarca kuyruklarda bekler." : lang === "es" ? "Los sistemas basados en papel o desconectados ralentizan la entrega de ayuda. Los casos se quedan en colas durante semanas innecesariamente." : lang === "fr" ? "Les systèmes papier ou déconnectés ralentissent la distribution de l'aide. Les cas restent dans des files d'attente pendant des semaines inutilement." : "Paper-based or disconnected systems slow down aid delivery. Cases sit in queues for weeks unnecessarily.", color: "#8B5CF6", bg: "#F5F3FF" },
  ];

  const MISSION_STATS = [
    { icon: "📋", val: lang === "so" ? "8 Tallaabo" : lang === "ar" ? "8 خطوات" : lang === "tr" ? "8 Adım" : lang === "es" ? "8 Pasos" : lang === "fr" ? "8 Étapes" : "8 Steps",     label: P.stat_steps,    color: C.primary },
    { icon: "👥", val: lang === "so" ? "5 Door"     : lang === "ar" ? "5 أدوار" : lang === "tr" ? "5 Rol"  : lang === "es" ? "5 Roles" : lang === "fr" ? "5 Rôles"  : "5 Roles",     label: P.stat_roles,    color: "#8B5CF6" },
    { icon: "🔐", val: "100%",                                                                                                                                                          label: P.stat_enc,      color: C.secondary },
    { icon: "📊", val: lang === "so" ? "Wakhtiga Dhabta" : lang === "ar" ? "فوري" : lang === "tr" ? "Gerçek Zamanlı" : lang === "es" ? "Tiempo Real" : lang === "fr" ? "Temps Réel" : "Real-time", label: P.stat_realtime, color: C.accent },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#0D1F3C" }}>

      {/* Hero */}
      <section className="kf-hero-dots" style={{ background:`linear-gradient(145deg, ${C.navy}, ${C.primary} 60%, ${C.secondary})`, color:"#fff", padding:"92px 24px 72px", textAlign:"center" }}>
        <div style={{ maxWidth:760, margin:"0 auto" }}>
          <span className="kf-badge" style={{ background:"rgba(255,255,255,.14)", border:"1px solid rgba(255,255,255,.24)", color:"#fff" }}>{P.hero_badge}</span>
          <h1 style={{ fontSize:"clamp(30px,5vw,52px)", fontWeight:900, margin:"20px 0 16px", lineHeight:1.1, letterSpacing:-1 }}>
            {P.hero_title} <span style={{ color:C.accent }}>{P.hero_title2}</span>
          </h1>
          <p style={{ fontSize:17, opacity:0.84, lineHeight:1.8, maxWidth:580, margin:"0 auto" }}>{P.hero_sub}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding:"80px 24px", background:"#fff" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:48, alignItems:"center" }}>
          <div>
            <span className="kf-badge" style={{ background:C.primary+"15", color:C.primary }}>{P.mission_badge}</span>
            <hr className="kf-rule" />
            <h2 style={{ fontSize:"clamp(24px,3.5vw,38px)", fontWeight:900, margin:"0 0 16px", lineHeight:1.2, letterSpacing:-0.5 }}>{P.mission_title}</h2>
            <p style={{ fontSize:16, color:C.muted, lineHeight:1.8, marginBottom:16 }}>{P.mission_p1}</p>
            <p style={{ fontSize:16, color:C.muted, lineHeight:1.8 }}>{P.mission_p2}</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {MISSION_STATS.map(s => (
              <div key={s.label} className="kf-card" style={{ background:C.bg, borderRadius:18, padding:24, textAlign:"center", border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:30, marginBottom:8 }}>{s.icon}</div>
                <div style={{ fontSize:22, fontWeight:900, color:s.color, letterSpacing:-0.5 }}>{s.val}</div>
                <div style={{ fontSize:12, color:C.muted, marginTop:5, fontWeight:500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section style={{ padding:"80px 24px", background:C.bg }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <span className="kf-badge" style={{ background:"#FEE2E2", color:"#991B1B" }}>{P.prob_badge}</span>
            <hr className="kf-rule-center" />
            <h2 style={{ fontSize:"clamp(24px,3.5vw,40px)", fontWeight:900, margin:"0 0 10px", letterSpacing:-0.5 }}>{P.prob_title}</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:24 }}>
            {PROBLEMS.map(p => (
              <div key={p.title} className="kf-card" style={{ background:"#fff", borderRadius:20, padding:32, border:`1px solid ${C.border}`, boxShadow:"0 2px 12px rgba(0,0,0,.04)", borderTop:`3px solid ${p.color}` }}>
                <div style={{ width:54, height:54, borderRadius:16, background:p.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, marginBottom:18 }}>{p.icon}</div>
                <div style={{ fontSize:16, fontWeight:800, color:p.color, marginBottom:10 }}>{p.title}</div>
                <div style={{ fontSize:14, color:C.muted, lineHeight:1.7 }}>{p.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:44 }}>
            <div className="kf-shine" style={{ display:"inline-block", background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, borderRadius:20, padding:"30px 52px", color:"#fff", maxWidth:700 }}>
              <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
              <div style={{ fontSize:20, fontWeight:900, marginBottom:10 }}>{P.prob_solve}</div>
              <div style={{ fontSize:15, opacity:0.88, lineHeight:1.7 }}>{P.prob_solve_sub}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding:"80px 24px", background:"#fff" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <h2 style={{ fontSize:"clamp(24px,3.5vw,40px)", fontWeight:900, margin:"0 0 10px", letterSpacing:-0.5 }}>{P.values_title}</h2>
            <hr className="kf-rule-center" />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
            {VALUES.map((v, i) => (
              <div key={i} className="kf-card kf-feature-card" style={{ padding:26, borderRadius:16, border:`1px solid ${C.border}`, borderLeft:`3px solid ${C.primary}`, background:"#FAFBFF", display:"flex", gap:16 }}>
                <div style={{ fontSize:28, flexShrink:0 }}>{v.icon}</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:800, marginBottom:8 }}>{v.title}</div>
                  <div style={{ fontSize:13, color:C.muted, lineHeight:1.65 }}>{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section style={{ padding:"80px 24px", background:C.bg }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <h2 style={{ fontSize:"clamp(24px,3.5vw,40px)", fontWeight:900, margin:"0 0 10px", letterSpacing:-0.5 }}>{P.road_title}</h2>
            <hr className="kf-rule-center" />
            <p style={{ fontSize:16, color:C.muted }}>{P.road_sub}</p>
          </div>
          {MILESTONES.map((m, i) => (
            <div key={i} style={{ display:"flex", gap:20, marginBottom:20, alignItems:"flex-start" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0, width:40 }}>
                <div style={{
                  width:24, height:24, borderRadius:"50%",
                  background: m.done ? C.secondary : "#D1D5DB",
                  border:"3px solid #fff",
                  boxShadow:`0 0 0 2px ${m.done ? C.secondary : "#D1D5DB"}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  {m.done && <span style={{ color:"#fff", fontSize:9, fontWeight:900 }}>✓</span>}
                </div>
                {i < MILESTONES.length-1 && <div style={{ width:2, height:28, background: m.done ? C.secondary+"50" : "#E5E7EB", marginTop:6 }} />}
              </div>
              <div style={{ background:"#fff", borderRadius:14, padding:"14px 22px", flex:1, border:`1px solid ${C.border}`, opacity: m.done?1:0.5, boxShadow: m.done?"0 2px 8px rgba(0,38,81,0.05)":"none" }}>
                <span style={{ background: m.done?"#D1FAE5":"#F3F4F6", color: m.done?"#065F46":C.muted, borderRadius:100, padding:"3px 11px", fontSize:11, fontWeight:700 }}>{m.year}</span>
                <div style={{ fontSize:14, fontWeight: m.done?700:500, color: m.done?C.text:C.muted, marginTop:8 }}>{MILESTONE_EVENTS[i]}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ padding:"80px 24px", background:"#fff" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <h2 style={{ fontSize:"clamp(24px,3.5vw,40px)", fontWeight:900, margin:"0 0 10px", letterSpacing:-0.5 }}>{P.team_title}</h2>
            <hr className="kf-rule-center" />
            <p style={{ fontSize:16, color:C.muted }}>{P.team_sub}</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:22 }}>
            {TEAM.map((t, i) => (
              <div key={i} className="kf-card" style={{ textAlign:"center", padding:32, background:"#FAFBFF", borderRadius:20, border:`1px solid ${C.border}` }}>
                <div style={{ width:72, height:72, borderRadius:"50%", background:t.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, margin:"0 auto 16px", boxShadow:`0 4px 16px ${t.color}22` }}>{t.icon}</div>
                <div style={{ fontSize:15, fontWeight:800, color:C.text }}>{t.name}</div>
                <div style={{ fontSize:12, color:t.color, fontWeight:700, marginTop:4 }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="kf-hero-dots" style={{ background:`linear-gradient(135deg, ${C.navy}, ${C.primary} 60%, ${C.secondary})`, padding:"72px 24px", textAlign:"center", color:"#fff" }}>
        <h2 style={{ fontSize:"clamp(24px,3.5vw,40px)", fontWeight:900, margin:"0 0 16px", letterSpacing:-0.5 }}>{P.cta_title}</h2>
        <p style={{ fontSize:17, opacity:0.84, marginBottom:36, maxWidth:480, margin:"0 auto 36px", lineHeight:1.7 }}>{P.cta_sub}</p>
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <Link to="/donate"  className="kf-btn kf-btn-gold"  style={{ padding:"14px 34px", borderRadius:12, fontWeight:800, fontSize:15 }}>{P.cta_donor}</Link>
          <Link to="/contact" className="kf-btn kf-btn-ghost" style={{ padding:"14px 34px", borderRadius:12, fontWeight:700, fontSize:15 }}>{P.cta_contact}</Link>
        </div>
      </section>
    </div>
  );
}
