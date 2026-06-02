function closePanel(id){document.getElementById(id).classList.remove('show');}

const MC_MODES = new Set(['landmark','leader','religion']);
let mcLocked = false;

function isMcMode(m){ return MC_MODES.has(m||soloMode); }

function getMcChoices(mode, id, pool){
  const L = ['A','B','C','D','E','F'];
  if(mode==='religion'){
    const correctRaw = RELIGIONS[id];
    if(!correctRaw) return null;
    const wrong = shuffled(ALL_RELIGIONS.filter(r=>r!==correctRaw)).slice(0,5);
    return shuffled([correctRaw,...wrong]).map((r,i)=>({label:L[i],text:localizedReligionName(r),correct:r===correctRaw}));
  }
  if(mode==='leader'){
    const ldr = LEADERS[id]; if(!ldr) return null;
    const cn = lang==='ru'?ldr.name:ldr.nameEn;
    const wrong = shuffled(Object.values(LEADERS).filter(l=>l!==ldr)).slice(0,3).map(l=>lang==='ru'?l.name:l.nameEn);
    return shuffled([cn,...wrong]).map((n,i)=>({label:L[i],text:n,correct:n===cn}));
  }
  if(mode==='landmark'){
    if(!LANDMARKS[id]) return null;
    // Choices are country names - which country has this landmark
    const correct = cName(id);
    const wrong = shuffled((pool||activePool).filter(c=>c.id!==id)).slice(0,3).map(c=>c.name);
    return shuffled([correct,...wrong]).map((n,i)=>({label:L[i],text:n,correct:n===correct}));
  }
  return null;
}

function showMcPanel(choices, onAnswer){
  if(!choices){hideMcPanel();return;}
  mcLocked = false;
  const grid = document.getElementById('mc-grid');
  grid.style.gridTemplateColumns = choices.length > 4 ? '1fr 1fr' : '1fr';
  grid.innerHTML = '';
  choices.forEach((ch,idx) => {
    const btn = document.createElement('button');
    btn.className = 'mc-btn';
    btn.innerHTML = `<span class="mc-letter">${ch.label}</span><span>${ch.text}</span>`;
    btn.addEventListener('click', ()=>{
      if(mcLocked) return;
      mcLocked = true;
      btn.classList.add(ch.correct?'correct':'wrong');
      grid.querySelectorAll('.mc-btn').forEach((b,i)=>{
        if(choices[i]&&choices[i].correct) b.classList.add('correct');
        b.disabled = true;
      });
      onAnswer(ch.correct);
    });
    grid.appendChild(btn);
  });
  document.getElementById('mc-panel').style.display = 'block';
}

function hideMcPanel(){
  const p = document.getElementById('mc-panel');
  if(p) p.style.display = 'none';
  const g = document.getElementById('mc-grid');
  if(g) g.innerHTML = '';
}
