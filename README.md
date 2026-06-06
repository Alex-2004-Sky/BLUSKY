# BluSky Gaming Paradise — Full Stack Setup Guide

## What You Have
- **Frontend**: blusky-dashboard.html (the staff dashboard)
- **Backend**: NestJS API (this folder)
- **Database**: Oracle XE 21c

---

## STEP 1 — Set Up Oracle XE Database

Open SQL Developer or SQL*Plus and connect as your admin user, then:

```sql
-- Create the BluSky user
CREATE USER blusky_admin IDENTIFIED BY yourpassword;
GRANT CONNECT, RESOURCE, CREATE SESSION TO blusky_admin;
GRANT UNLIMITED TABLESPACE TO blusky_admin;
```

Then connect as blusky_admin and run:
```
src/database/create-tables.sql
```

Generate a real bcrypt hash for your admin password:
```bash
node -e "require('bcrypt').hash('blusky2024', 10).then(console.log)"
```
Copy the output hash and update the INSERT in create-tables.sql, then run it.

---

## STEP 2 — Configure Database Connection

Open `src/database/database.module.ts` and update:
```typescript
username: 'blusky_admin',
password: 'yourpassword',   // ← your real Oracle password
```

---

## STEP 3 — Install and Run the Backend

```bash
# Install Oracle Instant Client first (required for oracledb)
# Download from: https://www.oracle.com/database/technologies/instant-client.html

# Install dependencies
npm install

# Run in development mode
npm run start:dev
```

The API will start at: http://localhost:3000/api

You should see: ✅ BluSky Gaming API running → http://localhost:3000/api

---

## STEP 4 — Connect the Frontend to the Backend

Open **blusky-dashboard.html** in a text editor and find this line near the top of the `<script>` tag:

```javascript
const API_BASE = 'http://localhost:3000/api';
```

If you see hardcoded local state instead (older version), replace the login function and API calls as described below.

### How to update doLogin() in the HTML:

```javascript
// Replace the old doLogin() with this:
async function doLogin() {
  const u = document.getElementById('l-user').value.trim();
  const p = document.getElementById('l-pass').value;
  try {
    const data = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p })
    }).then(r => r.json());

    if (!data.access_token) throw new Error('No token');
    token = data.access_token;  // save JWT globally
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').classList.add('visible');
    document.getElementById('topbar-user').textContent = u.toUpperCase();
    startClock();
    await loadConsoles();   // load from backend
    await loadSessions();   // load from backend
    renderAll();
  } catch(e) {
    document.getElementById('login-err').style.display = 'block';
    setTimeout(() => document.getElementById('login-err').style.display = 'none', 2500);
  }
}
```

### How to update startSession():

```javascript
async function startSession(id) {
  const c = consoles.find(x => x.id === id);
  if (c.active) return;
  const inp = document.getElementById('player-' + id);
  const playerName = inp ? inp.value.trim() || 'Guest' : 'Guest';
  try {
    const session = await fetch('http://localhost:3000/api/sessions/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ consoleId: id, playerName })
    }).then(r => r.json());

    c.active = true;
    c.player = playerName;
    c.elapsed = 0;
    c.activeSessionId = session.id;   // save backend session ID
    c.startTime = new Date();
    c.interval = setInterval(() => { c.elapsed++; updateLiveTimer(c); updateStats(); }, 1000);
    renderAll();
    toast(`▶ ${c.name} session started`, 'success');
  } catch(e) { toast(e.message, 'error'); }
}
```

### How to update stopSession():

```javascript
async function stopSession(id) {
  const c = consoles.find(x => x.id === id);
  if (!c.active) return;
  clearInterval(c.interval);
  try {
    const session = await fetch('http://localhost:3000/api/sessions/end', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ sessionId: c.activeSessionId })
    }).then(r => r.json());

    // Build receipt from backend response (cost is calculated by backend)
    lastReceipt = {
      console:       session.console.name,
      player:        session.playerName,
      start:         new Date(session.startTime).toLocaleTimeString(),
      end:           new Date(session.endTime).toLocaleTimeString(),
      duration:      fmtTime(Math.round(session.durationSeconds)),
      durationMins:  session.durationMinutes,
      cost:          session.cost,
    };

    sessions.push({
      id:              session.id,
      consoleName:     session.console.name,
      player:          session.playerName,
      durationSec:     Math.round(session.durationSeconds),
      durationMinutes: session.durationMinutes,
      cost:            session.cost,
      endTime:         new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    c.active = false;
    c.elapsed = 0;
    c.player = '';
    c.startTime = null;
    c.activeSessionId = null;
    renderAll();
    showReceipt();
  } catch(e) { toast(e.message, 'error'); }
}
```

### Helper functions to load data from backend:

```javascript
async function loadConsoles() {
  const data = await fetch('http://localhost:3000/api/consoles', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());

  // Merge backend consoles with local timer state
  consoles = data.map(c => ({
    id: c.id,
    name: c.name,
    active: c.status === 'active',
    player: '',
    elapsed: 0,
    startTime: null,
    interval: null,
    activeSessionId: null,
  }));
}

async function loadSessions() {
  const data = await fetch('http://localhost:3000/api/sessions', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());

  sessions = data
    .filter(s => s.status === 'completed')
    .map(s => ({
      id:              s.id,
      consoleName:     s.console?.name,
      player:          s.playerName,
      durationSec:     Math.round(s.durationSeconds),
      durationMinutes: s.durationMinutes,
      cost:            s.cost,
      endTime:         new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
}
```

---

## API Endpoints Summary

| Method | Endpoint                    | Auth | What it does                        |
|--------|-----------------------------|------|-------------------------------------|
| POST   | /api/auth/login             | No   | Login → returns JWT token           |
| POST   | /api/auth/change-password   | Yes  | Change staff password               |
| GET    | /api/consoles               | Yes  | Get all consoles + status           |
| POST   | /api/consoles               | Yes  | Add a new console                   |
| DELETE | /api/consoles/:id           | Yes  | Remove a console                    |
| POST   | /api/sessions/start         | Yes  | Start a session (sets start_time)   |
| POST   | /api/sessions/end           | Yes  | End session + calculate cost        |
| GET    | /api/sessions/active        | Yes  | All live sessions + estimated cost  |
| GET    | /api/sessions               | Yes  | Full session history                |
| GET    | /api/sessions/:id           | Yes  | Single session receipt              |
| GET    | /api/reports/daily          | Yes  | Today's revenue, sessions, minutes  |

---

## Billing Formula (same in frontend and backend)

```
cost = Math.round((durationMinutes × 200) / 7)
```

Example: 10 minutes → (10 × 200) / 7 = MK 286

The backend ALWAYS calculates the final cost. The frontend timer is only for display.

---

## Project Structure

```
blusky-tracker-backend/
├── src/
│   ├── main.ts                     ← entry point, CORS config
│   ├── app.module.ts               ← root module
│   ├── database/
│   │   ├── database.module.ts      ← Oracle XE connection
│   │   └── create-tables.sql       ← run once to create tables
│   ├── auth/
│   │   ├── auth.controller.ts      ← POST /auth/login
│   │   ├── auth.service.ts         ← bcrypt + JWT
│   │   ├── auth.module.ts
│   │   ├── auth.dto.ts
│   │   ├── user.entity.ts
│   │   └── jwt.strategy.ts
│   ├── consoles/
│   │   ├── consoles.controller.ts
│   │   ├── consoles.service.ts
│   │   ├── consoles.module.ts
│   │   ├── console.dto.ts
│   │   └── console.entity.ts
│   ├── sessions/
│   │   ├── sessions.controller.ts
│   │   ├── sessions.service.ts     ← billing formula lives here
│   │   ├── sessions.module.ts
│   │   ├── session.dto.ts
│   │   └── session.entity.ts
│   ├── reports/
│   │   ├── reports.controller.ts
│   │   ├── reports.service.ts      ← daily revenue summary
│   │   └── reports.module.ts
│   └── common/
│       └── guards/
│           └── jwt-auth.guard.ts
├── package.json
├── tsconfig.json
└── nest-cli.json
```
