import { useState, useRef } from "react";

const C = {
  navy: "#002651", primary: "#004B96", secondary: "#4B7D19",
  accent: "#E0AB21", muted: "#5A6E8A", border: "#D8E4F0", danger: "#C0392B",
};

const CONTRACTS_KEY = "kf_contracts";

function genRef(type) {
  const prefixes = {
    child_sponsorship: "KQ-CS",
    project_funding:   "KQ-PF",
    partner_agreement: "KQ-PA",
    case_sponsorship:  "KQ-SP",
  };
  const prefix = prefixes[type] || "KQ-GN";
  return `${prefix}-${new Date().getFullYear()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
}

function saveContract(contract) {
  try {
    const existing = JSON.parse(localStorage.getItem(CONTRACTS_KEY) || "[]");
    localStorage.setItem(CONTRACTS_KEY, JSON.stringify([contract, ...existing]));
  } catch {}
}

const Row = ({ label, value }) => (
  <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 8, marginBottom: 8, fontSize: 13 }}>
    <span style={{ color: C.muted, fontWeight: 700, textTransform: "uppercase", fontSize: 11, letterSpacing: 0.5, paddingTop: 2 }}>{label}</span>
    <span style={{ color: "#0D1F3C", fontWeight: 600 }}>{value}</span>
  </div>
);

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ fontSize: 11, fontWeight: 800, color: C.primary, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10, borderBottom: `2px solid ${C.border}`, paddingBottom: 6 }}>{title}</div>
    {children}
  </div>
);

function contractBody(type, data, ref, date) {
  if (type === "child_sponsorship") return (
    <>
      <Section title="Parties">
        <Row label="Organisation" value="Kafaale Qaad HOPE Society · Mogadishu, Somalia" />
        <Row label="Sponsor" value={data.sponsorName || "—"} />
        <Row label="Contact" value={data.sponsorEmail || "—"} />
      </Section>
      <Section title="Sponsorship Details">
        <Row label="Beneficiary ID" value={data.beneficiaryId || "—"} />
        <Row label="Program Type" value={data.programType || "Child Sponsorship"} />
        <Row label="Location" value={data.location || "Somalia"} />
        <Row label="Monthly Amount" value={`$${data.amount}/month`} />
        <Row label="Duration" value={`${data.months} months (${data.months >= 12 ? Math.floor(data.months/12) + " year" + (data.months >= 24 ? "s" : "") : data.months + " months"})`} />
        <Row label="Total Commitment" value={`$${(parseFloat(data.amount) * parseInt(data.months)).toLocaleString()}`} />
        <Row label="Payment Method" value={data.paymentMethod || "Arranged with admin"} />
        <Row label="Start Date" value={date} />
        <Row label="End Date" value={new Date(new Date().setMonth(new Date().getMonth() + parseInt(data.months))).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} />
      </Section>
      <Section title="Terms & Obligations">
        <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.8, margin: 0 }}>
          1. <strong>Kafaale Qaad</strong> agrees to allocate the sponsored child/family to this sponsor exclusively for the duration stated above, provide monthly progress reports, and ensure 100% of the committed monthly amount reaches the beneficiary.<br />
          2. <strong>The Sponsor</strong> agrees to pay the committed monthly amount on the agreed schedule, notify Kafaale Qaad at least 30 days in advance if unable to continue, and not disclose the beneficiary's personal details to third parties.<br />
          3. <strong>Early termination</strong> by the sponsor requires 30 days written notice. Any pre-paid amounts for remaining months will be refunded within 14 business days.<br />
          4. <strong>Kafaale Qaad</strong> reserves the right to reassign the beneficiary if the sponsor fails to make payments for 2 consecutive months after written notice.<br />
          5. This agreement is governed by the laws of the Federal Republic of Somalia and internationally recognized humanitarian aid principles.
        </p>
      </Section>
    </>
  );

  if (type === "project_funding") return (
    <>
      <Section title="Parties">
        <Row label="Organisation" value="Kafaale Qaad HOPE Society · Mogadishu, Somalia" />
        <Row label="Contributor" value={data.contributorName || "—"} />
        <Row label="Contact" value={data.contributorEmail || "—"} />
      </Section>
      <Section title="Project Details">
        <Row label="Project Title" value={data.projectTitle || "—"} />
        <Row label="Location" value={data.location || "Somalia"} />
        <Row label="Beneficiaries" value={data.populationSize ? data.populationSize.toLocaleString() + " people" : "—"} />
        <Row label="Contribution" value={`$${parseFloat(data.amount).toLocaleString()}`} />
        <Row label="Funding Type" value={data.isFullFunding ? "Full Project Funding" : "Partial Contribution"} />
        <Row label="Date" value={date} />
      </Section>
      <Section title="Terms & Obligations">
        <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.8, margin: 0 }}>
          1. <strong>Kafaale Qaad</strong> agrees to deploy this contribution exclusively to the named project, provide a completion report with photographic evidence and GPS data, and return any undisbursed funds if the project is cancelled.<br />
          2. <strong>The Contributor</strong> agrees that funds are non-refundable once disbursed for project activities, and authorises Kafaale Qaad to publish co-branded impact reports using this contribution.<br />
          3. <strong>Reporting</strong>: Kafaale Qaad will provide progress updates at project milestones and a final impact report within 30 days of project completion.<br />
          4. This agreement is governed by the laws of the Federal Republic of Somalia and internationally recognized humanitarian aid principles.
        </p>
      </Section>
    </>
  );

  if (type === "partner_agreement") return (
    <>
      <Section title="Parties">
        <Row label="Platform" value="Kafaale Qaad HOPE Society · Mogadishu, Somalia" />
        <Row label="Partner Org" value={data.orgName || "—"} />
        <Row label="Type" value={data.orgType || "—"} />
        <Row label="Country" value={data.country || "—"} />
        <Row label="Contact" value={`${data.contactName || "—"} · ${data.contactEmail || "—"}`} />
      </Section>
      <Section title="Partnership Details">
        <Row label="Focus Areas" value={(data.focusAreas || []).join(", ") || "—"} />
        <Row label="Regions" value={data.operatingRegions || "—"} />
        <Row label="Agreement Date" value={date} />
        <Row label="Duration" value="12 months (renewable)" />
      </Section>
      <Section title="Terms & Obligations">
        <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.8, margin: 0 }}>
          1. <strong>The Partner</strong> agrees to operate within Kafaale Qaad's verified aid framework, submit to field verification visits, maintain accurate beneficiary records, and share monthly delivery reports.<br />
          2. <strong>Kafaale Qaad</strong> agrees to co-brand the partner's contributions, provide donor-matched case referrals, grant access to the secure partner dashboard, and publicly recognise the partner's impact.<br />
          3. <strong>Confidentiality</strong>: Both parties agree not to disclose beneficiary personal data to third parties without written consent.<br />
          4. <strong>Termination</strong>: Either party may terminate with 60 days written notice. Active cases must be transferred or completed before termination.<br />
          5. This agreement is governed by the laws of the Federal Republic of Somalia and internationally recognized humanitarian aid principles.
        </p>
      </Section>
    </>
  );

  if (type === "case_sponsorship") return (
    <>
      <Section title="Parties">
        <Row label="Organisation" value="Kafaale Qaad HOPE Society · Mogadishu, Somalia" />
        <Row label="Donor" value={data.donorName || "—"} />
        <Row label="Contact" value={data.donorEmail || "—"} />
      </Section>
      <Section title="Case Details">
        <Row label="Case ID" value={data.caseId || "—"} />
        <Row label="Case Title" value={data.caseTitle || "—"} />
        <Row label="Category" value={data.category || "—"} />
        <Row label="Location" value={data.location || "Somalia"} />
        <Row label="Sponsorship Amount" value={`$${parseFloat(data.amount).toLocaleString()}`} />
        <Row label="Date" value={date} />
      </Section>
      <Section title="Terms & Obligations">
        <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.8, margin: 0 }}>
          1. <strong>Kafaale Qaad</strong> guarantees that 100% of donated funds are directed to the named case, provides GPS-confirmed delivery proof within 14 days of aid delivery, and issues a tax-compliant receipt.<br />
          2. <strong>The Donor</strong> confirms that funds are donated in good faith and authorises Kafaale Qaad to publish anonymised impact data related to this case.<br />
          3. <strong>Refund policy</strong>: If a case cannot be fulfilled, the donor will be offered an alternative case or full refund within 14 business days.<br />
          4. This agreement is governed by the laws of the Federal Republic of Somalia and internationally recognized humanitarian aid principles.
        </p>
      </Section>
    </>
  );

  return null;
}

const TYPE_TITLES = {
  child_sponsorship: "Child & Family Sponsorship Agreement",
  project_funding:   "Community Project Funding Agreement",
  partner_agreement: "Impact Partner Agreement",
  case_sponsorship:  "Emergency Case Sponsorship Agreement",
};

export default function ContractModal({ type, data, onClose, onAccept }) {
  const [signerName, setSignerName] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [signed, setSigned] = useState(false);
  const [contractRef] = useState(() => genRef(type));
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const printRef = useRef(null);

  const handleSign = () => {
    if (!signerName.trim() || !accepted) return;
    const contract = {
      ref: contractRef, type, data, signerName,
      signedAt: new Date().toISOString(), date,
    };
    saveContract(contract);
    setSigned(true);
    onAccept && onAccept(contractRef);
  };

  const handlePrint = () => window.print();

  if (signed) return (
    <div style={{ position: "fixed", inset: 0, background: "#0007", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 40, maxWidth: 480, width: "100%", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#D1FAE5", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>✅</div>
        <h2 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 900, color: C.secondary }}>Contract Signed!</h2>
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
          Your agreement has been recorded. Reference number:
        </p>
        <div style={{ background: C.navy, color: "#fff", borderRadius: 10, padding: "12px 20px", fontSize: 18, fontWeight: 900, letterSpacing: 2, marginBottom: 20 }}>
          {contractRef}
        </div>
        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
          A copy has been saved. Please print or screenshot this reference for your records.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={handlePrint} style={{ padding: "11px 22px", borderRadius: 10, border: `1.5px solid ${C.primary}`, background: "#fff", color: C.primary, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Print Contract</button>
          <button onClick={onClose} style={{ padding: "11px 28px", borderRadius: 10, background: C.secondary, color: "#fff", border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>Done</button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @media print {
          body > *:not(#kq-contract-print) { display: none !important; }
          #kq-contract-print { display: block !important; position: static !important; padding: 40px !important; }
        }
      `}</style>

      <div id="kq-contract-print" style={{ position: "fixed", inset: 0, background: "#0007", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}>
        <div style={{ background: "#fff", borderRadius: 20, maxWidth: 680, width: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} ref={printRef}>

          {/* Contract Header */}
          <div style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.primary})`, color: "#fff", padding: "28px 32px", borderRadius: "20px 20px 0 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", opacity: 0.7, marginBottom: 6 }}>Kafaale Qaad HOPE Society</div>
                <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.2 }}>{TYPE_TITLES[type] || "Agreement"}</div>
              </div>
              <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, width: 36, height: 36, cursor: "pointer", fontSize: 18, color: "#fff", flexShrink: 0 }}>×</button>
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 16, fontSize: 12 }}>
              <span style={{ opacity: 0.8 }}>Ref: <strong style={{ opacity: 1 }}>{contractRef}</strong></span>
              <span style={{ opacity: 0.8 }}>Date: <strong style={{ opacity: 1 }}>{date}</strong></span>
            </div>
          </div>

          {/* Contract Body */}
          <div style={{ padding: "28px 32px" }}>
            <div style={{ background: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: 10, padding: "10px 16px", marginBottom: 20, fontSize: 12, color: "#92400E", fontWeight: 600 }}>
              Please read this agreement carefully before signing. This is a legally binding commitment.
            </div>

            {contractBody(type, data, contractRef, date)}

            {/* Signature Section */}
            <div style={{ border: `2px solid ${C.primary}`, borderRadius: 14, padding: "20px 22px", marginTop: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.navy, marginBottom: 14 }}>Electronic Signature</div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
                  Full Name (type to sign) *
                </label>
                <input
                  value={signerName}
                  onChange={e => setSignerName(e.target.value)}
                  placeholder="Type your full legal name…"
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: "'Georgia', serif", fontStyle: "italic", boxSizing: "border-box", color: C.navy }}
                />
              </div>

              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", marginBottom: 18 }}>
                <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} style={{ marginTop: 2, width: 18, height: 18, cursor: "pointer", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>
                  I have read and understood this agreement. I confirm that all information I have provided is accurate and I agree to all terms stated above. I understand this constitutes a binding commitment between myself and Kafaale Qaad HOPE Society.
                </span>
              </label>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={onClose} style={{ flex: 1, padding: "12px", background: "#F3F4F6", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700, color: C.muted }}>
                  Cancel
                </button>
                <button
                  onClick={handleSign}
                  disabled={!signerName.trim() || !accepted}
                  style={{ flex: 2, padding: "12px", background: !signerName.trim() || !accepted ? "#E5E7EB" : C.secondary, color: !signerName.trim() || !accepted ? C.muted : "#fff", border: "none", borderRadius: 10, cursor: !signerName.trim() || !accepted ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 800, transition: "all .15s" }}>
                  Sign & Accept Agreement
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
