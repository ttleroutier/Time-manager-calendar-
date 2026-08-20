/* ═══════════════════════════════════════════════════════════
   Time Manager (Calendar) — BLOC 18 : CRUD
   18.1 création · 18.2 suppression / achèvement
   18.3 masquage et report · 18.4 édition
   Toute mutation se termine par save() puis render() :
   les index _i des gestionnaires restent ainsi toujours valides.
   ═══════════════════════════════════════════════════════════ */

/* 18.1 — titre et deadline sont obligatoires */
function addTask(){
    const title=document.getElementById('iTitle').value.trim();
    const desc=document.getElementById('iDesc').value.trim();
    const dl=document.getElementById('iDL').value;
    const cat=document.getElementById('iCat').value;
    const rec=document.getElementById('iRecur').value;
    const recEnd=document.getElementById('iRecurEnd').value;

    if(!title)return alert('Titre requis.');
    if(!dl)return alert('Deadline requise.');

    tasks.push({title,description:desc,deadline:dl,category:cat,color:selColor,uid:uid(),sequence:0,hiddenUntil:null,recurring:{type:rec,endDate:recEnd}});
    save();render();

    document.getElementById('iTitle').value='';document.getElementById('iDesc').value='';
    document.getElementById('iRecur').value='none';document.getElementById('iRecurEnd').value='';
    setDefDL();
}

/* 18.2 — "Terminer" et "Supprimer" font la même chose : il n'y a pas d'historique */
function deleteTask(i){if(confirm('Supprimer ?')){tasks.splice(i,1);save();render()}}
function completeTask(i){tasks.splice(i,1);save();render()}

/* 18.3 — masquage jusqu'à 03:00 du lendemain matin ; le flag expire seul dans render() */
function hideTask(i){const n=new Date();let u=new Date(n);u.setHours(3,0,0,0);if(u<=n)u.setDate(u.getDate()+1);tasks[i].hiddenUntil=u.toISOString();save();render()}

/* report d'une mission dépassée à aujourd'hui 23:59, avec incrément de SEQUENCE
   pour que les clients iCalendar acceptent la mise à jour */
function postponeTask(i){const n=new Date(),l=new Date(n.getTime()-n.getTimezoneOffset()*6e4);tasks[i].deadline=l.toISOString().slice(0,11)+'23:59';tasks[i].sequence=(tasks[i].sequence||0)+1;save();render()}

/* 18.4 — l'index édité transite par le champ caché #eIdx */
function openEdit(i){
    const t=tasks[i];
    document.getElementById('eTitle').value=t.title;
    document.getElementById('eDesc').value=t.description||'';
    document.getElementById('eDL').value=t.deadline||'';
    document.getElementById('eCat').value=t.category||'none';
    document.getElementById('eRecur').value=(t.recurring&&t.recurring.type)||'none';
    document.getElementById('eRecurEnd').value=(t.recurring&&t.recurring.endDate)||'';
    document.getElementById('eIdx').value=i;
    editColor=t.color||COLORS[0];
    renderCP('cpEdit',editColor,'setEditColor');
    document.getElementById('editModal').classList.add('show');
}
function closeEdit(){document.getElementById('editModal').classList.remove('show')}

function saveEdit(){
    const i=+document.getElementById('eIdx').value;
    tasks[i].title=document.getElementById('eTitle').value.trim();
    tasks[i].description=document.getElementById('eDesc').value.trim();
    tasks[i].deadline=document.getElementById('eDL').value;
    tasks[i].category=document.getElementById('eCat').value;
    tasks[i].color=editColor;
    tasks[i].recurring={type:document.getElementById('eRecur').value,endDate:document.getElementById('eRecurEnd').value};
    tasks[i].sequence=(tasks[i].sequence||0)+1;
    save();closeEdit();render();
}
