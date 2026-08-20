/* ═══════════════════════════════════════════════════════════
   Time Manager (Calendar) — BLOC 16 : LISTE DES MISSIONS
   16.1 liste (sous le calendrier ou filtrée par priorité)
   16.2 carte de mission
   ═══════════════════════════════════════════════════════════ */

/* 16.1 — sur l'onglet Calendrier : toutes les missions, triées par deadline.
   Sur un onglet de priorité : filtrage sur _p. Les masquées vont en fin de liste. */
function renderTasks(){
    const el=document.getElementById('taskList');

    if(tab==='calendar'){
        let list=tasks.map((t,i)=>({...t,_i:i,_p:getPriority(t)}));
        list.sort((a,b)=>new Date(a.deadline)-new Date(b.deadline));
        if(!list.length){el.innerHTML='';return}
        const vis=list.filter(t=>!isHidden(t));
        const hid=list.filter(t=>isHidden(t));
        let h='<div class="lh">Missions</div>';
        h+=vis.map(t=>taskHTML(t)).join('');
        if(hid.length)h+=`<div class="lh">Masquees</div>`+hid.map(t=>taskHTML(t,true)).join('');
        el.innerHTML=h;return;
    }

    let list=tasks.map((t,i)=>({...t,_i:i,_p:getPriority(t)}));
    if(tab!=='all')list=list.filter(t=>t._p===tab);
    list.sort((a,b)=>new Date(a.deadline)-new Date(b.deadline));
    if(!list.length){el.innerHTML='<div class="empty">Aucune mission.</div>';return}
    const vis=list.filter(t=>!isHidden(t)),hid=list.filter(t=>isHidden(t));
    let h=vis.map(t=>taskHTML(t)).join('');
    if(hid.length)h+=`<div class="lh">Masquees</div>`+hid.map(t=>taskHTML(t,true)).join('');
    el.innerHTML=h;
}

/* 16.2 — t est un objet enrichi (_i = index dans tasks, _p = priorité).
   dim = mission masquée : actions réduites et opacité abaissée. */
function taskHTML(t,dim=false){
    const p=t._p,cd=getCountdown(t),ov=isOverdue(t);
    const cl=(CATS[t.category]||CATS.none).label;
    const d=new Date(t.deadline);
    const dl=d.toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'})+' '+f24(d);
    const fh=getFreeHours(t);
    return`<div class="tk${dim?' dim':''}${ov&&!dim?' overdue':''}"><div class="tk-row"><div class="tk-bar" style="background:${t.color}"></div><div class="tk-info"><div class="tk-name"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${pColor(p)};margin-right:4px"></span>${esc(t.title)}${t.recurring&&t.recurring.type!=='none'?' <span style="font-size:9px;color:var(--t3)">↻</span>':''}</div><div class="tk-sub">${esc(t.description||'')} <span style="opacity:.6">[${cl}]</span></div></div><div class="tk-right"><span class="tk-tag" style="background:${pColor(p)}18;color:${pColor(p)}">${pLabel(p)}</span><div class="tk-dl">${dl}</div><div class="tk-cd"><div class="big" style="color:${pColor(p)}">${cd.big}</div><div class="sm">${cd.sub}${fh!==null?' | '+fh+'h dispo':''}</div></div></div></div><div class="tk-acts">${!dim?`<button onclick="hideTask(${t._i})">Masquer</button>`:''} ${ov?`<button class="esc" onclick="postponeTask(${t._i})">Reporter</button>`:''}<button onclick="openEdit(${t._i})">Modifier</button><button onclick="exportICS(${t._i})">Outlook</button><button onclick="completeTask(${t._i})">Terminer</button><button onclick="deleteTask(${t._i})">Supprimer</button></div></div>`;
}
