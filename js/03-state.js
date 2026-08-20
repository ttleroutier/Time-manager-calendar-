/* ═══════════════════════════════════════════════════════════
   Time Manager (Calendar) — BLOC 11 : ÉTAT
   11.1 migration · 11.2 état persisté et runtime
   11.3 persistance · 11.4 thème et valeurs par défaut
   Clés localStorage historiques (mc4*) : les renommer effacerait
   les données déjà enregistrées chez les utilisateurs.
   ═══════════════════════════════════════════════════════════ */

/* 11.1 — complète les champs absents des anciennes versions.
   Toute nouvelle propriété de mission doit être ajoutée ici. */
function migrate(t){
  if(!t.uid)t.uid=uid();
  if(!t.sequence)t.sequence=0;
  if(!t.category)t.category='none';
  if(!t.color)t.color=COLORS[0];
  if(!t.recurring)t.recurring={type:'none',endDate:''};
  if(t.hiddenUntil===undefined)t.hiddenUntil=null;
  // ancien modèle : missions sans deadline -> on leur donne l'instant présent
  if(t.objective||t.noDeadline){
    if(!t.deadline){const n=new Date();t.deadline=new Date(n.getTime()-n.getTimezoneOffset()*60000).toISOString().slice(0,16)}
    delete t.objective;delete t.noDeadline
  }
  return t
}

/* 11.2 — état persisté */
let tasks=JSON.parse(localStorage.getItem('mc4')||'[]').map(migrate);
let theme=localStorage.getItem('mc4_theme')||'dark';
let ft=JSON.parse(localStorage.getItem('mc4_ft')||'null')||{
  mon:{s:'18:00',e:'20:00'},tue:{s:'18:00',e:'20:00'},wed:{s:'18:00',e:'20:00'},
  thu:{s:'18:00',e:'20:00'},fri:{s:'18:00',e:'20:00'},
  sat:{s:'10:00',e:'14:00'},sun:{s:'10:00',e:'14:00'}
};

/* état runtime, jamais sauvegardé */
let tab='calendar',calView='week',calDate=new Date(),selColor=COLORS[0],editColor=COLORS[0];
let ftOpen=false;

/* 11.3 */
function save(){localStorage.setItem('mc4',JSON.stringify(tasks))}
function saveFt(){localStorage.setItem('mc4_ft',JSON.stringify(ft))}

/* 11.4 — thème : la classe .light sur <body> bascule toute la palette */
function toggleTheme(){
  theme=theme==='dark'?'light':'dark';
  document.body.classList.toggle('light',theme==='light');
  localStorage.setItem('mc4_theme',theme);
  updateThemeBtn()
}
function updateThemeBtn(){document.getElementById('themeBtn').textContent=theme==='dark'?'Mode Jour':'Mode Nuit'}

/* deadline par défaut du formulaire = maintenant, en heure locale
   (datetime-local n'accepte pas le suffixe Z, d'où la correction de fuseau) */
function setDefDL(){const n=new Date(),l=new Date(n.getTime()-n.getTimezoneOffset()*60000);document.getElementById('iDL').value=l.toISOString().slice(0,16)}

/* application immédiate au chargement */
if(theme==='light')document.body.classList.add('light');
updateThemeBtn();
setDefDL();
