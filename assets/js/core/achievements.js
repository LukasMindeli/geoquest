const ACHIEVEMENTS=[
  {id:'first',ico:'🌍',name:'Первый шаг',desc:'Сыграй первую игру',check:()=>(profileData.games||0)>=1},
  {id:'ten',ico:'🔟',name:'10 игр',desc:'Сыграй 10 игр',check:()=>(profileData.games||0)>=10},
  {id:'fifty',ico:'🎯',name:'Ветеран',desc:'Сыграй 50 игр',check:()=>(profileData.games||0)>=50},
  {id:'acc80',ico:'🎓',name:'Знаток',desc:'80%+ точность (мин. 20 вопросов)',check:()=>{const t=(profileData.correct||0)+(profileData.wrong||0);return t>=20&&(profileData.correct/t)>=0.8;}},
  {id:'acc95',ico:'🏅',name:'Эксперт',desc:'95%+ точность (мин. 50 вопросов)',check:()=>{const t=(profileData.correct||0)+(profileData.wrong||0);return t>=50&&(profileData.correct/t)>=0.95;}},
  {id:'streak5',ico:'🔥',name:'Серия ×5',desc:'Серия из 5 правильных подряд',check:()=>(profileData.maxStreak||0)>=5},
  {id:'streak10',ico:'💥',name:'Серия ×10',desc:'Серия из 10 правильных подряд',check:()=>(profileData.maxStreak||0)>=10},
  {id:'speed500',ico:'⚡',name:'Скоростной',desc:'Набери 500+ в режиме "На время"',check:()=>(profileData.bestSpeed||0)>=500},
  {id:'speed1000',ico:'🚀',name:'Ракета',desc:'Набери 1000+ в режиме "На время"',check:()=>(profileData.bestSpeed||0)>=1000},
  {id:'daily3',ico:'📅',name:'Привычка',desc:'3 дня подряд ежедневного челленджа',check:()=>(profileData.dailyStreak||0)>=3},
  {id:'daily7',ico:'🗓️',name:'Недельник',desc:'7 дней подряд ежедневного челленджа',check:()=>(profileData.dailyStreak||0)>=7},
  {id:'europe',ico:'🇪🇺',name:'Европеец',desc:'80%+ точность по Европе (мин. 10)',check:()=>{const s=profileData.regStats?.europe||{c:0,w:0};const t=s.c+s.w;return t>=10&&s.c/t>=0.8;}},
  {id:'africa',ico:'🌍',name:'Африканист',desc:'80%+ точность по Африке (мин. 10)',check:()=>{const s=profileData.regStats?.africa||{c:0,w:0};const t=s.c+s.w;return t>=10&&s.c/t>=0.8;}},
  {id:'asia',ico:'🌏',name:'Азиат',desc:'80%+ точность по Азии (мин. 10)',check:()=>{const s=profileData.regStats?.asia||{c:0,w:0};const t=s.c+s.w;return t>=10&&s.c/t>=0.8;}},
  {id:'capital',ico:'🏛️',name:'Столичный',desc:'Пройди игру "Угадай столицу" без ошибок',check:()=>(profileData.capitalPerfect||0)>=1},
  {id:'flag',ico:'🚩',name:'Вексиллолог',desc:'Угадай 10 флагов подряд',check:()=>(profileData.flagStreak||0)>=10},
];

function renderAchievements(){
  loadProfile();
  const unlocked=profileData.unlocked||{};
  const grid=document.getElementById('ach-grid');grid.innerHTML='';
  let cnt=0;
  ACHIEVEMENTS.forEach(a=>{
    const ok=unlocked[a.id]||false;
    if(ok)cnt++;
    grid.innerHTML+=`<div class="ach-card${ok?' unlocked':''}">
      <div class="ach-ico">${a.ico}</div>
      <div><div class="ach-name">${a.name}</div><div class="ach-desc">${a.desc}</div></div>
      <div class="ach-check">✓</div>
    </div>`;
  });
  document.getElementById('ach-count').textContent=cnt+'/'+ACHIEVEMENTS.length;
}

function checkAchievements(){
  if(!profileData.unlocked)profileData.unlocked={};
  ACHIEVEMENTS.forEach(a=>{
    if(!profileData.unlocked[a.id]&&a.check()){
      profileData.unlocked[a.id]=true;
      showAchToast(a.ico+' '+a.name);
    }
  });
  saveProfile();
}

function showAchToast(msg){
  const t=document.getElementById('ach-toast');
  t.textContent='🏆 '+msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3500);
}
