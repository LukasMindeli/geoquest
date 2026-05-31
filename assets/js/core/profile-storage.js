let profileData={name:'',games:0,correct:0,wrong:0,bestScore:0,bestSpeed:0,maxStreak:0,dailyStreak:0,lastDaily:'',regStats:{},dailyDone:{}};

function loadProfile(){try{const d=localStorage.getItem('wow_profile');if(d)profileData=Object.assign(profileData,JSON.parse(d));}catch(e){}}
function saveProfile(){try{localStorage.setItem('wow_profile',JSON.stringify(profileData));}catch(e){}}
function getPlayerName(){return profileData.name||'Игрок';}

function recordStat(type,countryId){
  if(type==='correct')profileData.correct++;else profileData.wrong++;
  const reg=COUNTRIES[countryId]?.r||'world';
  if(!profileData.regStats[reg])profileData.regStats[reg]={c:0,w:0};
  if(type==='correct')profileData.regStats[reg].c++;else profileData.regStats[reg].w++;
  saveProfile();
}

function openProfile(){
  loadProfile();
  document.getElementById('prof-name-input').value=profileData.name||'';
  document.getElementById('prof-games').textContent=profileData.games||0;
  document.getElementById('prof-correct').textContent=profileData.correct||0;
  const tot=(profileData.correct||0)+(profileData.wrong||0);
  document.getElementById('prof-pct').textContent=tot?Math.round(profileData.correct/tot*100)+'%':'0%';
  document.getElementById('prof-best').textContent=profileData.bestScore||0;
  document.getElementById('prof-streak').textContent=profileData.maxStreak||0;
  document.getElementById('prof-daily').textContent=profileData.dailyStreak||0;
  // Region bars
  const bars=document.getElementById('prof-reg-bars');bars.innerHTML='';
  const regs=['world','europe','asia','americas','africa','oceania'];
  const rnames={world:'Мир',europe:'Европа',asia:'Азия',americas:'Америка',africa:'Африка',oceania:'Океания'};
  regs.forEach(r=>{
    const s=profileData.regStats[r]||{c:0,w:0};
    const tot=s.c+s.w;const pct=tot?Math.round(s.c/tot*100):0;
    bars.innerHTML+=`<div class="rb-row"><div class="rb-name">${rnames[r]}</div><div class="rb-bg"><div class="rb-fill" style="width:${pct}%"></div></div><div class="rb-pct">${pct}%</div></div>`;
  });
  document.getElementById('panel-profile').classList.add('show');
}

document.getElementById('prof-save-btn').addEventListener('click',()=>{
  profileData.name=document.getElementById('prof-name-input').value.trim()||'Игрок';
  saveProfile();
  document.getElementById('prof-save-btn').textContent='✓';
  setTimeout(()=>document.getElementById('prof-save-btn').textContent='Сохранить',1500);
});
