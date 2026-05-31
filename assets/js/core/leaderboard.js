let lbTab='alltime';

function getLB(type){
  try{const d=localStorage.getItem('wow_lb_'+type);return d?JSON.parse(d):[];}catch(e){return [];}
}
function saveLB(type,data){
  try{localStorage.setItem('wow_lb_'+type,JSON.stringify(data));}catch(e){}}

function submitToLB(name, sc, type='alltime'){
  if(!name || sc <= 0) return;
  // Local backup
  let lb = getLB(type);
  lb = lb.filter(e => e.name !== name);
  lb.push({name, score: sc, date: new Date().toLocaleDateString('ru')});
  lb.sort((a,b) => b.score - a.score);
  saveLB(type, lb.slice(0, 100));
  // Firebase global
  if(window.fbSubmitScore) window.fbSubmitScore(name, sc, type);
}

function renderLBRows(data, myName){
  if(!data.length){
    return '<div class="lb-empty">Пока никого нет.<br>Сыграй и попади в рейтинг!</div>';
  }
  let html = '';
  data.slice(0,20).forEach((e,i) => {
    const rank = i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1)+'';
    const rClass = i===0?'g':i===1?'s':i===2?'b':'';
    const me = e.name === myName ? ' me' : '';
    html += `<div class="lb-row"><div class="lb-rank ${rClass}">${rank}</div><div class="lb-pname${me}">${e.name}</div><div class="lb-pscore">${e.score.toLocaleString()}</div></div>`;
  });
  return html;
}

async function renderLB(){
  const list = document.getElementById('lb-list');
  list.innerHTML = '<div class="lb-empty">Загрузка…</div>';
  const myName = getPlayerName();
  try{
    let data = [];
    // Try Firebase first
    if(window.fbGetLeaderboard) {
      data = await window.fbGetLeaderboard(lbTab);
    }
    // Fallback to local
    if(!data.length) data = getLB(lbTab);
    list.innerHTML = renderLBRows(data, myName);
  }catch(e){
    list.innerHTML = renderLBRows(getLB(lbTab), myName);
  }
}

function openLB(){
  lbTab='alltime';
  document.querySelectorAll('.lb-tab').forEach(t=>{t.classList.toggle('active',t.dataset.lbt===lbTab);});
  renderLB();
  document.getElementById('panel-lb').classList.add('show');
}

document.querySelectorAll('.lb-tab').forEach(t=>t.addEventListener('click',()=>{
  lbTab=t.dataset.lbt;
  document.querySelectorAll('.lb-tab').forEach(x=>x.classList.toggle('active',x.dataset.lbt===lbTab));
  renderLB();
}));

document.getElementById('lb-sub-btn').addEventListener('click',()=>{
  const n=document.getElementById('lb-name-in').value.trim();
  if(!n)return;
  profileData.name=n;saveProfile();
  submitToLB(n,profileData.bestScore||0,'alltime');
  submitToLB(n,profileData.bestSpeed||0,'speed');
  renderLB();
  document.getElementById('lb-submit-wrap').style.display='none';
});
