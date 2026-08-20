/* ═══════════════════════════════════════════════════════════
   Time Manager (Calendar) — BLOC 20 : RENDU MAÎTRE & DÉMARRAGE
   20.1 bascules d'interface · 20.2 render() · 20.3 boucle et boot
   ═══════════════════════════════════════════════════════════ */

/* 20.1 */
function toggleAdd(){document.getElementById('addPanel').classList.toggle('open')}

function switchTab(t){
    tab=t;
    document.querySelectorAll('.tab').forEach(e=>e.classList.remove('active'));
    document.querySelector(`.tab[data-tab="${t}"]`).classList.add('active');
    render();
}

/* 20.2 — point d'entrée unique du rendu. Purge d'abord les masquages expirés,
   puis reconstruit statistiques, temps libre, calendrier, liste et pastilles. */
function render(){
    tasks.forEach(t=>{if(t.hiddenUntil&&new Date()>=new Date(t.hiddenUntil))t.hiddenUntil=null});
    renderStats();renderFt();renderCal();renderTasks();renderCP('cpAdd',selColor,'setAddColor');
}

/* 20.3 — premier rendu, puis rafraîchissement chaque minute pour tenir à jour
   les comptes à rebours, la ligne "maintenant" et les priorités. */
render();
setInterval(render,6e4);
