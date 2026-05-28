/**
 * <Logo /> — Kafaala Qaad HOPE brand logo component
 *
 * Props:
 *   variant   "full" | "icon"          default "full"
 *   theme     "auto" | "light" | "dark" default "auto"
 *             auto  → full logo (works on both light & dark)
 *             light → logo on light background
 *             dark  → logo on dark background (white version when needed)
 *   height    number (px)              default 48
 *   width     number (px)              auto by default (proportional)
 *   className string
 *   style     object
 *   linked    boolean                  default true — wraps in <a href="/">
 *   alt       string
 */

import { Link } from "react-router-dom";

export default function Logo({
  variant  = "full",
  theme    = "auto",
  height   = 48,
  width,
  className,
  style     = {},
  linked    = true,
  alt       = "Kafaala Qaad HOPE",
}) {
  const src = variant === "icon"
    ? "/assets/brand/kafaala-qaad-hope-icon.png"
    : "/assets/brand/kafaala-qaad-hope-logo.png";

  const imgStyle = {
    height:    height,
    width:     width || "auto",
    maxWidth:  "100%",
    objectFit: "contain",
    display:   "block",
    flexShrink: 0,
    ...style,
  };

  const img = (
    <img
      src={src}
      alt={alt}
      height={height}
      width={width}
      className={className}
      style={imgStyle}
      draggable={false}
    />
  );

  if (!linked) return img;

  return (
    <Link
      to="/"
      aria-label={alt}
      style={{ display: "inline-flex", alignItems: "center", lineHeight: 0, flexShrink: 0 }}
    >
      {img}
    </Link>
  );
}
