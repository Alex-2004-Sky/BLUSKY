-- ============================================================
-- BluSky Gaming Paradise – Oracle XE 21c
-- Run as blusky_admin in SQL Developer or SQL*Plus
-- ============================================================

-- USERS (staff accounts)
CREATE TABLE USERS (
  id            NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username      VARCHAR2(80)  NOT NULL UNIQUE,
  password_hash VARCHAR2(255) NOT NULL,
  role          VARCHAR2(20)  DEFAULT 'staff',
  created_at    TIMESTAMP     DEFAULT SYSTIMESTAMP
);

-- CONSOLES (gaming stations)
CREATE TABLE CONSOLES (
  id         NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       VARCHAR2(100) NOT NULL,
  status     VARCHAR2(20)  DEFAULT 'idle',   -- idle | active
  created_at TIMESTAMP     DEFAULT SYSTIMESTAMP
);

-- SESSIONS
CREATE TABLE SESSIONS (
  id               NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  console_id       NUMBER        NOT NULL REFERENCES CONSOLES(id),
  player_name      VARCHAR2(100) DEFAULT 'Guest',
  start_time       TIMESTAMP     NOT NULL,
  end_time         TIMESTAMP,
  duration_seconds NUMBER(10,2),
  duration_minutes NUMBER(10,4),
  cost             NUMBER(10,2),   -- (minutes × 200) ÷ 7  rounded
  status           VARCHAR2(20)  DEFAULT 'active',  -- active | completed
  created_at       TIMESTAMP     DEFAULT SYSTIMESTAMP
);

-- ── Seed: default admin (password = blusky2024, bcrypt hash) ──
-- Generate the real hash using: node -e "require('bcrypt').hash('blusky2024',10).then(console.log)"
-- Then replace the hash below before running
INSERT INTO USERS (username, password_hash, role)
VALUES ('admin', '$2b$10$REPLACE_WITH_REAL_BCRYPT_HASH', 'admin');

-- ── Seed: two default consoles ──
INSERT INTO CONSOLES (name) VALUES ('Xbox 360 — Console 1');
INSERT INTO CONSOLES (name) VALUES ('Xbox 360 — Console 2');

COMMIT;
