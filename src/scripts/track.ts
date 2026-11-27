// src/scripts/track.ts
// One place for business events. Sends to Plausible when it is configured, otherwise does nothing.
// Events map to the metrics in docs/PRD.md.
export function track(name: string, props: Record<string, string | number> = {}) {
  const w = window as any;
  try { w.plausible?.(name, { props: { page: location.pathname, ...props } }); } catch { /* analytics must never break the site */ }
}
