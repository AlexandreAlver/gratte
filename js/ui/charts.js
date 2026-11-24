// Petits graphiques SVG sans dépendance
import { esc } from '../util.js';

export function barChart(data, { goal = null, h = 180, unit = '' } = {}) {
  const W = 340, top = 18, bottom = 24, left = 6;
  const max = Math.max(goal || 0, ...data.map((d) => d.value), 1) * 1.12;
  const bw = (W - left * 2) / data.length;
  const y = (v) => top + (h - top - bottom) * (1 - v / max);
  let s = `<svg class="chart" viewBox="0 0 ${W} ${h}" role="img" aria-label="Graphique en barres">`;
  s += `<line class="axis" x1="0" x2="${W}" y1="${h - bottom}" y2="${h - bottom}"/>`;
  data.forEach((d, i) => {
    const x = left + i * bw + bw * 0.18, w = bw * 0.64;
    const yy = y(d.value);
    if (d.value > 0) s += `<rect class="barr ${goal && d.value >= goal ? 'goal' : ''}" x="${x}" y="${yy}" width="${w}" height="${h - bottom - yy}" rx="5"><title>${esc(d.label)} : ${d.value}${unit}</title></rect>`;
    if (d.value > 0) s += `<text class="val" x="${x + w / 2}" y="${yy - 5}" text-anchor="middle">${d.value}</text>`;
    s += `<text class="lab" x="${x + w / 2}" y="${h - 7}" text-anchor="middle">${esc(d.label)}</text>`;
  });
  if (goal) s += `<line class="goal-line" x1="0" x2="${W}" y1="${y(goal)}" y2="${y(goal)}"/><text class="goal-lab" x="${W - 2}" y="${y(goal) - 5}" text-anchor="end">objectif ${goal}${unit}</text>`;
  return s + '</svg>';
}

export function lineChart(points, { h = 170, unit = '' } = {}) {
  if (points.length < 2) return `<div class="empty small">${points.length ? `Un seul point pour l'instant : ${points[0].value}${unit}. Reviens après ta prochaine séance !` : 'Pas encore de données.'}</div>`;
  const W = 340, top = 20, bottom = 24, left = 30, right = 12;
  const vals = points.map((p) => p.value);
  const min = Math.min(...vals) * 0.9, max = Math.max(...vals) * 1.06;
  const x = (i) => left + ((W - left - right) * i) / (points.length - 1);
  const y = (v) => top + (h - top - bottom) * (1 - (v - min) / (max - min || 1));
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)} ${y(p.value)}`).join(' ');
  let s = `<svg class="chart" viewBox="0 0 ${W} ${h}" role="img" aria-label="Courbe de progression">`;
  s += `<line class="axis" x1="${left}" x2="${W - right}" y1="${h - bottom}" y2="${h - bottom}"/>`;
  s += `<text class="lab" x="${left - 6}" y="${y(Math.max(...vals)) + 4}" text-anchor="end">${Math.max(...vals)}</text>`;
  s += `<text class="lab" x="${left - 6}" y="${y(Math.min(...vals)) + 4}" text-anchor="end">${Math.min(...vals)}</text>`;
  s += `<path class="area" d="${d} L${x(points.length - 1)} ${h - bottom} L${x(0)} ${h - bottom} Z"/><path class="line" d="${d}"/>`;
  const every = Math.ceil(points.length / 6);
  points.forEach((p, i) => {
    s += `<circle class="pt" cx="${x(i)}" cy="${y(p.value)}" r="4"><title>${esc(p.label)} : ${p.value}${unit}</title></circle>`;
    if (i % every === 0 || i === points.length - 1) s += `<text class="lab" x="${x(i)}" y="${h - 7}" text-anchor="middle">${esc(p.label)}</text>`;
  });
  return s + '</svg>';
}
