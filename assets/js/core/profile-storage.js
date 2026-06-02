let profileData={name:'',games:0,correct:0,wrong:0,bestScore:0,bestSpeed:0,maxStreak:0,dailyStreak:0,lastDaily:'',regStats:{},dailyDone:{}};

function loadProfile(){try{const d=localStorage.getItem('wow_profile');if(d)profileData=Object.assign(profileData,JSON.parse(d));}catch(e){}}
function saveProfile(){try{localStorage.setItem('wow_profile',JSON.stringify(profileData));}catch(e){}}
function getPlayerName(){return profileData.name||'Игрок';}

const PLAYER_RANKS=[
  {points:0,icon:'🌱',ru:'Новичок',en:'Rookie'},
  {points:300,icon:'🧭',ru:'Путешественник',en:'Traveler'},
  {points:900,icon:'🗺️',ru:'Картограф',en:'Cartographer'},
  {points:1800,icon:'🌍',ru:'Геомастер',en:'Geo Master'},
  {points:3200,icon:'🏆',ru:'Легенда глобуса',en:'Globe Legend'},
  {points:5200,icon:'🚀',ru:'Мастер мира',en:'World Master'}
];

function rankText(ru,en){
  return typeof t==='function'?t(ru,en):(window.lang==='en'?en:ru);
}

function getRankPoints(){
  const correct=profileData.correct||0;
  const games=profileData.games||0;
  const best=profileData.bestScore||0;
  const speed=profileData.bestSpeed||0;
  const streak=profileData.maxStreak||0;
  return Math.floor(correct*10+games*20+best/8+speed/6+streak*18);
}

function getPlayerRank(){
  const points=getRankPoints();
  let rank=PLAYER_RANKS[0];
  let next=null;
  for(let i=0;i<PLAYER_RANKS.length;i++){
    if(points>=PLAYER_RANKS[i].points)rank=PLAYER_RANKS[i];
    if(points<PLAYER_RANKS[i].points){next=PLAYER_RANKS[i];break;}
  }
  const start=rank.points;
  const end=next?next.points:start+1;
  const progress=next?Math.max(0,Math.min(100,Math.round((points-start)/(end-start)*100))):100;
  return {
    points,
    progress,
    icon:rank.icon,
    name:rankText(rank.ru,rank.en),
    nextLabel:next
      ? `${points}/${next.points} • ${rankText('до ранга','to')} ${rankText(next.ru,next.en)}`
      : rankText('Максимальный ранг открыт','Max rank unlocked')
  };
}

function renderRankCard(){
  const rank=getPlayerRank();
  const icon=document.getElementById('rank-icon');
  const name=document.getElementById('rank-name');
  const fill=document.getElementById('rank-fill');
  const next=document.getElementById('rank-next');
  if(icon)icon.textContent=rank.icon;
  if(name)name.textContent=rank.name;
  if(fill)fill.style.width=rank.progress+'%';
  if(next)next.textContent=rank.nextLabel;
}

window.getPlayerRank=getPlayerRank;
window.renderRankCard=renderRankCard;

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
  renderRankCard();
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
  renderRankCard();
  document.getElementById('prof-save-btn').textContent='✓';
  setTimeout(()=>document.getElementById('prof-save-btn').textContent='Сохранить',1500);
});
