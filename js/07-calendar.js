/* ═══════════════════════════════════════════════════════════
   Time Manager (Calendar) — BLOC 15 : CALENDRIER
   15.1 aiguillage · 15.2 en-tête commun · 15.3 vue semaine
   15.4 vue jour · 15.5 vue mois · 15.6 navigation
   Positionnement vertical : top = heure décimale x HH pixels.
   ═══════════════════════════════════════════════════════════ */

/* 15.1 */
function renderCal(){
    const el=document.getElementById('calContainer');
    if(tab!=='calendar'){el.innerHTML='';return}
    if(calView==='week')renderWeek(el);
    else if(calView==='day')renderDay(el);
    else renderMonth(el);
}

/* 15.2 — flèches, bouton "Auj.", titre, et sélecteur de vue */
function calHeader(titleText){
    return`<div class="cal-head"><div class="cal-nav"><button onclick="navCal(-1)">&lt;</button><button onclick="navCal(0)">Auj.</button><button onclick="navCal(1)">&gt;</button></div><h2>${titleText}</h2><div class="view-btns"><button class="${calView==='week'?'vactive':''}" onclick="setView('week')">Semaine</button><button class="${calView==='month'?'vactive':''}" onclick="setView('month')">Mois</button>${calView==='day'?'<button onclick="setView(\'week\')">← Retour</button>':''}</div></div>`;
}

/* 15.3 — 7 colonnes. Double-clic sur un en-tête ou une colonne = zoom jour. */
function renderWeek(el){
    const mon=getMon(calDate);
    const days=[];for(let i=0;i<7;i++){const d=new Date(mon);d.setDate(d.getDate()+i);days.push(d)}
    const end=new Date(days[6]);end.setDate(end.getDate()+1);
    const events=eventsInRange(mon,end);
    const today=new Date();
    const title=mon.toLocaleDateString('fr-FR',{day:'numeric',month:'short'})+' - '+days[6].toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'});

    let h=calHeader(title);
    h+=`<div class="sv"><div class="sv-head"><div class="sv-tc"></div>`;
    days.forEach((d,i)=>{
        const isT=sameDay(d,today);
        h+=`<div class="sv-dh${isT?' today':''}" ondblclick="calDate=new Date(${d.getTime()});setView('day')"><div class="dn">${DN[i]}</div><div class="dd">${d.getDate()}</div></div>`;
    });
    h+=`</div><div class="sv-scroll" id="svScroll" style="height:calc(100vh - 260px)"><div class="sv-body">`;

    // colonne des heures
    h+=`<div class="sv-times">`;
    for(let hr=0;hr<24;hr++)h+=`<div class="sv-tl">${String(hr).padStart(2,'0')}:00</div>`;
    h+=`</div>`;

    // une colonne par jour : trame horaire, bandeau de temps libre, événements
    days.forEach((d,di)=>{
        h+=`<div class="sv-col" ondblclick="calDate=new Date(${d.getTime()});setView('day')">`;
        for(let hr=0;hr<24;hr++)h+=`<div class="sv-slot"></div>`;

        const dow=DK[(d.getDay()+6)%7],slot=ft[dow];
        if(slot&&slot.s&&slot.e){const sh=timeToH(slot.s),eh=timeToH(slot.e);if(eh>sh)h+=`<div class="sv-free" style="top:${sh*HH}px;height:${(eh-sh)*HH}px"></div>`}

        const dayEv=events.filter(e=>sameDay(e.date,d)&&!isHidden(e));
        dayEv.forEach(e=>{
            const hr=e.date.getHours()+e.date.getMinutes()/60;
            h+=`<div class="sv-ev" style="top:${hr*HH}px;height:${HH-2}px;background:${e.color}22;border-color:${e.color};color:${e.color}" onclick="event.stopPropagation();showDet(${e._i})"><div class="ev-time">${f24(e.date)}</div><div class="ev-title">${esc(e.title)}</div></div>`;
        });
        h+=`</div>`;
    });

    // ligne rouge "maintenant", seulement si la semaine contient aujourd'hui
    if(days.some(d=>sameDay(d,today))){
        const nowMin=today.getHours()*60+today.getMinutes();
        h+=`<div class="sv-now" style="top:${nowMin/60*HH}px"></div>`;
    }

    h+=`</div></div></div>`;
    el.innerHTML=h;
    const sc=document.getElementById('svScroll');if(sc)sc.scrollTop=7*HH;   // cadrage sur 07:00
}

/* 15.4 — même grille, une seule colonne, description affichée en plus */
function renderDay(el){
    const d=new Date(calDate);d.setHours(0,0,0,0);
    const end=new Date(d);end.setDate(end.getDate()+1);
    const events=eventsInRange(d,end).filter(e=>!isHidden(e));
    const today=new Date();
    const title=d.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

    let h=calHeader(title);
    h+=`<div class="sv"><div class="sv-head"><div class="sv-tc"></div><div class="sv-dh${sameDay(d,today)?' today':''}" style="flex:1"><div class="dn">${DN[(d.getDay()+6)%7]}</div><div class="dd">${d.getDate()}</div></div></div>`;
    h+=`<div class="sv-scroll" id="svScroll" style="height:calc(100vh - 260px)"><div class="sv-body"><div class="sv-times">`;
    for(let hr=0;hr<24;hr++)h+=`<div class="sv-tl">${String(hr).padStart(2,'0')}:00</div>`;
    h+=`</div><div class="sv-col" style="flex:1">`;
    for(let hr=0;hr<24;hr++)h+=`<div class="sv-slot"></div>`;

    const dow=DK[(d.getDay()+6)%7],slot=ft[dow];
    if(slot&&slot.s&&slot.e){const sh=timeToH(slot.s),eh=timeToH(slot.e);if(eh>sh)h+=`<div class="sv-free" style="top:${sh*HH}px;height:${(eh-sh)*HH}px"></div>`}

    events.forEach(e=>{
        const hr=e.date.getHours()+e.date.getMinutes()/60;
        h+=`<div class="sv-ev" style="top:${hr*HH}px;height:${HH-2}px;background:${e.color}22;border-color:${e.color};color:${e.color}" onclick="showDet(${e._i})"><div class="ev-time">${f24(e.date)}</div><div class="ev-title">${esc(e.title)}${e.description?' - '+esc(e.description):''}</div></div>`;
    });

    if(sameDay(d,today)){const nm=today.getHours()*60+today.getMinutes();h+=`<div class="sv-now" style="top:${nm/60*HH}px;left:48px"></div>`}
    h+=`</div></div></div></div>`;
    el.innerHTML=h;
    const sc=document.getElementById('svScroll');if(sc)sc.scrollTop=7*HH;
}

/* 15.5 — grille de 5 ou 6 semaines, débordements des mois voisins en .other */
function renderMonth(el){
    const first=new Date(calDate.getFullYear(),calDate.getMonth(),1);
    const last=new Date(calDate.getFullYear(),calDate.getMonth()+1,0);
    const startDay=(first.getDay()+6)%7;                    // décalage lundi
    const dim=last.getDate();
    const prevLast=new Date(calDate.getFullYear(),calDate.getMonth(),0).getDate();
    const mn=first.toLocaleDateString('fr-FR',{month:'long',year:'numeric'});
    const today=new Date();
    const mStart=new Date(first);mStart.setDate(mStart.getDate()-startDay);
    const tot=Math.ceil((startDay+dim)/7)*7;
    const mEnd=new Date(mStart);mEnd.setDate(mEnd.getDate()+tot);
    const events=eventsInRange(mStart,mEnd);

    let h=calHeader(mn.charAt(0).toUpperCase()+mn.slice(1));
    h+=`<div class="mo-grid">`;
    DN.forEach(d=>h+=`<div class="mo-dh">${d}</div>`);

    for(let i=0;i<tot;i++){
        let day,mo=calDate.getMonth(),yr=calDate.getFullYear(),ot=false;
        if(i<startDay){day=prevLast-startDay+i+1;mo--;ot=true}
        else if(i>=startDay+dim){day=i-startDay-dim+1;mo++;ot=true}
        else day=i-startDay+1;
        if(mo<0){mo=11;yr--}if(mo>11){mo=0;yr++}
        const cellDate=new Date(yr,mo,day);
        const isT=!ot&&sameDay(cellDate,today);
        const dayEv=events.filter(e=>sameDay(e.date,cellDate)&&!isHidden(e));

        h+=`<div class="mo-cell${isT?' today':''}${ot?' other':''}" ondblclick="calDate=new Date(${cellDate.getTime()});setView('day')"><div class="mo-dn">${day}</div>`;
        dayEv.slice(0,3).forEach(e=>h+=`<div class="mo-ev" style="background:${e.color}15;color:${e.color};border-color:${e.color}" onclick="event.stopPropagation();showDet(${e._i})">${f24(e.date)} ${esc(e.title)}</div>`);
        if(dayEv.length>3)h+=`<div class="mo-more">+${dayEv.length-3}</div>`;
        h+=`</div>`;
    }
    h+=`</div>`;
    el.innerHTML=h;
}

/* 15.6 — le pas de navigation dépend de la vue courante */
function setView(v){calView=v;render()}
function navCal(dir){
    if(dir===0){calDate=new Date();render();return}
    if(calView==='week'){calDate.setDate(calDate.getDate()+dir*7)}
    else if(calView==='month'){calDate.setMonth(calDate.getMonth()+dir)}
    else{calDate.setDate(calDate.getDate()+dir)}
    render();
}
