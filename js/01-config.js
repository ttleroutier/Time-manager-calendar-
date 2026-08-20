/* ═══════════════════════════════════════════════════════════
   Time Manager (Calendar) — BLOC 9 : CONSTANTES
   9.1 palette des missions · 9.2 constante de mise en page
   9.3 catégories et seuils de priorité · 9.4 noms de jours
   Rien ici n'est persisté : ce sont des réglages de code.
   ═══════════════════════════════════════════════════════════ */

/* 9.1 — couleurs proposées dans le sélecteur (pastilles .cp-d) */
const COLORS=['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#ec4899','#14b8a6','#64748b'];

/* 9.2 — hauteur d'une heure en pixels dans les vues semaine et jour.
   Doit rester synchronisée avec .sv-tl / .sv-slot dans css/04-calendar.css. */
const HH=48;

/* 9.3 — seuils de priorité EN JOURS restants avant la deadline.
   Lecture : une mission "todo" passe en noir à 0.2083 j (≈ 5 h) de l'échéance.
   -1 désactive l'escalade : la catégorie "none" reste toujours verte. */
const CATS={
  todo  :{black:.2083,red:1,orange:2,label:'To Do'},
  exam  :{black:2,    red:4,orange:7,label:'Exam'},
  devoir:{black:1,    red:2,orange:5,label:'Devoir'},
  none  :{black:-1,   red:-1,orange:-1,label:'--'}
};

/* 9.4 — semaine commençant le lundi. DN = affichage, DK = clés de ft (temps libre).
   Conversion depuis Date.getDay() (0 = dimanche) : (d.getDay()+6)%7 */
const DN=['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
const DK=['mon','tue','wed','thu','fri','sat','sun'];
