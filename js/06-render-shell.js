/* ═══════════════════════════════════════════════════════════
   Time Manager (Calendar) — BLOC 14 : RENDU DE L'ENVELOPPE
   14.1 horloge · 14.2 statistiques et compteurs d'onglets
   14.3 plages de temps libre · 14.4 sélecteur de couleur
   ═══════════════════════════════════════════════════════════ */

/* 14.1 — rafraîchie toutes les 30 s (indépendamment du render() global) */
function updateClock(){
  const n=new Date();
  document.getElementById('clock').textContent=n.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})+' '+f24(n)
}
updateClock();setInterval(updateClock,30000);

/* 14.2 — met à jour les 5 tuiles et les pastilles de comptage des onglets */
function renderStats(){
    const c={green:0,orange:0,red:0,black:0};
    tasks.forEach(t=>c[getPriority(t)]++);
    document.getElementById('b-all').textContent=tasks.length;
    Object.keys(c).forEach(k=>{const e=document.getElementById('b-'+k);if(e)e.textContent=c[k]});
    document.getElementById('stats').innerHTML=[
        ['Total',tasks.length,'var(--tx)'],
        ['A faire',c.green,'var(--gn)'],
        ['Priorite',c.orange,'var(--or)'],
        ['Urgent',c.red,'var(--rd)'],
        ['Critique',c.black,'var(--bk)']
    ].map(([l,n,col])=>`<div class="st"><div class="n" style="color:${col}">${n}</div><div class="l">${l}</div></div>`).join('');
}

/* 14.3 — panneau repliable, visible uniquement sur l'onglet Calendrier.
   Chaque champ écrit directement dans ft puis relance un rendu complet. */
function renderFt(){
    const el=document.getElementById('ftWrap');
    if(tab!=='calendar'){el.innerHTML='';return}
    el.innerHTML=`<div class="ft-wrap"><div class="ft-head" onclick="ftOpen=!ftOpen;renderFt()"><span>Plages de temps libre</span><span class="ft-toggle">${ftOpen?'▲':'▼'}</span></div><div class="ft-body${ftOpen?' open':''}"><div class="ft-grid">${
        DK.map((k,i)=>`<div class="ft-d"><div class="dl">${DN[i]}</div><div class="ft-row"><input type="time" value="${ft[k].s}" onchange="ft['${k}'].s=this.value;saveFt();render()"></div><div class="ft-row"><input type="time" value="${ft[k].e}" onchange="ft['${k}'].e=this.value;saveFt();render()"></div></div>`).join('')
    }</div></div></div>`;
}

/* 14.4 — pastilles de couleur. cb est le NOM d'une fonction globale
   (setAddColor ou setEditColor) appelée dans l'attribut onclick généré. */
function renderCP(containerId,selected,cb){
    const el=document.getElementById(containerId);
    el.innerHTML=COLORS.map(c=>`<div class="cp-d${c===selected?' sel':''}" style="background:${c}" onclick="event.stopPropagation();${cb}('${c}');document.querySelectorAll('#${containerId} .cp-d').forEach(d=>d.classList.remove('sel'));this.classList.add('sel')"></div>`).join('');
}
function setAddColor(c){selColor=c}
function setEditColor(c){editColor=c}
