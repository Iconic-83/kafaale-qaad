import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext.jsx";
import { PT } from "../translations.js";

const C = { navy: "#002651", primary: "#004B96", secondary: "#4B7D19", accent: "#E0AB21", danger: "#C0392B", muted: "#5A6E8A", bg: "#F4F7FC", border: "#D8E4F0", text: "#0D1F3C", gold: "#E0AB21", green: "#4B7D19", blue: "#004B96" };

export default function HowItWorks() {
  const { lang } = useLang();
  const P = PT.howitworks[lang] || PT.howitworks.en;

  const STEPS = [
    {
      n: 1, icon: "📝", color: "#3B82F6",
      label:  lang==="so"?"Abuurista Warbixinta"    :lang==="ar"?"إنشاء التقرير"        :lang==="tr"?"Rapor Oluşturma"       :lang==="es"?"Creación del Reporte"  :lang==="fr"?"Création du Rapport"    :"Report Creation",
      status: lang==="so"?"Sugaysa Xaqiijinta"      :lang==="ar"?"في انتظار التحقق"     :lang==="tr"?"Doğrulama Bekliyor"    :lang==="es"?"Pendiente Verificación" :lang==="fr"?"En Attente Vérification":"Pending Verification",
      who:    lang==="so"?"La Fiiriyo / Warbixiye"  :lang==="ar"?"مراقب / مراسل"        :lang==="tr"?"Gözlemci / Muhabir"    :lang==="es"?"Observador / Reportero" :lang==="fr"?"Observateur / Rapporteur":"Observer / Reporter",
      detail: lang==="so"?"Warbixiye (xubinta bulshada ama shaqaale NGO) wuxuu soo gudbiyaa xaalad iyada oo ah web ama app mobile. Waxay buuxiyaan magaca faa'iideyaha, da'da, goobta, heerka deg-degga, sharraxaadda xaaladda, oo soo raraan sawirro."
             :lang==="ar"?"يقدم المُبلِّغ (عضو مجتمعي أو عامل إغاثة) حالة عبر الويب أو التطبيق. يملأون اسم المستفيد والعمر والموقع ومستوى الإلحاح ووصف الوضع ويرفعون الصور."
             :lang==="tr"?"Bir muhabir (toplum üyesi veya STK çalışanı) web veya mobil uygulama üzerinden vaka gönderir. Yararlanıcının adını, yaşını, konumunu, aciliyet düzeyini, durumun açıklamasını doldurur ve fotoğraf yükler."
             :lang==="es"?"Un reportero (miembro de la comunidad o trabajador de ONG) envía un caso a través de la web o la app. Completan el nombre del beneficiario, edad, ubicación, nivel de urgencia, descripción y suben fotos."
             :lang==="fr"?"Un rapporteur (membre de la communauté ou travailleur d'ONG) soumet un cas via le web ou l'application. Il remplit le nom du bénéficiaire, l'âge, le lieu, le niveau d'urgence, une description et télécharge des photos."
             :"A reporter (community member or NGO worker) submits a case through the web or mobile app. They fill in the beneficiary's name, age, location, urgency level, a description of the situation, and upload photos.",
      actions: lang==="so"?["Buuxi faahfaahinta faa'iideyaha","Soo rar sawirrada taageerada","Deji heerka deg-degga","Soo gudbi — xaaladda xaaladda: Sugaysa Xaqiijinta"]
              :lang==="ar"?["ملء تفاصيل المستفيد","رفع الصور الداعمة","تحديد مستوى الإلحاح","التقديم — حالة الحالة: في انتظار التحقق"]
              :lang==="tr"?["Yararlanıcı bilgilerini doldurun","Destekleyici fotoğraflar yükleyin","Aciliyet düzeyini belirleyin","Gönderin — vaka durumu: Doğrulama Bekliyor"]
              :lang==="es"?["Completar detalles del beneficiario","Subir fotos de apoyo","Establecer nivel de urgencia","Enviar — estado del caso: Pendiente Verificación"]
              :lang==="fr"?["Remplir les détails du bénéficiaire","Télécharger des photos justificatives","Définir le niveau d'urgence","Soumettre — statut du cas: En Attente Vérification"]
              :["Fill in beneficiary details","Upload supporting photos","Set urgency level","Submit — case status: Pending Verification"],
    },
    {
      n: 2, icon: "🏛️", color: "#8B5CF6",
      label:  lang==="so"?"Xafiiska Xaqiijinta"   :lang==="ar"?"مكتب التحقق"           :lang==="tr"?"Doğrulama Ofisi"       :lang==="es"?"Oficina de Verificación":lang==="fr"?"Bureau de Vérification"  :"Verification Office",
      status: lang==="so"?"La Dib u Eegayo"       :lang==="ar"?"قيد المراجعة"           :lang==="tr"?"İnceleniyor"            :lang==="es"?"En Revisión"            :lang==="fr"?"En Cours d'Examen"       :"Under Review",
      who:    lang==="so"?"Saraakiisha Xaqiijinta" :lang==="ar"?"ضابط التحقق"            :lang==="tr"?"Doğrulama Subayı"      :lang==="es"?"Oficial de Verificación":lang==="fr"?"Officier de Vérification":"Verification Officer",
      detail: lang==="so"?"Saraakiisha xaqiijinta waxay dib u eegayaan warbixinta la soo gudbiyay si ay u hubiyaan buuxnaanteeda iyo saxnaanteeda. Waxay hubiyaan xaaladaha laba jibbaaran, dib u eegayaan sawirrada, waxayna go'aaminayaan in la ansixiyo ama la diiyo xaaladda."
             :lang==="ar"?"يراجع ضابط التحقق التقرير المقدم للتحقق من اكتماله وشرعيته. يتحققون من الحالات المكررة ويراجعون الصور ويقررون الموافقة أو الرفض."
             :lang==="tr"?"Bir doğrulama subayı, eksiksizlik ve meşruiyet açısından gönderilen raporu inceler. Mükerrer vakaları kontrol eder, fotoğrafları inceler ve vakayı onaylamak ya da reddetmek için karar verir."
             :lang==="es"?"Un oficial de verificación revisa el reporte enviado para verificar su integridad y legitimidad. Comprueban duplicados, revisan fotos y deciden aprobar o rechazar el caso."
             :lang==="fr"?"Un officier de vérification examine le rapport soumis pour en vérifier l'exhaustivité et la légitimité. Il vérifie les doublons, examine les photos et décide d'approuver ou de rejeter le cas."
             :"A verification officer reviews the submitted report for completeness and legitimacy. They check for duplicate cases, review photos, and decide whether to approve or reject the case.",
      actions: lang==="so"?["Dib u eeg faahfaahinta warbixinta iyo sawirrada","Hubi laba jibbaarka (AI-ga la caawiyay)","Ansix → xilsaari koox goobta","Diid → kayd sabab leh"]
              :lang==="ar"?["مراجعة تفاصيل التقرير والصور","التحقق من الازدواجية (مدعوم بالذكاء الاصطناعي)","الموافقة ← تعيين فريق ميداني","الرفض ← أرشفة مع سبب"]
              :lang==="tr"?["Rapor ayrıntılarını ve fotoğrafları inceleyin","Tekrar kontrol edin (Yapay zeka destekli)","Onayla → saha ekibi ata","Reddet → gerekçesiyle arşivle"]
              :lang==="es"?["Revisar detalles del reporte y fotos","Verificar duplicados (asistido por IA)","Aprobar → asignar equipo de campo","Rechazar → archivar con razón"]
              :lang==="fr"?["Examiner les détails du rapport et les photos","Vérifier les doublons (assisté par IA)","Approuver → assigner une équipe terrain","Rejeter → archiver avec motif"]
              :["Review report details and photos","Check for duplicates (AI-assisted)","Approve → assign a field team","Reject → archive with reason"],
    },
    {
      n: 3, icon: "🔍", color: "#F59E0B",
      label:  lang==="so"?"Baarista Goobta"       :lang==="ar"?"التحقيق الميداني"      :lang==="tr"?"Saha Soruşturması"     :lang==="es"?"Investigación de Campo" :lang==="fr"?"Enquête de Terrain"       :"Field Investigation",
      status: lang==="so"?"La Baarinaayo"         :lang==="ar"?"جارٍ التحقيق"           :lang==="tr"?"Araştırılıyor"          :lang==="es"?"Investigando"            :lang==="fr"?"En Cours d'Investigation" :"Investigating",
      who:    lang==="so"?"Xubinta Kooxda Goobta" :lang==="ar"?"عضو الفريق الميداني"   :lang==="tr"?"Saha Ekibi Üyesi"      :lang==="es"?"Miembro Equipo de Campo" :lang==="fr"?"Membre Équipe de Terrain" :"Field Team Member",
      detail: lang==="so"?"Xubinta kooxda goobta ee loo xilsaaray waxay ku socodsiisaa goobta adeegsanaysa socodsiinta GPS. Waxay si jireed u xaqiijinayaan xaaladda, u wareysanayaan faa'iideyaha, qaadanayaan sawirro/muuqaallo caddayn ahaan, oo soo raraan natiijooyinkooda."
             :lang==="ar"?"ينتقل عضو الفريق الميداني المكلف إلى الموقع عبر ملاحة GPS. يتحقق فيزيائيًا من الوضع ويجري مقابلات مع المستفيد ويلتقط صورًا/مقاطع فيديو كدليل ويسجل نتائجه."
             :lang==="tr"?"Atanan saha ekibi üyesi, GPS navigasyonu kullanarak konuma gider. Durumu fiziksel olarak doğrular, yararlanıcıyla görüşür, delil olarak fotoğraf/video çeker ve bulgularını kaydeder."
             :lang==="es"?"Un miembro del equipo de campo asignado viaja a la ubicación usando navegación GPS. Verifica físicamente la situación, entrevista al beneficiario, toma fotos/videos como prueba y registra sus hallazgos."
             :lang==="fr"?"Un membre de l'équipe de terrain désigné se rend à l'emplacement via la navigation GPS. Il vérifie physiquement la situation, interroge le bénéficiaire, prend des photos/vidéos comme preuves et consigne ses conclusions."
             :"An assigned field team member travels to the location using GPS navigation. They physically verify the situation, interview the beneficiary, take photos/videos as proof, and log their findings.",
      actions: lang==="so"?["Hel hawlgalka app-ka mobile-ka","U socodsii goobta GPS","Samee baarista + qaado sawirro","Soo rar natiijooyinka — 90% oo gaabsi muuqaal oo bandwidth yar"]
              :lang==="ar"?["استقبال المهمة على التطبيق","الانتقال إلى الموقع عبر GPS","إجراء التحقيق + التقاط الصور","رفع النتائج — ضغط الصور 90% لعرض نطاق ترددي منخفض"]
              :lang==="tr"?["Mobil uygulamada görevi alın","GPS ile konuma gidin","Soruşturma yürütün + fotoğraf çekin","Bulguları yükleyin — düşük bant genişliği için %90 görüntü sıkıştırma"]
              :lang==="es"?["Recibir misión en app móvil","Navegar a ubicación vía GPS","Realizar investigación + tomar fotos","Subir hallazgos — 90% compresión de imagen para bajo ancho de banda"]
              :lang==="fr"?["Recevoir la mission sur l'application","Naviguer vers le lieu via GPS","Mener l'enquête + prendre des photos","Télécharger les résultats — compression d'image à 90% pour faible bande passante"]
              :["Receive mission on mobile app","Navigate to location via GPS","Conduct investigation + take photos","Upload findings — 90% image compression for low bandwidth"],
    },
    {
      n: 4, icon: "✅", color: "#10B981",
      label:  lang==="so"?"Xaqiijisan"            :lang==="ar"?"تم التحقق"              :lang==="tr"?"Doğrulandı"             :lang==="es"?"Verificado"              :lang==="fr"?"Vérifié"                  :"Verified",
      status: lang==="so"?"Xaqiijisan"            :lang==="ar"?"تم التحقق"              :lang==="tr"?"Doğrulandı"             :lang==="es"?"Verificado"              :lang==="fr"?"Vérifié"                  :"Verified",
      who:    lang==="so"?"Saraakiisha Xaqiijinta" :lang==="ar"?"ضابط التحقق"            :lang==="tr"?"Doğrulama Subayı"      :lang==="es"?"Oficial de Verificación":lang==="fr"?"Officier de Vérification":"Verification Officer",
      detail: lang==="so"?"Kadib markii kooxda goobtu soo gudbiso natiijooyinkooda, saraakiisha xaqiijintu waxay dib u eegayaan caddaynta. Haddii la xaqiijiyo saxnaan, xaaladda waxaa la calaamadeeyaa Xaqiijisan oo waxay galaysaa baanka deeq-bixiyeyaasha."
             :lang==="ar"?"بعد تقديم الفريق الميداني لنتائجه، يراجع ضابط التحقق الأدلة. إذا تم تأكيد شرعيتها، تُوسَم الحالة بـ'تم التحقق' وتدخل تجمع المانحين."
             :lang==="tr"?"Saha ekibi bulgularını gönderdikten sonra doğrulama subayı kanıtları inceler. Meşruiyet onaylanırsa vaka 'Doğrulandı' olarak işaretlenir ve bağışçı havuzuna girer."
             :lang==="es"?"Después de que el equipo de campo envía sus hallazgos, el oficial de verificación revisa la evidencia. Si se confirma la legitimidad, el caso se marca como Verificado y entra al pool de donantes."
             :lang==="fr"?"Après que l'équipe de terrain a soumis ses conclusions, l'officier de vérification examine les preuves. Si la légitimité est confirmée, le cas est marqué Vérifié et entre dans le pool des donateurs."
             :"After the field team submits their findings, the verification officer reviews the evidence. If confirmed legitimate, the case is marked Verified and enters the donor pool.",
      actions: lang==="so"?["Dib u eeg natiijooyinka goobta iyo sawirrada","Xaqiiji xariiqa GPS","Calaamadee xaaladda inay Xaqiijisan tahay","Xaaladda waxay u muuqdaa deeq-bixiyeyaasha"]
              :lang==="ar"?["مراجعة نتائج الميدان والصور","تأكيد إحداثيات GPS","وسم الحالة كمُتحقَّق منها","تصبح الحالة مرئية للمانحين"]
              :lang==="tr"?["Saha bulgularını ve fotoğrafları inceleyin","GPS koordinatlarını onaylayın","Vakayı Doğrulandı olarak işaretleyin","Vaka bağışçılara görünür hale gelir"]
              :lang==="es"?["Revisar hallazgos de campo y fotos","Confirmar coordenadas GPS","Marcar caso como Verificado","El caso se vuelve visible para donantes"]
              :lang==="fr"?["Examiner les résultats terrain et les photos","Confirmer les coordonnées GPS","Marquer le cas comme Vérifié","Le cas devient visible aux donateurs"]
              :["Review field findings and photos","Confirm GPS coordinates match","Mark case as Verified","Case becomes visible to donors"],
    },
    {
      n: 5, icon: "👥", color: "#EC4899",
      label:  lang==="so"?"Safka Deeq-bixiyeyaasha":lang==="ar"?"قائمة انتظار المانحين":lang==="tr"?"Bağışçı Kuyruğu"        :lang==="es"?"Cola de Donantes"       :lang==="fr"?"File des Donateurs"       :"Donor Queue",
      status: lang==="so"?"Sugaysa Taageeraha"      :lang==="ar"?"في انتظار الراعي"      :lang==="tr"?"Sponsor Bekleniyor"     :lang==="es"?"Esperando Patrocinador" :lang==="fr"?"En Attente de Sponsor"    :"Waiting Sponsor",
      who:    lang==="so"?"Deeq-bixiye / Taageere"  :lang==="ar"?"متبرع / راعٍ"          :lang==="tr"?"Bağışçı / Sponsor"      :lang==="es"?"Donante / Patrocinador" :lang==="fr"?"Donateur / Parrain"       :"Donor / Sponsor",
      detail: lang==="so"?"Xaaladaha xaqiijisan waxay ka muuqdaan xaashida deeq-bixiyeyaasha. Deeq-bixiyeyaashu waxay ka baadhi karaan deg-deg, goob, da', ama nooca baahida. Faahfaahinta xaaladda oo dhammaystiran, natiijooyinka baarista, iyo sawirrada ayaa la heli karaa dib u eegista."
             :lang==="ar"?"تظهر الحالات الموثقة في لوحة تحكم المانحين. يمكن للمانحين التصفح حسب الإلحاح والموقع والعمر ونوع الحاجة. تفاصيل الحالة الكاملة ونتائج التحقيق والصور متاحة للمراجعة."
             :lang==="tr"?"Doğrulanmış vakalar bağışçı panelinde görünür. Bağışçılar aciliyet, konum, yaş veya ihtiyaç türüne göre göz atabilir. İnceleme için tam vaka ayrıntıları, soruşturma bulguları ve fotoğraflar mevcuttur."
             :lang==="es"?"Los casos verificados aparecen en el panel de donantes. Los donantes pueden filtrar por urgencia, ubicación, edad o tipo de necesidad. Detalles completos del caso, hallazgos de investigación y fotos están disponibles."
             :lang==="fr"?"Les cas vérifiés apparaissent dans le tableau de bord des donateurs. Les donateurs peuvent parcourir par urgence, lieu, âge ou type de besoin. Les détails complets du cas, les résultats d'enquête et les photos sont disponibles."
             :"Verified cases appear in the donor dashboard. Donors can browse by urgency, location, age, or type of need. Full case details, investigation findings, and photos are available for review.",
      actions: lang==="so"?["Baadh xaaladaha xaqiijisan xaashida deeq-bixiyeyaasha","Shaandho deg-deg, goob, nooc","Arag faahfaahinta xaaladda oo dhammaystiran + caddaynta","Dooro nooca taageerada"]
              :lang==="ar"?["تصفح الحالات الموثقة في لوحة تحكم المانحين","التصفية حسب الإلحاح والموقع والنوع","عرض تفاصيل الحالة الكاملة + الدليل","اختيار نوع الرعاية"]
              :lang==="tr"?["Bağışçı panelinde doğrulanmış vakalara göz atın","Aciliyet, konum, türe göre filtreleyin","Tam vaka ayrıntılarını + kanıtları görüntüleyin","Sponsorluk türünü seçin"]
              :lang==="es"?["Explorar casos verificados en panel de donantes","Filtrar por urgencia, ubicación, tipo","Ver detalles completos del caso + evidencia","Elegir tipo de apadrinamiento"]
              :lang==="fr"?["Parcourir les cas vérifiés dans le tableau de bord","Filtrer par urgence, lieu, type","Voir les détails complets du cas + preuves","Choisir le type de parrainage"]
              :["Browse verified cases in donor dashboard","Filter by urgency, location, type","View full case details + evidence","Choose sponsorship type"],
    },
    {
      n: 6, icon: "❤️", color: "#C0392B",
      label:  lang==="so"?"Taageerada"           :lang==="ar"?"الرعاية"               :lang==="tr"?"Sponsorluk"             :lang==="es"?"Apadrinamiento"          :lang==="fr"?"Parrainage"               :"Sponsorship",
      status: lang==="so"?"La Taageeray"         :lang==="ar"?"تمت الرعاية"           :lang==="tr"?"Desteklendi"            :lang==="es"?"Patrocinado"             :lang==="fr"?"Parrainé"                 :"Sponsored",
      who:    lang==="so"?"Deeq-bixiye / Taageere":lang==="ar"?"متبرع / راعٍ"         :lang==="tr"?"Bağışçı / Sponsor"      :lang==="es"?"Donante / Patrocinador" :lang==="fr"?"Donateur / Parrain"       :"Donor / Sponsor",
      detail: lang==="so"?"Deeq-bixiyuhu wuxuu dooranayaa xaalad oo lacag bixinayaa si amaahday iyada oo loo marayo Stripe, PayPal, Wareejinta Bangiga, ama Ama Gateway. Waxay doortaan u dhexaysa taageerada tooska ah ama qaybinta maamulka xafiiska."
             :lang==="ar"?"يختار المانح حالة ويقوم بدفع آمن عبر Stripe أو PayPal أو التحويل البنكي أو بوابة Ama. يختار بين الرعاية المباشرة أو التوزيع بإدارة المكتب."
             :lang==="tr"?"Bağışçı bir vaka seçer ve Stripe, PayPal, Banka Transferi veya Ama Gateway üzerinden güvenli ödeme yapar. Doğrudan sponsorluk veya ofis yönetimli dağıtım arasında seçim yapar."
             :lang==="es"?"El donante selecciona un caso y realiza un pago seguro via Stripe, PayPal, Transferencia Bancaria o Ama Gateway. Elige entre patrocinio directo o distribución gestionada por la oficina."
             :lang==="fr"?"Le donateur sélectionne un cas et effectue un paiement sécurisé via Stripe, PayPal, Virement Bancaire ou Ama Gateway. Il choisit entre parrainage direct ou distribution gérée par le bureau."
             :"The donor selects a case and makes a secure payment via Stripe, PayPal, Bank Transfer, or Ama Gateway. They choose between direct sponsorship or office-managed distribution.",
      actions: lang==="so"?["Dooro xaaladda la taageerayo","Dooro nooca taageerada (Buuxa / Qayb)","Lacag bixin ammaan ah (Stripe/PayPal/Bangiga)","Hel xaqiijinta + shahaadada canshuurta"]
              :lang==="ar"?["اختيار الحالة للرعاية","اختيار نوع الرعاية (كامل / جزئي)","الدفع الآمن (Stripe/PayPal/بنك)","استلام التأكيد + شهادة ضريبية"]
              :lang==="tr"?["Desteklenecek vakayı seçin","Sponsorluk türünü seçin (Tam / Kısmi)","Güvenli ödeme yapın (Stripe/PayPal/Banka)","Onay + vergi sertifikası alın"]
              :lang==="es"?["Seleccionar caso a patrocinar","Elegir tipo de patrocinio (Completo / Parcial)","Pago seguro (Stripe/PayPal/Banco)","Recibir confirmación + certificado fiscal"]
              :lang==="fr"?["Sélectionner le cas à parrainer","Choisir le type de parrainage (Complet / Partiel)","Effectuer le paiement sécurisé (Stripe/PayPal/Banque)","Recevoir confirmation + certificat fiscal"]
              :["Select case to sponsor","Choose sponsorship type (Full / Partial)","Make secure payment (Stripe/PayPal/Bank)","Receive confirmation + tax certificate"],
    },
    {
      n: 7, icon: "📦", color: "#06B6D4",
      label:  lang==="so"?"Gaarsiinta Gargaarka" :lang==="ar"?"تسليم المساعدة"        :lang==="tr"?"Yardım Teslimatı"        :lang==="es"?"Entrega de Ayuda"        :lang==="fr"?"Livraison de l'Aide"      :"Aid Delivery",
      status: lang==="so"?"Gargaarka La Gaarsiiyo":lang==="ar"?"تم تسليم المساعدة"    :lang==="tr"?"Yardım Teslim Edildi"    :lang==="es"?"Ayuda Entregada"         :lang==="fr"?"Aide Livrée"              :"Aid Delivered",
      who:    lang==="so"?"Kooxda Goobta / Qaybinta Gargaarka":lang==="ar"?"الفريق الميداني / توزيع المساعدات":lang==="tr"?"Saha Ekibi / Yardım Dağıtımı":lang==="es"?"Equipo de Campo / Distribución de Ayuda":lang==="fr"?"Équipe Terrain / Distribution de l'Aide":"Field Team / Aid Distribution",
      detail: lang==="so"?"Kooxda goobta ama kooxda qaybinta gargaarka waxay gaarsiisaa gargaarka faa'iideyaha. Waxay soo raraan caddaynta gaarsiinta — sawirro goobta, xariiqa GPS, iyo saxeexa faa'iideyaha ama xaqiijintisa."
             :lang==="ar"?"يسلم الفريق الميداني أو فريق توزيع المساعدات الدعم للمستفيد. يرفعون دليل التسليم — صور في الموقع وإحداثيات GPS وتوقيع المستفيد أو تأكيده."
             :lang==="tr"?"Saha ekibi veya yardım dağıtım ekibi yardımı yararlanıcıya teslim eder. Teslimat kanıtını yüklerler — konumdaki fotoğraflar, GPS koordinatları ve yararlanıcının imzası veya onayı."
             :lang==="es"?"El equipo de campo o el equipo de distribución de ayuda entrega el apoyo al beneficiario. Suben la prueba de entrega — fotos en la ubicación, coordenadas GPS y la firma o confirmación del beneficiario."
             :lang==="fr"?"L'équipe de terrain ou l'équipe de distribution de l'aide livre le soutien au bénéficiaire. Ils téléchargent la preuve de livraison — photos sur place, coordonnées GPS et signature ou confirmation du bénéficiaire."
             :"The field team or aid distribution team delivers the aid to the beneficiary. They upload proof of delivery — photos at the location, GPS coordinates, and the beneficiary's signature or confirmation.",
      actions: lang==="so"?["Hel hawlgalka gaarsiinta","U socodsii goobta faa'iideyaha","Gaarsii gargaarka + qaado sawirro caddayn ah","Soo rar xaqiijinta gaarsiinta GPS-ka calaamadsan"]
              :lang==="ar"?["استلام مهمة التسليم","الانتقال إلى موقع المستفيد","تسليم المساعدة + التقاط صور الإثبات","رفع تأكيد التسليم المُعلَّم بـGPS"]
              :lang==="tr"?["Teslimat görevi alın","Yararlanıcı konumuna gidin","Yardımı teslim edin + kanıt fotoğrafları çekin","GPS etiketli teslimat onayını yükleyin"]
              :lang==="es"?["Recibir asignación de entrega","Navegar a ubicación del beneficiario","Entregar ayuda + tomar fotos de prueba","Subir confirmación de entrega con GPS"]
              :lang==="fr"?["Recevoir la mission de livraison","Naviguer vers le lieu du bénéficiaire","Livrer l'aide + prendre des photos de preuve","Télécharger la confirmation de livraison géolocalisée"]
              :["Receive delivery assignment","Navigate to beneficiary location","Deliver aid + take proof photos","Upload GPS-tagged delivery confirmation"],
    },
    {
      n: 8, icon: "🏁", color: "#5A6E8A",
      label:  lang==="so"?"La Dhammeeyay"       :lang==="ar"?"مكتملة"                :lang==="tr"?"Tamamlandı"              :lang==="es"?"Completado"              :lang==="fr"?"Terminé"                  :"Completed",
      status: lang==="so"?"La Dhammeeyay"       :lang==="ar"?"مكتملة"                :lang==="tr"?"Tamamlandı"              :lang==="es"?"Completado"              :lang==="fr"?"Terminé"                  :"Completed",
      who:    lang==="so"?"Nidaamka / Maamulka" :lang==="ar"?"النظام / الإدارة"      :lang==="tr"?"Sistem / Yönetim"       :lang==="es"?"Sistema / Admin"         :lang==="fr"?"Système / Admin"          :"System / Admin",
      detail: lang==="so"?"Xaaladda waxaa la calaamadeeyaa inay dhammaatay. Warbixin saameyn ah ayaa si toos ah loo sameeyaa oo muujinaysa safarka oo dhan — soo gudbinta ilaa gaarsiinta. Deeq-bixiyuhu wuxuu helayaa warbixin saameyn ah ugu dambayn. Xaaladda waxaa lagu kaydiyaa raadinta aan la taban karin."
             :lang==="ar"?"تُوسَم الحالة مكتملة. يُولَّد تقرير تأثير تلقائيًا يُظهر الرحلة الكاملة — من التقديم إلى التسليم. يتلقى المانح تقرير التأثير النهائي. تُؤرشف الحالة في سجل التدقيق غير القابل للتغيير."
             :lang==="tr"?"Vaka tamamlandı olarak işaretlenir. Sunumdan teslimatı gösteren tam yolculuğu gösteren bir etki raporu otomatik olarak oluşturulur. Bağışçı nihai etki raporunu alır. Vaka değiştirilemez denetim kaydında arşivlenir."
             :lang==="es"?"El caso se marca como completado. Se genera automáticamente un informe de impacto que muestra el viaje completo — desde la presentación hasta la entrega. El donante recibe un informe de impacto final. El caso se archiva en el registro de auditoría inmutable."
             :lang==="fr"?"Le cas est marqué comme terminé. Un rapport d'impact est généré automatiquement montrant le parcours complet — de la soumission à la livraison. Le donateur reçoit un rapport d'impact final. Le cas est archivé dans la piste d'audit immuable."
             :"The case is marked complete. An impact report is automatically generated showing the full journey — from submission to delivery. The donor receives a final impact report. The case is archived in the immutable audit trail.",
      actions: lang==="so"?["Si toos ah loo sameeyo warbixin saameyn","U ogeysii deeq-bixiyaha caddaynta ugu dambayn","Kaydso xaaladda raadinta oo dhammaystiran","Falanqaynta waxaa si toos ah loo cusboonaysiiyaa"]
              :lang==="ar"?["توليد تقرير التأثير تلقائيًا","إخطار المانح بالدليل النهائي","أرشفة الحالة مع سجل تدقيق كامل","تحديث التحليلات في الوقت الفعلي"]
              :lang==="tr"?["Etki raporunu otomatik oluşturun","Bağışçıya nihai kanıtla bildirim gönderin","Vakayı tam denetim kaydıyla arşivleyin","Analitikleri gerçek zamanlı güncelleyin"]
              :lang==="es"?["Generar informe de impacto automáticamente","Notificar al donante con prueba final","Archivar caso con registro de auditoría completo","Actualizar análisis en tiempo real"]
              :lang==="fr"?["Générer automatiquement le rapport d'impact","Notifier le donateur avec la preuve finale","Archiver le cas avec piste d'audit complète","Mettre à jour les analyses en temps réel"]
              :["Auto-generate impact report","Notify donor with final proof","Archive case with full audit trail","Analytics updated in real time"],
    },
  ];

  const ROLES_FLOW = [
    { icon: "👁️", color: "#3B82F6", steps: [1],
      role: lang==="so"?"Warbixiye"   :lang==="ar"?"مراسل"       :lang==="tr"?"Muhabir"    :lang==="es"?"Reportero"   :lang==="fr"?"Rapporteur"  :"Reporter",
      desc: lang==="so"?"Soo gudbiyaa xaaladda, raacaa horumarka" :lang==="ar"?"يقدم الحالة ويتتبع تقدمها" :lang==="tr"?"Vakayı gönderir, ilerlemeyi takip eder" :lang==="es"?"Envía el caso, rastrea su progreso" :lang==="fr"?"Soumet le cas, suit sa progression" :"Submits the case, tracks its progress" },
    { icon: "🏛️", color: "#8B5CF6", steps: [2,4],
      role: lang==="so"?"Xaqiijiye"   :lang==="ar"?"محقق"        :lang==="tr"?"Doğrulayıcı":lang==="es"?"Verificador"  :lang==="fr"?"Vérificateur":"Verifier",
      desc: lang==="so"?"Ansixiyaa/diidinayaa, xilsaaraa kooxaha, u daynayaa deeq-bixiyeyaasha" :lang==="ar"?"يوافق/يرفض، يعين الفرق، يطلق للمانحين" :lang==="tr"?"Onaylar/reddeder, ekipler atar, bağışçılara bırakır" :lang==="es"?"Aprueba/rechaza, asigna equipos, libera a donantes" :lang==="fr"?"Approuve/rejette, assigne les équipes, libère aux donateurs" :"Approves/rejects, assigns teams, releases to donors" },
    { icon: "🗺️", color: "#F59E0B", steps: [3,7],
      role: lang==="so"?"Kooxda Goobta":lang==="ar"?"الفريق الميداني":lang==="tr"?"Saha Ekibi":lang==="es"?"Equipo de Campo":lang==="fr"?"Équipe de Terrain":"Field Team",
      desc: lang==="so"?"Baarinaayaa goobta, gaarsiinayaa gargaarka" :lang==="ar"?"يحقق في الموقع، يوصل المساعدة" :lang==="tr"?"Yerinde araştırır, yardım teslim eder" :lang==="es"?"Investiga en el lugar, entrega la ayuda" :lang==="fr"?"Enquête sur place, livre l'aide" :"Investigates on-site, delivers aid" },
    { icon: "❤️", color: "#EC4899", steps: [5,6],
      role: lang==="so"?"Deeq-bixiye" :lang==="ar"?"متبرع"       :lang==="tr"?"Bağışçı"    :lang==="es"?"Donante"     :lang==="fr"?"Donateur"   :"Donor",
      desc: lang==="so"?"Baadhnayaa xaaladaha xaqiijisan, bixinayaa lacagta" :lang==="ar"?"يتصفح الحالات الموثقة ويقدم المدفوعات" :lang==="tr"?"Doğrulanmış vakalara göz atar, ödeme yapar" :lang==="es"?"Explora casos verificados, realiza pagos" :lang==="fr"?"Parcourt les cas vérifiés, effectue les paiements" :"Browses verified cases, makes payments" },
    { icon: "🛡️", color: "#C0392B", steps: [8],
      role: lang==="so"?"Maamule"     :lang==="ar"?"مدير"        :lang==="tr"?"Yönetici"   :lang==="es"?"Administrador":lang==="fr"?"Administrateur":"Admin",
      desc: lang==="so"?"Kormeeraa wax kasta, xukumaa sixitaanka, sameeyaa warbixinnada" :lang==="ar"?"يشرف على كل شيء ويراقب الاحتيال ويولد التقارير" :lang==="tr"?"Her şeyi denetler, sahtecilik izler, raporlar üretir" :lang==="es"?"Supervisa todo, monitorea fraude, genera informes" :lang==="fr"?"Supervise tout, surveille la fraude, génère des rapports" :"Oversees everything, monitors fraud, generates reports" },
  ];

  const SECURITY = [
    { icon: "🔑", title: lang==="so"?"OTP 2FA"               :lang==="ar"?"OTP ثنائي العامل"         :lang==="tr"?"OTP 2FA"                :lang==="es"?"OTP 2FA"                :lang==="fr"?"OTP 2FA"                 :"OTP 2FA",             desc: lang==="so"?"Gelitaan kastaa wuxuu u baahanyahay furaha hal-mar ah oo loo diray telefoonkaaga."  :lang==="ar"?"كل تسجيل دخول يتطلب كلمة مرور لمرة واحدة مرسلة لهاتفك."    :lang==="tr"?"Her giriş, telefonunuza gönderilen bir tek kullanımlık şifre gerektirir."  :lang==="es"?"Cada inicio de sesión requiere una contraseña de un solo uso enviada a tu teléfono."  :lang==="fr"?"Chaque connexion nécessite un mot de passe à usage unique envoyé sur votre téléphone."  :"Every login requires a one-time password sent to your phone." },
    { icon: "🪪", title: lang==="so"?"Xaqiijinta Aqoonsiga"  :lang==="ar"?"التحقق من الهوية"         :lang==="tr"?"Kimlik Doğrulama"       :lang==="es"?"Verificación de ID"     :lang==="fr"?"Vérification d'Identité" :"ID Verification",     desc: lang==="so"?"Dhammaan isticmaalayaasha aqoonsooda waxaa la xaqiijiyaa ka hor inta aanay helitaan la helin." :lang==="ar"?"يتم التحقق من هوية جميع المستخدمين قبل الوصول." :lang==="tr"?"Erişim kazanmadan önce tüm kullanıcıların kimliği doğrulanır." :lang==="es"?"Todos los usuarios son verificados por identidad antes de obtener acceso." :lang==="fr"?"Tous les utilisateurs ont leur identité vérifiée avant d'obtenir l'accès." :"All users are identity-verified before gaining access." },
    { icon: "😶", title: lang==="so"?"Xaqiijinta Wejigu"     :lang==="ar"?"التحقق الوجهي"            :lang==="tr"?"Yüz Doğrulama"          :lang==="es"?"Verificación Facial"    :lang==="fr"?"Vérification Faciale"    :"Face Verification",   desc: lang==="so"?"AWS Rekognition wuxuu awood u siinayaa hubinta gelitaanka bayometriga." :lang==="ar"?"يعمل AWS Rekognition على عمليات فحص تسجيل الدخول البيومتري." :lang==="tr"?"AWS Rekognition biyometrik giriş kontrollerini destekler." :lang==="es"?"AWS Rekognition impulsa las verificaciones de inicio de sesión biométrico." :lang==="fr"?"AWS Rekognition alimente les contrôles de connexion biométrique." :"AWS Rekognition powers biometric login checks." },
    { icon: "🔐", title: lang==="so"?"AES-256 Encryption"   :lang==="ar"?"تشفير AES-256"             :lang==="tr"?"AES-256 Şifreleme"      :lang==="es"?"Cifrado AES-256"        :lang==="fr"?"Chiffrement AES-256"     :"AES-256 Encryption",  desc: lang==="so"?"Dhammaan xogta waxaa lagu xifiyaa nasashada iyo socodsiinta iyada oo loo marayo TLS 1.3." :lang==="ar"?"جميع البيانات مشفرة في وضع السكون وأثناء النقل عبر TLS 1.3." :lang==="tr"?"Tüm veriler TLS 1.3 üzerinden beklemede ve aktarımda şifreler." :lang==="es"?"Todos los datos cifrados en reposo y en tránsito vía TLS 1.3." :lang==="fr"?"Toutes les données chiffrées au repos et en transit via TLS 1.3." :"All data encrypted at rest and in transit via TLS 1.3." },
    { icon: "💳", title: "PCI DSS Level 1",                   desc: lang==="so"?"Heerka ugu sarreeya ee xaqiijinta amniga lacag-bixinta." :lang==="ar"?"أعلى مستوى لشهادة أمان المدفوعات." :lang==="tr"?"En yüksek ödeme güvenliği sertifikası seviyesi." :lang==="es"?"Nivel más alto de certificación de seguridad de pagos." :lang==="fr"?"Niveau le plus élevé de certification de sécurité des paiements." :"Highest level of payment security certification." },
    { icon: "🤖", title: lang==="so"?"AI Fraud Detection"    :lang==="ar"?"كشف الاحتيال بالذكاء الاصطناعي":lang==="tr"?"Yapay Zeka Dolandırıcılık Tespiti":lang==="es"?"Detección de Fraude IA":lang==="fr"?"Détection de Fraude IA":"AI Fraud Detection",  desc: lang==="so"?"Ogaanshaha xaaladaha aan caadiga ahayn wakhtiga dhabta ah ayaa calaamadeeyaa qaababka shakiga leh." :lang==="ar"?"يكتشف الكشف عن الشذوذ في الوقت الفعلي الأنماط المشبوهة." :lang==="tr"?"Gerçek zamanlı anomali tespiti şüpheli kalıpları işaretler." :lang==="es"?"La detección de anomalías en tiempo real señala patrones sospechosos." :lang==="fr"?"La détection d'anomalies en temps réel signale les schémas suspects." :"Real-time anomaly detection flags suspicious patterns." },
    { icon: "📜", title: lang==="so"?"Diiwaanka Aan La Taban Karin":lang==="ar"?"سجل تدقيق غير قابل للتغيير":lang==="tr"?"Değiştirilemez Denetim Kaydı":lang==="es"?"Registro de Auditoría Inmutable":lang==="fr"?"Journal d'Audit Immuable":"Immutable Audit Log", desc: lang==="so"?"Ficil kastaa waxaa lagu duubaa waqtiga, aqoonsiga isticmaalaha, iyo haashka." :lang==="ar"?"كل إجراء مُسجَّل مع الطابع الزمني ومعرف المستخدم والهاش." :lang==="tr"?"Her eylem zaman damgası, kullanıcı kimliği ve hash ile kaydedilir." :lang==="es"?"Cada acción registrada con marca de tiempo, ID de usuario y hash." :lang==="fr"?"Chaque action enregistrée avec horodatage, identifiant utilisateur et hachage." :"Every action logged with timestamp, user ID, and hash." },
    { icon: "🌐", title: lang==="so"?"GDPR La Raacayo"        :lang==="ar"?"متوافق مع GDPR"             :lang==="tr"?"GDPR Uyumlu"             :lang==="es"?"Cumplimiento GDPR"      :lang==="fr"?"Conforme RGPD"           :"GDPR Compliant",      desc: lang==="so"?"Xaqiijinta xogta gaarka ah oo dhammaystiran — xuquuqda tirtirka ayaa la taageeray." :lang==="ar"?"امتثال كامل لخصوصية البيانات — يتم دعم حق الحذف." :lang==="tr"?"Tam veri gizliliği uyumu — silme hakkı desteklenir." :lang==="es"?"Cumplimiento total de privacidad de datos — derecho a eliminación compatible." :lang==="fr"?"Conformité totale à la confidentialité des données — droit à l'effacement supporté." :"Full data privacy compliance — right to erasure supported." },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#0D1F3C" }}>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.secondary} 100%)`, color: "#fff", padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <span style={{ background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.25)", borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700 }}>{P.hero_badge}</span>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, margin: "20px 0 16px" }}>{P.hero_title}</h1>
          <p style={{ fontSize: 18, opacity: 0.85, lineHeight: 1.7 }}>{P.hero_sub}</p>
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
              <div style={{ flexShrink: 0, textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${s.color}, ${s.color}bb)`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: `0 6px 20px ${s.color}40` }}>{s.icon}</div>
                {i < STEPS.length - 1 && <div style={{ width: 2, height: 40, background: s.color + "30", margin: "8px auto 0" }} />}
              </div>
              <div style={{ flex: 1, background: "#FAFAFA", borderRadius: 18, padding: 28, border: `1px solid ${C.border}`, borderLeft: `4px solid ${s.color}` }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: s.color, background: s.color + "15", border: `1px solid ${s.color}30`, borderRadius: 20, padding: "3px 10px" }}>STEP {s.n}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#0D1F3C" }}>{s.label}</div>
                  <div style={{ marginLeft: "auto", background: "#F3F4F6", borderRadius: 20, padding: "4px 12px", fontSize: 12, color: C.muted, fontWeight: 600 }}>🙋 {s.who}</div>
                </div>
                <div style={{ display: "inline-block", background: s.color + "15", border: `1px solid ${s.color}30`, borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700, color: s.color, marginBottom: 14 }}>
                  {P.status_lbl} {s.status}
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
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, margin: "0 0 10px" }}>{P.who_title}</h2>
            <p style={{ fontSize: 16, color: C.muted }}>{P.who_sub}</p>
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
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, margin: "0 0 10px" }}>{P.sec_title}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {SECURITY.map((f, i) => (
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
        <h2 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 16px" }}>{P.cta_title}</h2>
        <p style={{ fontSize: 17, opacity: 0.85, marginBottom: 32 }}>{P.cta_sub}</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/dashboard" style={{ padding: "14px 32px", background: C.accent, color: "#fff", borderRadius: 12, textDecoration: "none", fontWeight: 800, fontSize: 15 }}>{P.cta_open}</Link>
          <Link to="/cases"     style={{ padding: "14px 32px", background: "rgba(255,255,255,.15)", color: "#fff", border: "2px solid rgba(255,255,255,.4)", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 15 }}>{P.cta_browse}</Link>
        </div>
      </section>
    </div>
  );
}
