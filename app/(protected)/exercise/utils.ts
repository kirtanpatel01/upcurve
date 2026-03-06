export function secondsToHMS(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return { h, m, s };
}

export function hmsToSeconds(h: number, m: number, s: number) {
  return h * 3600 + m * 60 + s;
}

export function formatSeconds(totalSeconds: number) {
  if (totalSeconds === 0) return "0s";
  const { h, m, s } = secondsToHMS(totalSeconds);
  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 || parts.length === 0) parts.push(`${s}s`);
  return parts.join(" ");
}
