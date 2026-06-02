let db = null, auth = null, currentUser = null;
window._fbAuthPending = true;
let _authGateReason = 'login';

function getAuthHostConfig() {
  const host = (typeof window !== 'undefined' && window.location && window.location.hostname) ? window.location.hostname : '';
  const isLocalDev = host === 'localhost' || host === '127.0.0.1';
  return {
    host,
    isLocalDev,
    authDomain: 'worldorwrong.firebaseapp.com'
  };
}

function initFirebase() {
  try {
    if(typeof firebase === 'undefined') return;
    const authHost = getAuthHostConfig();
    firebase.initializeApp({
      apiKey: "AIzaSyA_z-FWVWpGP3v-iTPkgQe8tUhuAN569GI",
      authDomain: authHost.authDomain,
      databaseURL: "https://worldorwrong-default-rtdb.firebaseio.com",
      projectId: "worldorwrong",
      storageBucket: "worldorwrong.firebasestorage.app",
      messagingSenderId: "890329555333",
      appId: "1:890329555333:web:1d14720234d1f88206e4ec"
    });
    db = firebase.database();
    auth = firebase.auth();
    // Keep user logged in across sessions (default is already LOCAL but be explicit)
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(()=>{});
    auth.onAuthStateChanged(user => {
      currentUser = user;
      try {
        if(user && db) {
          db.ref('users/' + user.uid).once('value').then(snap => {
            if(!snap.exists()) {
              db.ref('users/' + user.uid).set({name: user.displayName||'Игрок', photo: user.photoURL||'', joined: Date.now()});
            }
            if(typeof profileData !== 'undefined') {
              profileData.name = user.displayName || profileData.name || 'Игрок';
              profileData.uid = user.uid;
              if(typeof saveProfile === 'function') saveProfile();
            }
            updateAuthUI(user);
            setTimeout(runPostAuthAction, 250);
          }).catch(()=>{});
        } else {
          updateAuthUI(null);
        }
      } catch(e) { console.log('auth callback error:', e.message); }
    });
  } catch(e) { console.log('Firebase init failed:', e.message); }
}

function updateAuthUI(user) {
  try {
    const btn = document.getElementById('auth-btn');
    const info = document.getElementById('auth-info');
    if(!btn) return;
    if(user) {
      btn.textContent = t('Выйти','Sign Out');
      btn.onclick = () => { if(auth) auth.signOut(); };
      if(info) info.innerHTML = `<img src="${user.photoURL||''}" style="width:24px;height:24px;border-radius:50%;vertical-align:middle;margin-right:6px"/><span style="font-size:11px">${user.displayName||'Игрок'}</span>`;
    } else {
      btn.textContent = t('🔑 Войти','🔑 Sign In');
      btn.onclick = ()=>showAuthGate('login');
      if(info) info.innerHTML = '';
    }
  } catch(e) {}
}

function getAuthGateCopy(reason) {
  if(reason === 'online') {
    return {
      icon: '🌐',
      title: t('Нужен аккаунт Google','Google account required'),
      sub: t(
        'Для игры онлайн и поиска соперников\nнеобходимо войти через Google',
        'Sign in with Google to play online\nand find opponents.'
      )
    };
  }
  if(reason === 'chat') {
    return {
      icon: '💬',
      title: t('Войди чтобы писать в чат','Sign in to chat'),
      sub: t(
        'Глобальный чат доступен только\nдля авторизованных пользователей',
        'Global chat is available only\nto signed-in players.'
      )
    };
  }
  return {
    icon: '🔐',
    title: t('Войди через Google','Sign in with Google'),
    sub: t(
      'Один аккаунт — один профиль.\nТвои результаты сохранятся навсегда.',
      'One account, one profile.\nYour progress stays saved.'
    )
  };
}

function refreshAuthUI() {
  updateAuthUI(currentUser);
  const gate = document.getElementById('auth-gate');
  if(gate && gate.classList.contains('show')) {
    showAuthGate(_authGateReason, _authGateCallback, _authGateAction);
  }
}

window.refreshAuthUI = refreshAuthUI;

// Auth gate
let _authGateCallback = null;
let _authGateAction = null;
const AUTH_ACTION_KEY = 'wow_post_auth_action';

function setPostAuthAction(action) {
  _authGateAction = action || null;
  try {
    if(action) sessionStorage.setItem(AUTH_ACTION_KEY, action);
    else sessionStorage.removeItem(AUTH_ACTION_KEY);
  } catch(e) {}
}

function getPostAuthAction() {
  if(_authGateAction) return _authGateAction;
  try { return sessionStorage.getItem(AUTH_ACTION_KEY) || null; }
  catch(e) { return null; }
}

function runPostAuthAction() {
  const action = getPostAuthAction();
  if(!action) return false;
  setPostAuthAction(null);
  closeAuthGate(false);
  setTimeout(() => {
    try {
      if(action === 'profile') {
        if(typeof openProfile === 'function') openProfile();
        return;
      }
      if(action === 'online') {
        if(typeof showScreen === 'function') showScreen('mp-setup');
        const lobby = document.getElementById('mp-lobby');
        if(lobby) lobby.classList.add('show');
        if(typeof genCode === 'function' && typeof setMpStatus === 'function' && typeof initPeer === 'function') {
          const code = genCode();
          const room = document.getElementById('room-code');
          if(room) room.textContent = '…';
          setMpStatus('', '');
          initPeer(code.toLowerCase());
        }
        return;
      }
      if(action === 'chat') {
        if(typeof openChat === 'function') openChat();
        const input = document.getElementById('chat-input');
        if(window.softFocusInput) window.softFocusInput(input, 350);
        else setTimeout(() => input?.focus(), 350);
      }
    } catch(e) { console.log('Post-auth action error:', e.message); }
  }, 250);
  return true;
}

function showAuthGate(reason, callback, action) {
  _authGateReason = reason || 'login';
  _authGateCallback = callback || null;
  setPostAuthAction(action || null);
  const gate = document.getElementById('auth-gate');
  const title = document.getElementById('ag-title');
  const sub = document.getElementById('ag-sub');
  const ico = document.getElementById('ag-ico');
  const loginBtn = document.getElementById('ag-login-btn');
  const cancelBtn = document.getElementById('ag-cancel-btn');
  const copy = getAuthGateCopy(_authGateReason);
  ico.textContent = copy.icon;
  title.textContent = copy.title;
  sub.textContent = copy.sub;
  if(loginBtn) loginBtn.textContent = t('🔑 Войти через Google','🔑 Sign in with Google');
  if(cancelBtn) {
    cancelBtn.textContent = t('Отмена','Cancel');
    cancelBtn.style.display = 'block';
  }
  gate.classList.add('show');
}

function closeAuthGate(clearAction = true) {
  document.getElementById('auth-gate').classList.remove('show');
  _authGateCallback = null;
  _authGateReason = 'login';
  if(clearAction) setPostAuthAction(null);
}

async function signInGoogle() {
  if(!auth) return;
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await auth.signInWithPopup(provider);
      closeAuthGate(false);
      runPostAuthAction();
      return;
    } catch(e) {
      const fallbackCodes = new Set([
        'auth/popup-blocked',
        'auth/operation-not-supported-in-this-environment',
        'auth/web-storage-unsupported'
      ]);
      if(!fallbackCodes.has(e?.code)) throw e;
    }
    await auth.signInWithRedirect(provider);
  } catch(e) { console.log('Auth error:', e.message); }
}

// Handle redirect result on page load
function checkRedirectResult() {
  if(!auth) return;
  auth.getRedirectResult().then(result => {
    if(result && result.user) {
      closeAuthGate(false);
      runPostAuthAction();
    }
  }).catch(e => console.log('Redirect result error:', e.message));
}

window.fbSubmitScore = async function(name, score, type='alltime') {
  if(!db || !name || score <= 0) return;
  try {
    const uid = currentUser ? currentUser.uid : name.replace(/[.#$[\]/]/g,'_');
    const ref = db.ref(`leaderboard/${type}/${uid}`);
    const snap = await ref.once('value');
    const existing = snap.exists() ? snap.val().score : 0;
    if(score > existing) await ref.set({ name, score, date: new Date().toLocaleDateString('ru'), uid });
  } catch(e) {}
};

window.fbGetLeaderboard = async function(type='alltime') {
  if(!db) return [];
  try {
    const snap = await db.ref(`leaderboard/${type}`).orderByChild('score').limitToLast(20).once('value');
    if(!snap.exists()) return [];
    const arr = [];
    snap.forEach(c => arr.push(c.val()));
    return arr.sort((a,b) => b.score - a.score);
  } catch(e) { return []; }
};

// ── GLOBAL CHAT ───────────────────────────────────────────────
let chatOpen = false, chatListener = null;

function openChat() {
  chatOpen = true;
  document.getElementById('chat-panel').classList.add('show');
  document.getElementById('chat-badge').style.display = 'none';
  loadChat();
}
function closeChat() {
  chatOpen = false;
  document.getElementById('chat-panel').classList.remove('show');
}

function loadChat() {
  if(!db) return;
  if(chatListener) db.ref('chat').off('value', chatListener);
  chatListener = db.ref('chat').orderByChild('ts').limitToLast(50).on('value', snap => {
    const msgs = document.getElementById('chat-msgs');
    if(!snap.exists()) { msgs.innerHTML = '<div style="color:var(--muted);font-size:10px;text-align:center;padding:20px">Будь первым! 👋</div>'; return; }
    let html = '';
    const me = currentUser ? currentUser.uid : null;
    snap.forEach(c => {
      const d = c.val();
      const isMe = d.uid === me;
      const time = new Date(d.ts).toLocaleTimeString('ru', {hour:'2-digit',minute:'2-digit'});
      html += `<div class="chat-msg${isMe?' chat-me':''}">
        <div class="chat-author">${isMe?'Ты':d.name} <span class="chat-time">${time}</span></div>
        <div class="chat-text">${escHtml(d.text)}</div>
      </div>`;
    });
    msgs.innerHTML = html;
    msgs.scrollTop = msgs.scrollHeight;
    if(!chatOpen) {
      document.getElementById('chat-badge').style.display = 'flex';
    }
  });
}

function sendChat() {
  // Require auth to send
  if(!currentUser) {
    showAuthGate('chat', () => {
      // After login, focus the input
      const input = document.getElementById('chat-input');
      if(window.softFocusInput) window.softFocusInput(input, 500);
      else setTimeout(()=>input?.focus(), 500);
    }, 'chat');
    return;
  }
  const inp = document.getElementById('chat-input');
  const text = inp.value.trim();
  if(!text || !db) return;
  const name = currentUser.displayName || 'Игрок';
  const uid = currentUser.uid;
  db.ref('chat').push({ name, text, uid, ts: Date.now() });
  inp.value = '';
  db.ref('chat').orderByChild('ts').once('value', snap => {
    if(snap.numChildren() > 200) {
      let count = 0;
      snap.forEach(c => { if(++count <= snap.numChildren()-200) c.ref.remove(); });
    }
  });
}

function escHtml(t) {
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── MATCHMAKING ───────────────────────────────────────────────
