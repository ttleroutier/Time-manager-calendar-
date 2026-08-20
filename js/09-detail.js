/* ═══════════════════════════════════════════════════════════
   Time Manager (Calendar) — BLOC 17 : MODALE DE DÉTAIL
   17.1 ouverture · 17.2 fermeture
   Ouverte au clic sur un événement du calendrier (showDet(index)).
   Chaque action ferme d'abord la modale puis délègue au bloc 18.
   ═══════════════════════════════════════════════════════════ */

/* 17.1 */
function showDet(i){
    const t=tasks[i],p=getPriority(t),cd=getCountdown(t),d=new Date(t.deadline),cl=(CATS[t.category]||CATS.none).label;

    document.getElementById('detTitle').innerHTML=`<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${t.color};margin-right:6px"></span>`+esc(t.title);

    document.getElementById('detBody').innerHTML=`
        ${t.description?`<div class="det-row"><span class="det-label">Description</span><span>${esc(t.description)}</span></div>`:''}
        <div class="det-row"><span class="det-label">Categorie</span><span>${cl}</span></div>
        <div class="det-row"><span class="det-label">Deadline</span><span>${d.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})} ${f24(d)}</span></div>
        <div class="det-row"><span class="det-label">Priorite</span><span style="color:${pColor(p)};font-weight:700">${pLabel(p)}</span></div>
        <div class="det-row"><span class="det-label">Temps restant</span><span style="font-weight:700">${cd.big}</span></div>
        ${t.recurring&&t.recurring.type!=='none'?`<div class="det-row"><span class="det-label">Recurrence</span><span>${t.recurring.type}${t.recurring.endDate?' jusqu\'au '+t.recurring.endDate:''}</span></div>`:''}
    `;

    const ov=isOverdue(t);
    document.getElementById('detActions').innerHTML=`
        <button class="btn btn-o" onclick="closeDet();hideTask(${i})">Masquer</button>
        ${ov?`<button class="btn btn-o" style="border-color:var(--or);color:var(--or)" onclick="closeDet();postponeTask(${i})">Reporter</button>`:''}
        <button class="btn btn-o" onclick="closeDet();openEdit(${i})">Modifier</button>
        <button class="btn btn-o" onclick="closeDet();exportICS(${i})">Outlook</button>
        <button class="btn btn-p" onclick="closeDet();completeTask(${i})">Terminer</button>
    `;

    document.getElementById('detModal').classList.add('show');
}

/* 17.2 */
function closeDet(){document.getElementById('detModal').classList.remove('show')}
