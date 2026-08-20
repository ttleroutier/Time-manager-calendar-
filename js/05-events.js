/* ═══════════════════════════════════════════════════════════
   Time Manager (Calendar) — BLOC 13 : OCCURRENCES
   13.1 expansion des récurrences sur une plage de dates
   Une mission récurrente n'est stockée QU'UNE FOIS. Les occurrences
   sont calculées à la volée pour la vue affichée et jamais persistées.
   ═══════════════════════════════════════════════════════════ */

/* Renvoie des copies {...mission, _i: index dans tasks, date: Date, _rec: true}
   _i est l'index utilisé par les gestionnaires onclick générés au rendu. */
function eventsInRange(start,end){
    const out=[];
    tasks.forEach((t,i)=>{
        if(!t.deadline)return;
        const base=new Date(t.deadline);

        // mission simple : une seule occurrence, si elle tombe dans la plage
        if(!t.recurring||t.recurring.type==='none'){
            if(base>=start&&base<end)out.push({...t,_i:i,date:base});return;
        }

        // mission récurrente : on itère depuis la deadline d'origine
        const rEnd=t.recurring.endDate?new Date(t.recurring.endDate+'T23:59'):new Date(end);
        let cur=new Date(base);let safety=0;
        while(cur<end&&cur<=rEnd&&safety<500){          // garde-fou anti boucle infinie
            if(cur>=start)out.push({...t,_i:i,date:new Date(cur),_rec:true});
            safety++;
            const nc=new Date(cur);
            if(t.recurring.type==='daily')nc.setDate(nc.getDate()+1);
            else if(t.recurring.type==='weekly')nc.setDate(nc.getDate()+7);
            else if(t.recurring.type==='monthly')nc.setMonth(nc.getMonth()+1);
            if(nc<=cur)break;                            // sécurité si le pas n'avance pas
            cur=nc;
        }
    });
    return out;
}
