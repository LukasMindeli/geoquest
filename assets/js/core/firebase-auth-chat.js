let db = null, auth = null, currentUser = null;
window._fbAuthPending = true;

function initFirebase() {
  try {
    if(typeof firebase === 'undefined') return;
    firebase.initializeApp({
      apiKey: "AIzaSyA_z-FWVWpGP3v-iTPkgQe8tUhuAN569GI",
      authDomain: "worldorwrong.firebaseapp.com",
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
      btn.textContent = 'Выйти';
      btn.onclick = () => { if(auth) auth.signOut(); };
      if(info) info.innerHTML = `<img src="${user.photoURL||''}" style="width:24px;height:24px;border-radius:50%;vertical-align:middle;margin-right:6px"/><span style="font-size:11px">${user.displayName||'Игрок'}</span>`;
    } else {
      btn.textContent = '🔑 Войти';
      btn.onclick = ()=>showAuthGate('login');
      if(info) info.innerHTML = '';
    }
  } catch(e) {}
}

// Auth gate
let _authGateCallback = null;

function showAuthGate(reason, callback) {
  _authGateCallback = callback || null;
  const gate = document.getElementById('auth-gate');
  const title = document.getElementById('ag-title');
  const sub = document.getElementById('ag-sub');
  const ico = document.getElementById('ag-ico');
  const cancelBtn = document.getElementById('ag-cancel-btn');
  if(reason === 'online') {
    ico.textContent = '🌐';
    title.textContent = 'Нужен аккаунт Google';
    sub.textContent = 'Для игры онлайн и поиска соперников\nнеобходимо войти через Google';
    cancelBtn.style.display = 'block';
  } else if(reason === 'chat') {
    ico.textContent = '💬';
    title.textContent = 'Войди чтобы писать в чат';
    sub.textContent = 'Глобальный чат доступен только\nдля авторизованных пользователей';
    cancelBtn.style.display = 'block';
  } else {
    ico.textContent = '🔐';
    title.textContent = 'Войди через Google';
    sub.textContent = 'Один аккаунт — один профиль.\nТвои результаты сохранятся навсегда.';
    cancelBtn.style.display = 'block';
  }
  gate.classList.add('show');
}

function closeAuthGate() {
  document.getElementById('auth-gate').classList.remove('show');
  _authGateCallback = null;
}

function signInGoogle() {
  if(!auth) return;
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    // Use redirect instead of popup - works on all browsers/domains
    auth.signInWithRedirect(provider);
  } catch(e) { console.log('Auth error:', e.message); }
}

// Handle redirect result on page load
function checkRedirectResult() {
  if(!auth) return;
  auth.getRedirectResult().then(result => {
    if(result && result.user) {
      closeAuthGate();
      if(_authGateCallback) { _authGateCallback(); _authGateCallback = null; }
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
      setTimeout(()=>document.getElementById('chat-input').focus(), 500);
    });
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
