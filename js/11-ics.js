/* ═══════════════════════════════════════════════════════════
   Time Manager (Calendar) — BLOC 19 : ICALENDAR
   19.1 génération · 19.2 export · 19.3 import
   Chaque mission devient un VEVENT d'une heure, avec un rappel
   30 minutes avant. UID + SEQUENCE permettent la mise à jour
   d'un événement déjà importé dans Outlook / Google Agenda.
   ═══════════════════════════════════════════════════════════ */

/* 19.1 */
function buildICS(items){
    const f=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''),now=f(new Date());
    let c='BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//TimeManager//FR\r\nMETHOD:PUBLISH\r\n';
    items.forEach(t=>{
        const s=new Date(t.deadline),e=new Date(s.getTime()+36e5);   // durée fixe : 1 h
        c+=`BEGIN:VEVENT\r\nUID:${t.uid}\r\nSEQUENCE:${t.sequence||0}\r\nDTSTAMP:${now}\r\nDTSTART:${f(s)}\r\nDTEND:${f(e)}\r\nSUMMARY:${t.title}\r\nDESCRIPTION:${(t.description||'').replace(/\n/g,'\\n')}\r\n`;
        if(t.recurring&&t.recurring.type!=='none'){
            const freq={daily:'DAILY',weekly:'WEEKLY',monthly:'MONTHLY'}[t.recurring.type];
            c+='RRULE:FREQ='+freq;
            if(t.recurring.endDate)c+=';UNTIL='+t.recurring.endDate.replace(/-/g,'')+'T235959Z';
            c+='\r\n';
        }
        c+=`BEGIN:VALARM\r\nTRIGGER:-PT30M\r\nACTION:DISPLAY\r\nDESCRIPTION:Rappel\r\nEND:VALARM\r\nEND:VEVENT\r\n`;
    });
    return c+'END:VCALENDAR';
}

/* 19.2 */
function dlICS(c,fn){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([c],{type:'text/calendar'}));a.download=fn;a.click()}
function exportICS(i){const t=tasks[i];if(!t.deadline)return alert('Pas de deadline.');dlICS(buildICS([t]),t.title.replace(/\s+/g,'_')+'.ics')}
function exportAllICS(){const it=tasks.filter(t=>t.deadline);if(!it.length)return alert('Aucune mission.');dlICS(buildICS(it),'TimeManager.ics')}

/* 19.3 — parseur volontairement minimal : SUMMARY, DTSTART, DESCRIPTION, RRULE.
   Les lignes repliées (folding RFC 5545) ne sont pas gérées. */
function handleImport(ev){
    const file=ev.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=function(e){
        const txt=e.target.result;
        const blocks=txt.split('BEGIN:VEVENT');
        let count=0;
        blocks.forEach((b,i)=>{
            if(i===0)return;                                  // préambule VCALENDAR
            const end=b.indexOf('END:VEVENT');if(end===-1)return;
            const c=b.substring(0,end);
            const summary=(c.match(/SUMMARY:(.*)/)||[,''])[1].trim();
            const dtstart=(c.match(/DTSTART[^:]*:(.*)/)||[,''])[1].trim();
            const desc=(c.match(/DESCRIPTION:(.*)/)||[,''])[1].trim().replace(/\\n/g,'\n');
            if(!summary||!dtstart)return;

            let dl;
            if(dtstart.length===8)dl=dtstart.substr(0,4)+'-'+dtstart.substr(4,2)+'-'+dtstart.substr(6,2)+'T12:00';   // journée entière -> midi
            else dl=dtstart.substr(0,4)+'-'+dtstart.substr(4,2)+'-'+dtstart.substr(6,2)+'T'+dtstart.substr(9,2)+':'+dtstart.substr(11,2);

            let rec={type:'none',endDate:''};
            const rrMatch=c.match(/RRULE:(.*)/);
            if(rrMatch){
                const rr=rrMatch[1];
                if(rr.includes('DAILY'))rec.type='daily';
                else if(rr.includes('WEEKLY'))rec.type='weekly';
                else if(rr.includes('MONTHLY'))rec.type='monthly';
                const untilM=rr.match(/UNTIL=(\d{8})/);
                if(untilM)rec.endDate=untilM[1].substr(0,4)+'-'+untilM[1].substr(4,2)+'-'+untilM[1].substr(6,2);
            }

            tasks.push({title:summary,description:desc,deadline:dl,category:'none',color:COLORS[Math.floor(Math.random()*COLORS.length)],uid:uid(),sequence:0,hiddenUntil:null,recurring:rec});
            count++;
        });
        save();render();
        alert(count+' evenement(s) importe(s).');
    };
    reader.readAsText(file);
    ev.target.value='';                                        // permet de réimporter le même fichier
}
