/* ═══════════════════════════════════════════════════════════
   Time Manager (Calendar) — BLOC 10 : UTILITAIRES
   10.1 identifiants et échappement · 10.2 formatage horaire
   10.3 calculs de dates
   ═══════════════════════════════════════════════════════════ */

/* 10.1 — UID stable au format iCalendar, généré une seule fois par mission */
function uid(){return 'tm-'+Date.now().toString(36)+'-'+Math.random().toString(36).substr(2,9)+'@tm'}

/* Tout texte saisi par l'utilisateur passe ici avant injection en innerHTML */
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

/* 10.2 */
function f24(d){return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')}

/* "18:30" -> 18.5 : convertit une heure en position verticale (x HH pixels) */
function timeToH(s){const p=s.split(':');return parseInt(p[0])+(parseInt(p[1]||0)/60)}

/* 10.3 — lundi de la semaine contenant d, à minuit */
function getMon(d){const dt=new Date(d);dt.setHours(0,0,0,0);const day=dt.getDay();dt.setDate(dt.getDate()-day+(day===0?-6:1));return dt}

function sameDay(a,b){return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate()}
