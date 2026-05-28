/**
 * Kafaala Qaad HOPE — Official Brand Colors
 * Extracted directly from the logo artwork
 *
 *   Deep Navy   #002651  — darkest blue (bottom bar, text)
 *   Royal Blue  #004B96  — main blue (figures, UI primary)
 *   Leaf Green  #4B7D19  — hands/leaves (secondary, success)
 *   Gold        #E0AB21  — HOPE text, sun rays (accent/CTA)
 *   Dark Green  #324B00  — deep forest green (hover/dark)
 */

export const BRAND = {
  // Primary blues
  navy:    "#002651",   // deepest — top/bottom bars, hero bg
  blue:    "#004B96",   // royal blue — buttons, links, primary UI
  blueLight: "#1A6CB5", // mid blue — hover states, lighter accents

  // Greens
  green:   "#4B7D19",   // leaf green — verified badges, success, secondary
  greenDark: "#324B00", // deep forest — hover on green buttons
  greenLight: "#6A9C2A",// lighter green — backgrounds, soft accents

  // Gold / accent
  gold:    "#E0AB21",   // HOPE gold — CTA buttons, highlights
  goldDark: "#B8861A",  // darker gold — hover on gold
  goldLight: "#F4D04A", // lighter gold — badges, light accents

  // Neutrals
  bg:      "#F4F7FC",   // page background (slight blue tint)
  card:    "#FFFFFF",   // card surface
  border:  "#D8E4F0",   // borders (blue-tinted)
  text:    "#0D1F3C",   // body text (near-navy)
  muted:   "#5A6E8A",   // secondary text
  white:   "#FFFFFF",

  // Semantic
  danger:  "#C0392B",
  warning: "#E0AB21",   // reuses gold
  success: "#4B7D19",   // reuses green

  // Footer / dark surfaces
  darkBg:  "#001A40",   // very deep navy
  darkCard:"#00244F",   // slightly lighter navy card
};

// Convenience: drop-in replacement for old C = { primary, secondary, accent } pattern
export const C = {
  primary:   BRAND.blue,
  secondary: BRAND.green,
  accent:    BRAND.gold,
  danger:    BRAND.danger,
  muted:     BRAND.muted,
  bg:        BRAND.bg,
  border:    BRAND.border,
  text:      BRAND.text,
  white:     BRAND.white,
};

export default BRAND;
