// Small presentational helpers shared across widgets. Money formatting lives in
// the data seam (data/api.ts formatSGD); these cover dates and monograms.

const dateFmt = new Intl.DateTimeFormat("en-SG", { day: "numeric", month: "short" });

/** "2026-07-09T08:14:00+08:00" -> "9 Jul". */
export function formatShortDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}

/** "Din Tai Fung" -> "DT", "Grab" -> "G". Used for the row monogram. */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 1).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** The year-month bucket, e.g. "2026-07", for "this month" grouping. */
export function yearMonth(iso: string): string {
  return iso.slice(0, 7);
}
