/* ═══════════════════════════════════════════════════════════
   Time Manager (Calendar) — BLOC 12 : PRIORITÉ & TEMPS
   12.1 calcul de priorité · 12.2 libellés et couleurs
   12.3 états (masquée, dépassée) · 12.4 heures disponibles
   12.5 compte à rebours
   La priorité est TOUJOURS dérivée, jamais stockée.
   ═══════════════════════════════════════════════════════════ */

/* 12.1 — comparaison des jours restants aux seuils de CATS, du plus urgent au moins urgent */
function getPriority(t){
    const r=CATS[t.category]||CATS.none;
    if(r.black<0)return'green';                       // catégorie "none" : jamais d'escalade
    const days=(new Date(t.deadline)-new Date())/864e5;
    if(days<=r.black)return'black';
    if(days<=r.red)return'red';
    if(days<=r.orange)return'orange';
    return'green';
}

/* 12.2 */
function pLabel(p){return{green:'A faire',orange:'Priorite',red:'Urgent',black:'Critique'}[p]||''}
function pColor(p){return{green:'var(--gn)',orange:'var(--or)',red:'var(--rd)',black:'var(--bk)'}[p]||'var(--t2)'}

/* 12.3 */
function isHidden(t){return t.hiddenUntil&&new Date()<new Date(t.hiddenUntil)}
function isOverdue(t){return t.deadline&&new Date(t.deadline)<new Date()}

/* 12.4 — somme des plages de temps libre entre maintenant et la deadline.
   Approximation volontaire : chaque jour parcouru compte sa plage entière. */
function getFreeHours(t){
    if(!t.deadline)return null;
    const diff=new Date(t.deadline)-new Date();if(diff<=0)return 0;
    let total=0;const d=new Date();
    while(d<new Date(t.deadline)){
      const dow=DK[(d.getDay()+6)%7];const slot=ft[dow];
      if(slot){const sh=parseFloat(slot.s)||0,eh=parseFloat(slot.e)||0;const hrs=Math.max(0,(eh-sh));total+=hrs}
      d.setDate(d.getDate()+1)
    }
    return Math.round(total*10)/10;
}

/* 12.5 — renvoie {big, sub} : valeur mise en avant + précision sous-titre */
function getCountdown(t){
    if(!t.deadline)return{big:'--',sub:''};
    const diff=new Date(t.deadline)-new Date();
    if(diff<=0){const h=Math.abs(Math.floor(diff/36e5));return{big:'-'+h+'h',sub:'Depasse'}}
    const d=Math.floor(diff/864e5),h=Math.floor((diff%864e5)/36e5),m=Math.floor((diff%36e5)/6e4);
    if(d>0)return{big:d+'j '+h+'h',sub:Math.floor(diff/36e5)+'h'};
    if(h>0)return{big:h+'h '+m+'m',sub:'<1 jour'};
    return{big:m+'min',sub:'Imminent'};
}
