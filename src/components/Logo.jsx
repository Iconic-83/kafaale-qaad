import { Link } from "react-router-dom";

/**
 * <Logo /> — Kafaala Qaad Hope Society brand logo
 * Props:
 *   size      "sm" | "md" | "lg"   default "md"
 *   variant   "full" | "icon"      default "full" — icon-only hides text
 *   linked    boolean              default true
 *   dark      boolean              default false — white text on dark bg
 */
export default function Logo({ size = "md", variant = "full", linked = true, dark = false, style = {} }) {
  const s = {
    sm: { img: 44,  full: 110, title: 14, sub: 8,  gap: 10 },
    md: { img: 58,  full: 140, title: 18, sub: 10, gap: 12 },
    lg: { img: 76,  full: 180, title: 24, sub: 12, gap: 14 },
  }[size] || { img: 58, full: 140, title: 18, sub: 10, gap: 12 };

  const titleColor = dark ? "#ffffff" : "#002651";
  const subColor   = dark ? "#E0AB21" : "#4B7D19";

  const inner = (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: s.gap,
      flexShrink: 0,
      textDecoration: "none",
      ...style,
    }}>
      <img
        src="/assets/brand/kafaala-qaad-hope-icon.png"
        alt="Kafaala Qaad Hope Society"
        style={{ width: s.img, height: s.img, objectFit: "contain", display: "block", flexShrink: 0 }}
        draggable={false}
      />
      {variant !== "icon" && (
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: s.title, fontWeight: 900, color: titleColor, letterSpacing: -0.5, whiteSpace: "nowrap" }}>
            KAFAALA QAAD
          </div>
          <div style={{ fontSize: s.sub, fontWeight: 700, color: subColor, letterSpacing: 1.5, marginTop: 2, whiteSpace: "nowrap", textTransform: "uppercase" }}>
            Hope Society
          </div>
        </div>
      )}
    </div>
  );

  if (!linked) return inner;

  return (
    <Link to="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
      {inner}
    </Link>
  );
}
