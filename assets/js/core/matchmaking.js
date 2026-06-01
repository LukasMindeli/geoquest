let mmRef = null, mmTimeout = null, mmOpponentUid = null;
let mmMode = 'click', mmReg = 'world', mmSetupStep = 'mode';
let mmCountdownTid = null;
window.mmQueueRole = null;

const OPPONENT_FIRST_NAMES = [
  'Alex','Mila','Leo','Emma','Arman','Sofia','Daniel','Maya','Victor','Elena',
  'Amir','Nora','Lucas','Anna','Marco','Layla','Denis','Eva','Timur','Zoe'
];
const OPPONENT_LAST_NAMES = ['Carter','Novak','Silva','Kim','Hassan'];
const OPPONENT_NAMES = OPPONENT_FIRST_NAMES.flatMap(first =>
  OPPONENT_LAST_NAMES.map(last => `${first} ${last}`)
);

function getRandomOpponentName() {
  return OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)];
}

function getRegionLabel(reg) {
  const labels = {
    world: { ru:'🌍 Весь мир', en:'🌍 Whole World' },
    europe: { ru:'🇪🇺 Европа', en:'🇪🇺 Europe' },
    asia: { ru:'🌏 Азия', en:'🌏 Asia' },
    eurasia: { ru:'🌐 Евразия', en:'🌐 Eurasia' },
    americas: { ru:'🌎 Америка', en:'🌎 Americas' },
    africa: { ru:'🌍 Африка', en:'🌍 Africa' },
    oceania: { ru:'🌊 Океания', en:'🌊 Oceania' }
  };
  const item = labels[reg] || labels.world;
  return t(item.ru, item.en);
}

function selectMmButtons() {
  if(typeof renderModeButtonLabels === 'function') renderModeButtonLabels('#mm-mode-step [data-mm-mode]', MODE_LABELS);
  if(typeof renderRegionButtons === 'function') renderRegionButtons('#mm-region-g .rb');
  document.querySelectorAll('#mm-mode-step [data-mm-mode]').forEach(btn => {
    btn.classList.toggle('sel', btn.dataset.mmMode === mmMode);
  });
  document.querySelectorAll('#mm-region-g .rb').forEach(btn => {
    btn.classList.toggle('sel', btn.dataset.reg === mmReg);
  });
  const modeLabel = typeof getModeLabel === 'function' ? getModeLabel(mmMode) : mmMode;
  const modeEl = document.getElementById('mm-selected-mode');
  if(modeEl) modeEl.textContent = modeLabel;
  const titleEl = document.getElementById('mm-setup-title');
  if(titleEl) titleEl.textContent = t('СЛУЧАЙНЫЙ СОПЕРНИК', 'RANDOM OPPONENT');
  const modeLbl = document.getElementById('mm-mode-label');
  if(modeLbl) modeLbl.textContent = t('ВЫБЕРИ РЕЖИМ', 'CHOOSE A MODE');
  const regionModeLbl = document.getElementById('mm-region-mode-label');
  if(regionModeLbl) regionModeLbl.textContent = t('Режим', 'Mode');
  const regionLbl = document.getElementById('mm-region-label');
  if(regionLbl) regionLbl.textContent = t('Выбери регион', 'Choose a region');
  const startBtn = document.getElementById('mm-start-btn');
  if(startBtn) startBtn.textContent = t('🎲 Найти соперника', '🎲 Find opponent');
}

function setMmSetupStep(step) {
  mmSetupStep = step;
  document.getElementById('mm-mode-step').classList.toggle('flow-step-active', step === 'mode');
  document.getElementById('mm-region-step').classList.toggle('flow-step-active', step === 'region');
  document.getElementById('mm-back-btn').textContent = step === 'mode' ? t('← Назад', '← Back') : t('← Режимы', '← Modes');
}

function showMmBox(id) {
  ['mm-searching','mm-ready','mm-setup'].forEach(boxId => {
    const el = document.getElementById(boxId);
    if(el) el.style.display = boxId === id ? 'block' : 'none';
  });
  document.getElementById('mm-panel').classList.add('show');
}

function openRandomSetup() {
  mmMode = 'click';
  mmReg = 'world';
  window.mmQueueRole = null;
  selectMmButtons();
  setMmSetupStep('mode');
  showMmBox('mm-setup');
}

function clearMmCountdown() {
  if(mmCountdownTid) clearInterval(mmCountdownTid);
  mmCountdownTid = null;
}

function resetMmPeerState() {
  mmOpponentUid = null;
  if(typeof conn !== 'undefined' && conn) {
    try { conn.close(); } catch(e) {}
    conn = null;
  }
  if(typeof peer !== 'undefined' && peer) {
    try { peer.destroy(); } catch(e) {}
    peer = null;
  }
}

function beginMmCountdown({ title, subtitle, meta, startAt, onDone }) {
  clearMmCountdown();
  const titleEl = document.getElementById('mm-ready-title');
  const subEl = document.getElementById('mm-ready-sub');
  const metaEl = document.getElementById('mm-ready-meta');
  const countEl = document.getElementById('mm-countdown');
  if(titleEl) titleEl.textContent = title;
  if(subEl) subEl.textContent = subtitle;
  if(metaEl) metaEl.textContent = meta || '';
  showMmBox('mm-ready');

  const tick = () => {
    const msLeft = Math.max(0, startAt - Date.now());
    const secondsLeft = Math.max(0, Math.ceil(msLeft / 1000));
    if(countEl) countEl.textContent = String(secondsLeft);
    if(msLeft <= 0) {
      clearMmCountdown();
      document.getElementById('mm-panel').classList.remove('show');
      onDone?.();
    }
  };

  tick();
  mmCountdownTid = setInterval(tick, 120);
}

function beginRandomMatchStart(payload, amHost) {
  soloMode = payload.mode || mmMode;
  mpReg = payload.reg || mmReg;
  mpPool = (payload.pool || []).map(id => ({ id, name: cName(id) || String(id) }));
  const myName = amHost ? (payload.hostName || t('Игрок','Player')) : (payload.guestName || (currentUser?.displayName || profileData.name || t('Игрок','Player')));
  const oppName = amHost ? (payload.guestName || t('Соперник','Opponent')) : (payload.hostName || t('Соперник','Opponent'));
  const startAt = payload.startAt || (Date.now() + (payload.countdownMs || 5000));
  beginMmCountdown({
    title: t('Соперник найден','Opponent found'),
    subtitle: t('Приготовься! Матч начинается…','Get ready! Match starts…'),
    meta: `${typeof getModeLabel === 'function' ? getModeLabel(soloMode) : soloMode} • ${getRegionLabel(mpReg)}`,
    startAt,
    onDone: () => startMpGame(amHost, { myName, oppName })
  });
}

function startRandomMatchAsHost() {
  if(mmRef) {
    mmRef.off();
    try { mmRef.remove(); } catch(e) {}
    mmRef = null;
  }
  window.mmQueueRole = null;
  const hostName = currentUser ? (currentUser.displayName || profileData.name || t('Игрок','Player')) : (profileData.name || t('Игрок','Player'));
  const startAt = Date.now() + 5000;
  let pool = shuffled(rpool(mmReg, mmMode)).map(c => c.id);
  if(pool.length < 2) {
    mmReg = 'world';
    pool = shuffled(rpool(mmReg, mmMode)).map(c => c.id);
  }
  const payload = {
    type: 'start',
    reg: mmReg,
    mode: mmMode,
    pool,
    startAt,
    countdownMs: 5000,
    randomQueue: true,
    hostName
  };
  isHost = true;
  send(payload);
  beginRandomMatchStart({ ...payload, startAt }, true);
}

function startRandomBotFallback() {
  resetMmPeerState();
  if(mmRef) {
    mmRef.off();
    try { mmRef.remove(); } catch(e) {}
    mmRef = null;
  }
  window.mmQueueRole = null;
  const botName = getRandomOpponentName();
  const startAt = Date.now() + 5000;
  beginMmCountdown({
    title: t('Соперник найден','Opponent found'),
    subtitle: t('Нашли соперника. Приготовься!','Opponent locked in. Get ready!'),
    meta: `${botName} • ${typeof getModeLabel === 'function' ? getModeLabel(mmMode) : mmMode} • ${getRegionLabel(mmReg)}`,
    startAt,
    onDone: () => startBotMatch(botName, mmReg, mmMode)
  });
}

function startMatchmaking() {
  soloMode = mmMode;
  if(!db) { startRandomBotFallback(); return; }
  const uid = currentUser ? currentUser.uid : ('guest_'+Math.random().toString(36).substr(2,8));
  const name = currentUser ? (currentUser.displayName||'Игрок') : (profileData.name||'Гость');
  const mmSlot = { uid, name, ts: Date.now(), peerId: null, mode: mmMode, reg: mmReg };

  document.getElementById('mm-status').textContent = t('Ищем соперника…','Searching for an opponent…');
  showMmBox('mm-searching');

  // Check for waiting player
  db.ref('matchmaking').orderByChild('ts').limitToLast(5).once('value', snap => {
    let found = null;
    if(snap.exists()) {
      snap.forEach(c => {
        const d = c.val();
        if(d.uid !== uid && Date.now() - d.ts < 15000 && !d.matched && d.peerId && d.mode === mmMode && d.reg === mmReg) {
          found = { key: c.key, data: d };
        }
      });
    }

    if(found) {
      // Join existing slot
      window.mmQueueRole = 'guest';
      db.ref('matchmaking/' + found.key).update({ matched: uid });
      mmOpponentUid = found.data.uid;
      document.getElementById('mm-status').textContent = t('Соперник найден. Подключаемся…','Opponent found. Connecting…');
      setTimeout(() => {
        isHost = false;
        mpMyName = name;
        mpOppName = found.data.name;
        if(found.data.peerId) joinPeer(found.data.peerId);
      }, 1000);
      clearTimeout(mmTimeout);
    } else {
      // Create slot and wait
      window.mmQueueRole = 'host';
      const newRef = db.ref('matchmaking').push(mmSlot);
      mmRef = newRef;

      // Start PeerJS and put peerId in slot
      const code = genCode().toLowerCase();
      initPeer(code);
      setTimeout(() => { newRef.update({ peerId: code }); }, 1000);

      mmTimeout = setTimeout(() => {
        // No one joined — start bot match
        newRef.remove();
        startRandomBotFallback();
      }, 10000);

      // Listen for someone joining
      newRef.on('value', s => {
        if(s.exists() && s.val().matched && s.val().matched !== uid) {
          clearTimeout(mmTimeout);
          newRef.off();
          mmOpponentUid = s.val().matched;
          document.getElementById('mm-status').textContent = t('Соперник найден. Готовим матч…','Opponent found. Preparing match…');
        }
      });
    }
  });
}

function getFallbackOpponentPoints(kind = 'success') {
  if(kind === 'missed-player') return 45 + Math.floor(Math.random() * 30);
  return 110 + Math.floor(Math.random() * 95);
}

function resolveFallbackChallenge(cid, nm) {
  mpState = 'waiting';
  hideOv(cid);
  setOverlay(cid, 0xffcc44, .2);
  document.getElementById('mp-role').textContent = t('РЕЖИМ: СОПЕРНИК ОТВЕЧАЕТ', 'MODE: OPPONENT ANSWERS');
  setMpInstructionText(t('Соперник отвечает…', 'Opponent is answering…'));
  document.getElementById('mp-sel-hint').textContent = `${nm} • ${typeof getModeLabel === 'function' ? getModeLabel(soloMode) : soloMode}`;
  document.getElementById('mp-tv').textContent = '';
  document.getElementById('mp-tb').style.width = '100%';
  scheduleMpStep(() => {
    if(!botActive) return;
    const success = Math.random() < 0.82;
    if(success) {
      mpOppScore += getFallbackOpponentPoints('success');
      flash(true,'✓');
    } else {
      document.getElementById('mp-sel-hint').textContent = t('Соперник не успел ответить','Opponent ran out of time');
      flash(false,'⏱');
    }
    updMpScores();
    scheduleMpStep(() => nextBotRound(), 1200);
  }, 1400 + Math.floor(Math.random() * 800));
}

// ── FALLBACK OPPONENT MATCH ───────────────────────────────────
let botActive = false, botTid = null;

function startBotMatch(botName = null, region = 'world', mode = mmMode) {
  botActive = true;
  soloMode = mode;
  if(typeof resetMpGameplayState === 'function') resetMpGameplayState();
  mpMyName = currentUser ? (currentUser.displayName||'Ты') : (profileData.name||'Ты');
  mpOppName = botName || getRandomOpponentName();
  mpMyScore = 0; mpOppScore = 0; mpRound = 0;
  mpReg = region;
  mpPool = shuffled(rpool(region, mode));
  if(mpPool.length < 2) {
    mpReg = 'world';
    mpPool = shuffled(rpool('world', mode));
  }
  document.getElementById('mps-n1').textContent = mpMyName;
  document.getElementById('mps-n2').textContent = mpOppName;
  showScreen('mp');
  document.getElementById('mp-game').classList.add('show');
  nextBotRound();
}

function nextBotRound() {
  if(!botActive) return;
  if(mpRound >= mpTotalRounds) { showMpResult(); return; }
  resetMpQuestionUi();
  hideAllOv(); clearHov();
  targId = mpPool[mpRound % mpPool.length].id;
  const nm = cName(targId);
  mpRole = (mpRound % 2 === 0) ? 'finder' : 'selector';
  mpRound++;
  updMpRound();

  if(mpRole === 'finder') {
    startMpFindingRound(targId, soloMode, nm, {
      onSuccess: () => {
        const pts = mpTimeLeft * 5 + 100;
        mpMyScore += pts;
        setOverlay(targId, 0x00ee77, .45);
        flash(true,'✓');
        updMpScores();
        scheduleMpStep(() => nextBotRound(), 1200);
      },
      onFailure: (reason = 'timeout', clickedId = null) => {
        if(clickedId && clickedId !== targId) setOverlay(clickedId, 0xff3344, .4);
        if(targId) setOverlay(targId, reason === 'wrong' ? 0x00ee77 : 0xff3344, .35);
        const answer = getMpRevealAnswer(soloMode, targId);
        if(answer) document.getElementById('mp-sel-hint').textContent = t('Ответ: ','Answer: ') + answer;
        flash(false, reason === 'wrong' ? '✗' : '⏱');
        mpOppScore += getFallbackOpponentPoints('missed-player');
        updMpScores();
        scheduleMpStep(() => nextBotRound(), 1800);
      }
    });
    return;
  }

  startMpSelectingRound({
    instruction: t('Тапни, чтобы загадать страну','Tap to choose a country'),
    hint: t('Выбери любую страну. Соперник получит вопрос: ','Pick any country. Opponent will get: ') + (typeof getModeLabel === 'function' ? getModeLabel(soloMode) : soloMode),
    onConfirm: resolveFallbackChallenge
  });
}

function onBotClick(cid) {
  if(!botActive || mpState !== 'finding' || mpFindMode !== 'click') return;
  clearInterval(mpTid);
  mpTid = null;
  mpState = 'done';
  if(cid === mpFindTargetId) mpOnFindSuccess?.();
  else mpOnFindFailure?.('wrong', cid);
}
// ═══════════════════════════════════════════════════════════════
//  MATCHMAKING UI
// ═══════════════════════════════════════════════════════════════

document.getElementById('btn-random').addEventListener('click',()=>{
  if(!currentUser){showAuthGate('online',()=>{openRandomSetup();},'online');return;}
  openRandomSetup();
});

function cancelMatchmaking(){
  clearMmCountdown();
  window.mmQueueRole = null;
  clearTimeout(mmTimeout);
  if(mmRef){mmRef.off();try{mmRef.remove();}catch(e){}}
  mmRef = null;
  resetMmPeerState();
  document.getElementById('mm-panel').classList.remove('show');
  document.getElementById('mm-setup').style.display='block';
  document.getElementById('mm-searching').style.display='none';
  document.getElementById('mm-ready').style.display='none';
  document.getElementById('main-menu').classList.add('show');
}

// MM mode selection
document.querySelectorAll('#mm-mode-step [data-mm-mode]').forEach(b=>b.addEventListener('click',()=>{
  mmMode=b.dataset.mmMode;
  selectMmButtons();
  setMmSetupStep('region');
}));

document.querySelectorAll('#mm-region-g .rb').forEach(b=>b.addEventListener('click',()=>{
  mmReg=b.dataset.reg;
  selectMmButtons();
}));

document.getElementById('mm-back-btn').addEventListener('click',()=>{
  if(mmSetupStep==='region'){setMmSetupStep('mode');return;}
  document.getElementById('mm-panel').classList.remove('show');
  document.getElementById('main-menu').classList.add('show');
});

document.getElementById('mm-start-btn').addEventListener('click',()=>{
  document.getElementById('mm-setup').style.display='none';
  document.getElementById('mm-searching').style.display='block';
  startMatchmaking();
});
