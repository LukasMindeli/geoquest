let mmRef = null, mmTimeout = null, mmOpponentUid = null;

function startMatchmaking() {
  if(!db) { startBotMatch(); return; }
  const uid = currentUser ? currentUser.uid : ('guest_'+Math.random().toString(36).substr(2,8));
  const name = currentUser ? (currentUser.displayName||'Игрок') : (profileData.name||'Гость');
  const mmSlot = { uid, name, ts: Date.now(), peerId: null, mode: mmMode };

  document.getElementById('mm-status').textContent = 'Ищем соперника…';
  document.getElementById('mm-panel').classList.add('show');

  // Check for waiting player
  db.ref('matchmaking').orderByChild('ts').limitToLast(5).once('value', snap => {
    let found = null;
    if(snap.exists()) {
      snap.forEach(c => {
        const d = c.val();
        if(d.uid !== uid && Date.now() - d.ts < 15000 && !d.matched) {
          found = { key: c.key, data: d };
        }
      });
    }

    if(found) {
      // Join existing slot
      db.ref('matchmaking/' + found.key).update({ matched: uid });
      mmOpponentUid = found.data.uid;
      document.getElementById('mm-status').textContent = `Соперник найден: ${found.data.name}!`;
      setTimeout(() => {
        document.getElementById('mm-panel').classList.remove('show');
        // Start real multiplayer (guest joins)
        isHost = false;
        mpMyName = name;
        mpOppName = found.data.name;
        if(found.data.peerId) joinPeer(found.data.peerId);
      }, 1000);
      clearTimeout(mmTimeout);
    } else {
      // Create slot and wait
      const newRef = db.ref('matchmaking').push(mmSlot);
      mmRef = newRef;

      // Start PeerJS and put peerId in slot
      const code = genCode().toLowerCase();
      initPeer(code);
      setTimeout(() => { newRef.update({ peerId: code }); }, 1000);

      mmTimeout = setTimeout(() => {
        // No one joined — start bot match
        newRef.remove();
        document.getElementById('mm-panel').classList.remove('show');
        startBotMatch();
      }, 10000);

      // Listen for someone joining
      newRef.on('value', s => {
        if(s.exists() && s.val().matched && s.val().matched !== uid) {
          clearTimeout(mmTimeout);
          newRef.off();
          mmOpponentUid = s.val().matched;
          document.getElementById('mm-status').textContent = 'Соперник найден!';
          setTimeout(() => {
            document.getElementById('mm-panel').classList.remove('show');
            // Already hosting via initPeer
          }, 800);
        }
      });
    }
  });
}

// ── BOT MATCH ─────────────────────────────────────────────────
let botActive = false, botTid = null;

function startBotMatch() {
  // Bot names pool
  const botNames = ['GeoMaster','WorldWizard','MapHunter','AtlasKing','GlobeRunner',
    'CapitalPro','FlagExpert','EarthSeeker','NationBrain','TerraQuiz'];
  botActive = true;
  mpMyName = currentUser ? (currentUser.displayName||'Ты') : (profileData.name||'Ты');
  mpOppName = botNames[Math.floor(Math.random()*botNames.length)];
  mpMyScore = 0; mpOppScore = 0; mpRound = 0;
  mpPool = shuffled(rpool('world'));
  document.getElementById('mps-n1').textContent = mpMyName;
  document.getElementById('mps-n2').textContent = mpOppName;
  showScreen('mp');
  document.getElementById('mp-game').classList.add('show');
  nextBotRound();
}

function nextBotRound() {
  if(mpRound >= mpTotalRounds) { showMpResult(); return; }
  hideAllOv(); clearHov();
  targId = mpPool[mpRound % mpPool.length].id;
  const nm = cName(targId);
  mpRole = (mpRound % 2 === 0) ? 'finder' : 'selector';
  mpRound++;
  updMpRound();

  if(mpRole === 'finder') {
    // Player finds — bot already "selected"
    document.getElementById('mp-role').textContent = 'НАЙДИ СТРАНУ';
    document.getElementById('mp-instruction').textContent = nm.toUpperCase();
    document.getElementById('mp-sel-hint').textContent = 'Нажми на страну на глобусе!';
    document.getElementById('mp-confirm').style.display = 'none';
    mpState = 'finding'; mpFindTargetId = targId;
    setOverlay(targId, 0x44aaff, 0.0); // don't highlight — player must find
    mpTimeLeft = MP_TIME; syncMpTimer();
    mpTid = setInterval(() => {
      mpTimeLeft--; syncMpTimer();
      if(mpTimeLeft <= 0) {
        clearInterval(mpTid); mpState = 'done';
        setOverlay(mpFindTargetId, 0xff3344, .35);
        flash(false,'⏱');
        // Bot gets points for this
        mpOppScore += 50; updMpScores();
        setTimeout(() => nextBotRound(), 1800);
      }
    }, 1000);
  } else {
    // Bot selects — player must guess which country bot "picked"
    document.getElementById('mp-role').textContent = 'УГАДАЙ СТРАНУ БОТА';
    document.getElementById('mp-instruction').textContent = '???';
    document.getElementById('mp-sel-hint').textContent = 'Бот загадал страну — найди её!';
    document.getElementById('mp-confirm').style.display = 'none';
    setOverlay(targId, 0xffaa00, 0.0);
    mpState = 'finding'; mpFindTargetId = targId;
    mpTimeLeft = MP_TIME; syncMpTimer();
    mpTid = setInterval(() => {
      mpTimeLeft--; syncMpTimer();
      if(mpTimeLeft <= 0) {
        clearInterval(mpTid); mpState = 'done';
        setOverlay(mpFindTargetId, 0xff3344, .35);
        flash(false,'⏱');
        mpOppScore += 30; updMpScores();
        setTimeout(() => nextBotRound(), 1800);
      }
    }, 1000);
  }
}

function onBotClick(cid) {
  if(!botActive || mpState !== 'finding') return;
  clearInterval(mpTid); mpState = 'done';
  if(cid === mpFindTargetId) {
    const pts = mpTimeLeft * 5 + 100;
    mpMyScore += pts; setOverlay(cid, 0x00ee77, .45);
    flash(true,'✓'); updMpScores();
    setTimeout(() => nextBotRound(), 1200);
  } else {
    setOverlay(cid, 0xff3344, .4); setOverlay(mpFindTargetId, 0x00ee77, .35);
    flash(false,'✗'); mpOppScore += 30; updMpScores();
    setTimeout(() => nextBotRound(), 1800);
  }
}
// ═══════════════════════════════════════════════════════════════
//  MATCHMAKING UI
// ═══════════════════════════════════════════════════════════════

document.getElementById('btn-random').addEventListener('click',()=>{
  if(!currentUser){showAuthGate('online',()=>{
    document.getElementById('mm-panel').classList.add('show');
    document.getElementById('mm-setup').style.display='block';
    document.getElementById('mm-searching').style.display='none';
  });return;}
  document.getElementById('mm-panel').classList.add('show');
  document.getElementById('mm-setup').style.display='block';
  document.getElementById('mm-searching').style.display='none';
});

function cancelMatchmaking(){
  clearTimeout(mmTimeout);
  if(mmRef){mmRef.off();try{mmRef.remove();}catch(e){}}
  document.getElementById('mm-panel').classList.remove('show');
  document.getElementById('mm-setup').style.display='block';
  document.getElementById('mm-searching').style.display='none';
  document.getElementById('main-menu').classList.add('show');
}

// MM mode selection
let mmMode='click';
document.querySelectorAll('[data-mm-mode]').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('[data-mm-mode]').forEach(x=>x.classList.remove('sel'));
  b.classList.add('sel'); mmMode=b.dataset.mmMode;
  soloMode=mmMode; // sync so nextQ uses correct mode for bot
}));

document.getElementById('mm-back-btn').addEventListener('click',()=>{
  document.getElementById('mm-panel').classList.remove('show');
  document.getElementById('main-menu').classList.add('show');
});

document.getElementById('mm-start-btn').addEventListener('click',()=>{
  document.getElementById('mm-setup').style.display='none';
  document.getElementById('mm-searching').style.display='block';
  startMatchmaking();
});
