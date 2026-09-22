(()=>{
  'use strict';
  const DAYS=['Mo','Di','Mi','Do','Fr'];
  const FULL_DAYS=['Montag','Dienstag','Mittwoch','Donnerstag','Freitag'];
  const TASKS=[['🥪','Vesperdose + Trinkflasche ausgeräumt'],['✏️','Hausaufgaben erledigt'],['🎒','Schulranzen gepackt']];
  const PEOPLE=[{id:'max',name:'Max',possessive:"Max'",emoji:'M'},{id:'matilda',name:'Matilda',possessive:'Matildas',emoji:'M'}];
  const now=new Date();
  const monday=getMonday(now);
  const weekKey=dateKey(monday);
  const storageKey=`mm-wochenaufgaben-${weekKey}`;
  const weekday=now.getDay();
  let selected=weekday>=1&&weekday<=5?weekday-1:0;
  let state=load();

  function getMonday(date){const d=new Date(date.getFullYear(),date.getMonth(),date.getDate());const day=d.getDay();d.setDate(d.getDate()-(day===0?6:day-1));d.setHours(0,0,0,0);return d}
  function dateKey(date){return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-')}
  function blank(){return Object.fromEntries(PEOPLE.map(p=>[p.id,Array.from({length:5},()=>[false,false,false])]))}
  function valid(data){return PEOPLE.every(p=>Array.isArray(data?.[p.id])&&data[p.id].length===5&&data[p.id].every(d=>Array.isArray(d)&&d.length===3))}
  function load(){try{const data=JSON.parse(localStorage.getItem(storageKey));return valid(data)?data:blank()}catch{return blank()}}
  function save(){try{localStorage.setItem(storageKey,JSON.stringify(state));const s=document.querySelector('#save-status');s.textContent='✓ Gespeichert';setTimeout(()=>s.textContent='Wird auf diesem Gerät gespeichert',1400)}catch{document.querySelector('#save-status').textContent='Speichern nicht möglich'}}
  const complete=(person,day)=>state[person][day].every(Boolean);

  function render(){
    renderTabs();
    renderChildren();
    const total=PEOPLE.reduce((sum,p)=>sum+DAYS.filter((_,i)=>complete(p.id,i)).length,0);
    document.querySelector('#family-stars').textContent=total;
    document.querySelector('#celebration').hidden=!(complete('max',selected)&&complete('matilda',selected));
  }
  function renderTabs(){
    const host=document.querySelector('#day-tabs');host.replaceChildren();
    DAYS.forEach((day,i)=>{const button=document.createElement('button');button.type='button';button.className=`day-tab${i===selected?' active':''}${weekday===i+1?' today':''}`;button.setAttribute('aria-current',weekday===i+1?'date':'false');button.setAttribute('aria-pressed',String(i===selected));button.innerHTML=`${day}<span>${complete('max',i)&&complete('matilda',i)?'⭐':'○'}</span>`;button.addEventListener('click',()=>{selected=i;render()});host.append(button)})
  }
  function renderChildren(){
    const host=document.querySelector('#children');host.replaceChildren();
    PEOPLE.forEach(person=>{
      const done=state[person.id][selected].filter(Boolean).length;
      const stars=DAYS.filter((_,i)=>complete(person.id,i)).length;
      const card=document.createElement('section');card.className=`child-card ${person.id}`;
      card.innerHTML=`<div class="child-head"><div class="identity"><div class="avatar">${person.emoji}</div><div><h2>${person.name}</h2><p class="progress">${FULL_DAYS[selected]}: ${done} von 3</p></div></div><div class="day-star">${done===3?'⭐':''}</div></div><div class="task-list"></div><div class="week-strip"><div class="week-strip-head"><span>${person.possessive} Woche</span><span>${stars} / 5 ⭐</span></div><div class="mini-week">${DAYS.map((d,i)=>`<div class="mini-day">${d}<span>${complete(person.id,i)?'⭐':'○'}</span></div>`).join('')}</div></div>`;
      const list=card.querySelector('.task-list');
      TASKS.forEach(([icon,text],index)=>{const checked=state[person.id][selected][index];const label=document.createElement('label');label.className=`task${checked?' done':''}`;label.innerHTML=`<input type="checkbox" ${checked?'checked':''}><span class="check">${checked?'✓':''}</span><span class="task-icon">${icon}</span><span class="task-text">${text}</span>`;label.querySelector('input').addEventListener('change',event=>{state[person.id][selected][index]=event.target.checked;save();render()});list.append(label)});
      host.append(card);
    })
  }
  const friday=new Date(monday);friday.setDate(friday.getDate()+4);
  const format=new Intl.DateTimeFormat('de-DE',{day:'2-digit',month:'2-digit',year:'numeric'});
  document.querySelector('#week-label').textContent=`${format.format(monday)} – ${format.format(friday)}`;
  document.querySelector('#weekend-note').hidden=weekday!==0&&weekday!==6;
  const dialog=document.querySelector('#reset-dialog');
  document.querySelector('#reset-day').addEventListener('click',()=>dialog.showModal());
  dialog.addEventListener('close',()=>{if(dialog.returnValue==='confirm'){PEOPLE.forEach(p=>state[p.id][selected]=[false,false,false]);save();render()}});
  render();
  if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
})();
