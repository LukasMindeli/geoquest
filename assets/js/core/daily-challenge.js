window.__dailyRun = null;
const DAILY_MONTHS = {
  ru: ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],
  en: ['January','February','March','April','May','June','July','August','September','October','November','December']
};

function beginDailyRun(){
  window.__dailyRun = { key: getDailyKey() };
}

function finishDailyRun(resultScore){
  const run = window.__dailyRun;
  if(!run) return;
  window.__dailyRun = null;
  if(!profileData.dailyDone) profileData.dailyDone = {};
  const alreadyDoneToday = profileData.dailyDone[run.key] !== undefined;
  profileData.dailyDone[run.key] = resultScore;
  if(!alreadyDoneToday){
    const yesterday = new Date(Date.now()-86400000);
    const yk = `${yesterday.getFullYear()}-${yesterday.getMonth()+1}-${yesterday.getDate()}`;
    if(profileData.dailyDone[yk] !== undefined) profileData.dailyStreak = (profileData.dailyStreak||0)+1;
    else profileData.dailyStreak = 1;
  }
}

function cancelDailyRun(){
  window.__dailyRun = null;
}

function getDailyKey(){
  const d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;}

function formatDailyDate(date = new Date()){
  const months = (typeof lang !== 'undefined' && lang === 'en') ? DAILY_MONTHS.en : DAILY_MONTHS.ru;
  if(typeof lang !== 'undefined' && lang === 'en'){
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function refreshDailyUI(){
  const dateLabel = document.getElementById('daily-date-lbl');
  if(dateLabel) dateLabel.textContent = formatDailyDate();
}

window.refreshDailyUI = refreshDailyUI;

function openDaily(){
  loadProfile();
  const key=getDailyKey();
  const d=new Date();
  document.getElementById('daily-date-lbl').textContent=formatDailyDate(d);
  if(profileData.dailyDone&&profileData.dailyDone[key]!==undefined){
    document.getElementById('daily-done-wrap').style.display='block';
    document.getElementById('daily-play-wrap').style.display='none';
    document.getElementById('daily-done-score').textContent=profileData.dailyDone[key];
  } else {
    document.getElementById('daily-done-wrap').style.display='none';
    document.getElementById('daily-play-wrap').style.display='block';
  }
  document.getElementById('panel-daily').classList.add('show');
}

let dailyMode='click';
document.querySelectorAll('.dmb').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.dmb').forEach(x=>x.classList.remove('sel'));
  b.classList.add('sel');dailyMode=b.dataset.dm;
}));

document.getElementById('daily-start-btn').addEventListener('click',()=>{
  closePanel('panel-daily');
  // Use seeded shuffle for same order everyone
  const seed=parseInt(getDailyKey().replace(/-/g,''));
  function seededRand(s){let x=Math.sin(s)*10000;return x-Math.floor(x);}
  const ids=Object.keys(COUNTRIES).map(Number);
  const sorted=[...ids].sort((a,b)=>seededRand(seed+a)-seededRand(seed+b));
  const pool=sorted.slice(0,QS).map(id=>({id,name:cName(id)}));

  beginDailyRun();
  if(dailyMode==='speed'){startSpeed('flag');return;}
  if(dailyMode==='flag'){soloMode='flag';}
  else soloMode=dailyMode;
  soloReg='world';
  const dailyQS=10;
  score=0;lives=LIVES;streak=0;qIdx=0;prog=new Array(dailyQS).fill(null);
  activePool=pool;
  showScreen('solo');
  document.getElementById('hud').classList.add('show');
  document.getElementById('type-wrap').style.display=(soloMode!=='click')?'block':'none';
  buildDots();updHUD();nextQ();
});

document.getElementById('hud-exit').addEventListener('click', cancelDailyRun);
document.getElementById('speed-exit-btn').addEventListener('click', cancelDailyRun);
document.getElementById('sp-btn-menu').addEventListener('click', cancelDailyRun);
