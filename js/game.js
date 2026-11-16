'use strict';

/*
 * 二〇二六臺北：市長政見格鬥
 * 諷刺虛構。角色、黨名、主張不可換成真實政治人物或政黨。
 */

const VW = 960;
const VH = 540;
const SCALE = 2;
const GROUND = 438;
const MIN_X = 56;
const MAX_X = 904;
const GRAVITY = 0.58;
const JUMP_V = -12.6;
const AIR_SPEED = 3.15;
const ROUND_FRAMES = 60 * 60;
const FONT = '"WenQuanYi Micro Hei", "Droid Sans Fallback", sans-serif';

const CHARS = {
  zhou: {
    id: 'zhou',
    name: '周晚燈',
    party: '夜市共好聯盟',
    trait: '步調快，輕攻短，必殺會射出辣椒油。',
    line: '先吃飽，再談都市計畫。',
    win: '周晚燈搶到麥克風，在這篇小說裡宣布宵夜免費。廣場的燈還亮著，選票則不在這個網頁裡。',
    color: '#ff8a3d',
    accent: '#ffb703',
    skin: '#f2c09a',
    hair: '#4a2c1a',
    outfit: '#ef6c1e',
    shirt: '#ffe6c4',
    pants: '#5c382c',
    shoe: '#2a1612',
    sash: '#c5283d',
    hairStyle: 'messy',
    glasses: false,
    bodyW: 34,
    tall: 0,
    headR: 15,
    walk: 4.15,
    lightName: '攤販拍',
    heavyName: '鐵鍋橫掃',
    specialName: '深夜辣椒',
    moves: {
      light: {
        kind: 'melee', startup: 5, active: 3, recovery: 10,
        damage: 8, hitstun: 16, blockstun: 8, knockback: 3.4, push: 2.2, chip: 0,
        hitstop: 5, shake: 3, meterGain: 8, meterCost: 0,
        range: 60, h: 34, lift: 90, sfx: 'light',
      },
      heavy: {
        kind: 'melee', startup: 12, active: 4, recovery: 18,
        damage: 15, hitstun: 22, blockstun: 12, knockback: 5, push: 4, chip: 0,
        hitstop: 8, shake: 6, meterGain: 12, meterCost: 0,
        range: 92, h: 52, lift: 102, sfx: 'heavy',
      },
      special: {
        kind: 'projectile', startup: 15, active: 4, recovery: 22,
        damage: 17, hitstun: 20, blockstun: 14, knockback: 4.5, push: 5, chip: 4,
        hitstop: 9, shake: 8, meterGain: 16, meterCost: 100,
        range: 30, h: 22, lift: 84, speed: 7.4, life: 72, sfx: 'special',
      },
    },
  },
  shen: {
    id: 'shen',
    name: '沈靜川',
    party: '靜川市政社',
    trait: '手比較長、動作稍慢，必殺會向前衝刺蓋章。',
    line: '沒有時程的善意，只是噪音。',
    win: '沈靜川蓋下最後一枚章。十一點整，腳本讓廣場熄了一盞燈。當選名單不會因此出現。',
    color: '#8ec5ff',
    accent: '#d5e6fb',
    skin: '#f0c7a4',
    hair: '#1c1c1c',
    outfit: '#1e4f86',
    shirt: '#e7eef6',
    pants: '#1a2740',
    shoe: '#111820',
    sash: '#d7e3f4',
    hairStyle: 'neat',
    glasses: true,
    bodyW: 28,
    tall: 8,
    headR: 13,
    walk: 3.65,
    lightName: '指標點名',
    heavyName: '卷宗砸擊',
    specialName: '準時蓋章',
    moves: {
      light: {
        kind: 'melee', startup: 6, active: 3, recovery: 11,
        damage: 7, hitstun: 15, blockstun: 8, knockback: 2.8, push: 2, chip: 0,
        hitstop: 5, shake: 3, meterGain: 7, meterCost: 0,
        range: 86, h: 28, lift: 86, sfx: 'light',
      },
      heavy: {
        kind: 'melee', startup: 14, active: 4, recovery: 20,
        damage: 16, hitstun: 23, blockstun: 13, knockback: 5.2, push: 4.2, chip: 0,
        hitstop: 8, shake: 6, meterGain: 12, meterCost: 0,
        range: 74, h: 60, lift: 110, sfx: 'heavy',
      },
      special: {
        kind: 'dash', startup: 9, active: 12, recovery: 20,
        damage: 18, hitstun: 24, blockstun: 16, knockback: 6.4, push: 5.5, chip: 4,
        hitstop: 10, shake: 9, meterGain: 16, meterCost: 100,
        range: 56, h: 44, lift: 94, dash: 8.4, sfx: 'special',
      },
    },
  },
};

const STORY = [
  {
    kicker: '投票日前夜',
    title: '廣場已經佈好了',
    paragraphs: [
      '今晚的市府廣場不是開票夜。燈串升起，兩座講臺相望，旗子是這個故事才染上的顏色。',
      '沒有驗票，也沒有當選證書。只有兩個虛構的人堅持一件荒唐的事：理念如果說不服對方，就換一種比較大聲的說法。',
    ],
  },
  {
    kicker: '夜市共好聯盟',
    title: '周晚燈',
    paragraphs: [
      '他在騎樓邊長大，相信一座城市如果十一點就沒味道，隔天早上會不認得自己。',
      '政見很具體，也很過分：夜市延到清晨、摺疊桌可以暫時佔領騎樓、烤爐算文化資產。',
      '「先吃飽，再談都市計畫。」他總是這樣把辯論拉回宵夜。',
    ],
  },
  {
    kicker: '靜川市政社',
    title: '沈靜川',
    paragraphs: [
      '她把行事曆當成人格。人行道要淨空，公告要準時蓋章，每條巷子在十一點恢復成聽得見腳步的安靜。',
      '她不是討厭人，她討厭沒有結束時間的熱鬧。',
      '「沒有時程的善意，只是噪音。」',
    ],
  },
  {
    kicker: '廣場規則',
    title: '三回合，先拿兩勝',
    paragraphs: [
      '生命歸零，或六十秒結束時生命較高的一方，拿走那一回合。同時倒下或生命相同，就重賽。',
      '能量集滿才能放必殺。打中之後，輕的可以接重的，重的可以接必殺。',
      '這不是政見發表，也不會有人因此當選。',
    ],
  },
];

const P1_KEYS = { left: 'KeyA', right: 'KeyD', up: 'KeyW', down: 'KeyS', light: 'KeyJ', heavy: 'KeyK', special: 'KeyL' };
const P2_KEYS = { left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown', light: 'Digit1', heavy: 'Digit2', special: 'Digit3' };
const P2_ALT = { light: 'Numpad1', heavy: 'Numpad2', special: 'Numpad3' };

const DEBUG = new URLSearchParams(location.search).has('debug');
const BOXES = new URLSearchParams(location.search).has('boxes');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const probe = document.getElementById('probe');
const muteBtn = document.getElementById('mute');

const held = new Set();
let pendingEdges = new Set();
let audioCtx = null;

const G = {
  screen: 'title',
  storyPage: 0,
  mode: 'cpu',
  p1Char: 'zhou',
  p2Char: 'shen',
  phase: 'versus',
  phaseTimer: 0,
  paused: false,
  round: 1,
  wins: [0, 0],
  roundCounted: false,
  matchWinner: 0,
  fighters: [],
  projectiles: [],
  particles: [],
  hitstop: 0,
  shake: 0,
  timeLeft: ROUND_FRAMES,
  frame: 0,
  banner: '',
  bannerSub: '',
  flash: 0,
  flashColor: '#ffb703',
  muted: false,
  manual: false,
  gong: false,
};

const skyline = [];

function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildSkyline() {
  const rand = mulberry32(2026);
  let x = -20;
  while (x < VW + 20) {
    const w = 26 + rand() * 48;
    const h = 48 + rand() * 130;
    const windows = [];
    for (let wy = 8; wy < h - 8; wy += 11) {
      for (let wx = 6; wx < w - 6; wx += 9) {
        if (rand() > 0.42) windows.push({ wx, wy, hue: rand() > 0.82 ? '#9fd4ff' : '#ffd59a', phase: rand() * 6 });
      }
    }
    skyline.push({ x, w, h, windows });
    x += w + 4 + rand() * 12;
  }
}

function font(size, weight) {
  return (weight || 700) + ' ' + size + 'px ' + FONT;
}

function paint(text, x, y, opt) {
  const o = opt || {};
  const size = o.size || 16;
  ctx.font = font(size, o.weight || 700);
  ctx.textAlign = o.align || 'left';
  ctx.textBaseline = 'top';
  if (o.shadow) {
    ctx.lineWidth = Math.max(2, size / 9);
    ctx.strokeStyle = 'rgba(16, 6, 10, 0.78)';
    ctx.strokeText(text, x, y);
  }
  ctx.fillStyle = o.color || '#fff';
  ctx.fillText(text, x, y);
}

function roundRect(x, y, w, h, r, fill, stroke) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

function overlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function hurtBox(f) {
  return { x: f.x - 22, y: f.y - 116, w: 44, h: 106 };
}

function attackBox(f) {
  const d = CHARS[f.charId].moves[f.move];
  const w = d.range;
  const x = f.facing === 1 ? f.x + 18 : f.x - 18 - w;
  return { x: x, y: f.y - d.lift, w: w, h: d.h };
}

function inActive(f) {
  if (!f.move) return false;
  const d = CHARS[f.charId].moves[f.move];
  return f.moveFrame >= d.startup && f.moveFrame < d.startup + d.active;
}

function makeFighter(charId, x, slot) {
  return {
    charId: charId,
    slot: slot,
    x: x,
    y: GROUND,
    vx: 0,
    vy: 0,
    facing: slot === 0 ? 1 : -1,
    hp: 100,
    hpShown: 100,
    meter: 0,
    state: 'idle',
    stateFrame: 0,
    move: null,
    moveFrame: 0,
    hasHit: false,
    spawned: false,
    onGround: true,
    hitstun: 0,
    blockstun: 0,
    wantBlock: false,
    buffer: null,
    bufferLeft: 0,
    meterFlash: 0,
    deny: 0,
    hitFlash: 0,
    combo: 0,
    comboTimer: 0,
    cpuRolled: false,
    sawThreat: false,
    blockAt: 0,
    blockUntil: 0,
    plan: null,
  };
}

function resetRound() {
  G.fighters = [
    makeFighter(G.p1Char, 250, 0),
    makeFighter(G.p2Char, 710, 1),
  ];
  G.projectiles = [];
  G.hitstop = 0;
  G.shake = 0;
  G.timeLeft = ROUND_FRAMES;
  G.flash = 0;
}

function startIntro() {
  G.phase = 'intro';
  G.phaseTimer = 100;
  G.gong = false;
}

function startMatch() {
  G.screen = 'match';
  G.paused = false;
  G.round = 1;
  G.wins = [0, 0];
  G.roundCounted = false;
  G.banner = '';
  G.bannerSub = '';
  resetRound();
  G.phase = 'versus';
  G.phaseTimer = 130;
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  renderOverlay();
}

function finishRound(winner, reason, sub) {
  G.phase = 'roundend';
  G.phaseTimer = 150;
  G.banner = reason;
  G.bannerSub = sub;
  G.projectiles = [];
  G.roundCounted = winner === 0 || winner === 1;
  if (G.roundCounted) G.wins[winner] += 1;
  G.fighters.forEach(function (f, i) {
    f.move = null;
    f.vx = 0;
    f.buffer = null;
    f.hitFlash = 0;
    f.hitstun = 0;
    f.blockstun = 0;
    if (winner === null) f.state = f.hp <= 0 ? 'lose' : 'idle';
    else f.state = i === winner ? 'win' : 'lose';
  });
  if (reason === '擊倒' || reason === '同時擊倒') sfx('ko');
  else sfx('start');
  G.shake = reason === '平手' ? 0 : 10;
}

function checkEnd() {
  if (G.phase !== 'fight') return;
  const aDead = G.fighters[0].hp <= 0;
  const bDead = G.fighters[1].hp <= 0;
  if (!aDead && !bDead && G.timeLeft > 0) return;
  let winner = null;
  let reason = '時間到';
  if (aDead && bDead) {
    winner = null;
    reason = '同時擊倒';
  } else if (bDead) {
    winner = 0;
    reason = '擊倒';
  } else if (aDead) {
    winner = 1;
    reason = '擊倒';
  } else if (G.fighters[0].hp > G.fighters[1].hp) {
    winner = 0;
  } else if (G.fighters[1].hp > G.fighters[0].hp) {
    winner = 1;
  } else {
    reason = '平手';
  }
  const sub = winner === null
    ? '本回合重賽'
    : CHARS[G.fighters[winner].charId].name + ' 取下這一回合';
  finishRound(winner, reason, sub);
}

function ensureAudio() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  } catch (err) {
    return null;
  }
}

function sfx(kind) {
  if (G.muted) return;
  try {
    const ac = ensureAudio();
    if (!ac) return;
    const now = ac.currentTime;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.connect(g);
    g.connect(ac.destination);
    g.gain.setValueAtTime(0.045, now);
    if (kind === 'light') {
      o.type = 'square';
      o.frequency.setValueAtTime(340, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      o.stop(now + 0.07);
    } else if (kind === 'heavy') {
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(150, now);
      o.frequency.exponentialRampToValueAtTime(70, now + 0.12);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
      o.stop(now + 0.14);
    } else if (kind === 'special') {
      o.type = 'square';
      o.frequency.setValueAtTime(520, now);
      o.frequency.exponentialRampToValueAtTime(120, now + 0.2);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      o.stop(now + 0.23);
    } else if (kind === 'block') {
      o.type = 'square';
      o.frequency.setValueAtTime(680, now);
      g.gain.setValueAtTime(0.03, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      o.stop(now + 0.06);
    } else if (kind === 'ko') {
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(240, now);
      o.frequency.exponentialRampToValueAtTime(42, now + 0.38);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      o.stop(now + 0.42);
    } else if (kind === 'deny') {
      o.type = 'square';
      o.frequency.setValueAtTime(98, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      o.stop(now + 0.09);
    } else {
      o.type = 'square';
      o.frequency.setValueAtTime(523, now);
      o.frequency.setValueAtTime(784, now + 0.07);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      o.stop(now + 0.17);
    }
    o.start(now);
  } catch (err) {
    /* 沒有音效也不影響對戰 */
  }
}

function burst(x, y, color, n, speed) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = speed * (0.45 + Math.random());
    G.particles.push({
      x: x,
      y: y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 0.8,
      life: 16 + Math.random() * 12,
      max: 28,
      color: color,
      size: 2 + Math.random() * 2.5,
    });
  }
  if (G.particles.length > 140) G.particles.splice(0, G.particles.length - 140);
}

function ember() {
  G.particles.push({
    x: 40 + Math.random() * 880,
    y: 470 + Math.random() * 40,
    vx: (Math.random() - 0.5) * 0.45,
    vy: -0.28 - Math.random() * 0.45,
    life: 70,
    max: 70,
    color: Math.random() > 0.5 ? 'rgba(255,186,80,0.75)' : 'rgba(255,120,60,0.65)',
    size: 1.6 + Math.random() * 1.6,
  });
}

function updateParticles() {
  for (let i = 0; i < G.particles.length; i++) {
    const p = G.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.04;
    p.life -= 1;
  }
  G.particles = G.particles.filter(function (p) { return p.life > 0; });
}

function physics(f) {
  f.vy += GRAVITY;
  f.x += f.vx;
  f.y += f.vy;
  if (f.y >= GROUND) {
    f.y = GROUND;
    f.vy = 0;
    f.onGround = true;
  } else {
    f.onGround = false;
  }
}

function separate() {
  const a = G.fighters[0];
  const b = G.fighters[1];
  if (a.onGround && b.onGround) {
    const minDist = 48;
    const dist = b.x - a.x;
    const sign = dist === 0 ? 1 : Math.sign(dist);
    const gap = minDist - Math.abs(dist);
    if (gap > 0) {
      a.x -= sign * gap / 2;
      b.x += sign * gap / 2;
    }
  }
  for (let pass = 0; pass < 2; pass++) {
    if (a.x < MIN_X) {
      const push = MIN_X - a.x;
      a.x = MIN_X;
      if (a.onGround && b.onGround) b.x += push;
    }
    if (b.x > MAX_X) {
      const push = b.x - MAX_X;
      b.x = MAX_X;
      if (a.onGround && b.onGround) a.x -= push;
    }
    if (b.x < MIN_X) {
      const push = MIN_X - b.x;
      b.x = MIN_X;
      if (a.onGround && b.onGround) a.x += push;
    }
    if (a.x > MAX_X) {
      const push = a.x - MAX_X;
      a.x = MAX_X;
      if (a.onGround && b.onGround) b.x -= push;
    }
  }
  a.x = Math.max(MIN_X, Math.min(MAX_X, a.x));
  b.x = Math.max(MIN_X, Math.min(MAX_X, b.x));
}

function startMove(f, name) {
  const def = CHARS[f.charId].moves[name];
  if (!def) return false;
  if (def.meterCost && f.meter < def.meterCost) {
    f.meterFlash = 12;
    f.deny = 42;
    sfx('deny');
    return false;
  }
  if (def.meterCost) f.meter -= def.meterCost;
  f.move = name;
  f.moveFrame = 0;
  f.hasHit = false;
  f.spawned = false;
  f.cpuRolled = false;
  f.state = name;
  f.hitstun = 0;
  f.blockstun = 0;
  f.vx = 0;
  if (name === 'special') {
    G.flash = 8;
    G.flashColor = CHARS[f.charId].accent;
  }
  return true;
}

function clearMove(f) {
  f.move = null;
  f.hasHit = false;
  if (f.hp > 0 && f.hitstun <= 0 && f.blockstun <= 0) {
    f.state = f.onGround ? 'idle' : 'jump';
  }
}

function actionable(f) {
  return f.onGround && !f.move && f.hitstun <= 0 && f.blockstun <= 0 && f.hp > 0;
}

function canCancel(f, into) {
  if (!f.move || !f.hasHit || f.move === 'special' || into === 'light') return false;
  if (into === 'heavy' && f.move !== 'light') return false;
  if (into !== 'heavy' && into !== 'special') return false;
  const d = CHARS[f.charId].moves[f.move];
  const end = d.startup + d.active + Math.floor(d.recovery * 0.6);
  return f.moveFrame >= d.startup && f.moveFrame <= end;
}

function applyAttackEdges(f, input) {
  if (f.hp <= 0) return;
  let name = null;
  if (input.special) name = 'special';
  else if (input.heavy) name = 'heavy';
  else if (input.light) name = 'light';
  if (!name) return;
  f.buffer = name;
  f.bufferLeft = 14;
}

function tryStartBuffered(f) {
  if (!f.buffer || f.move || !actionable(f)) return;
  const name = f.buffer;
  if (startMove(f, name)) f.buffer = null;
  else if (name === 'special') f.buffer = null;
}

function tryCancelBuffered(f) {
  if (!f.buffer || !f.move || !f.hasHit) return;
  const name = f.buffer;
  if (name === 'special' && f.meter < CHARS[f.charId].moves.special.meterCost) {
    if (canCancel(f, name)) {
      f.meterFlash = 12;
      f.deny = 42;
      f.buffer = null;
      sfx('deny');
    }
    return;
  }
  if (!canCancel(f, name)) return;
  if (startMove(f, name)) f.buffer = null;
}

function cpuAutoCancel(f) {
  if (G.mode !== 'cpu' || f.slot !== 1) return;
  if (!f.move || !f.hasHit || f.cpuRolled || f.move === 'special') return;
  const d = CHARS[f.charId].moves[f.move];
  if (f.moveFrame < d.startup) return;
  f.cpuRolled = true;
  if (f.meter >= 100 && Math.random() < 0.1) startMove(f, 'special');
  else if (f.move === 'light' && Math.random() < 0.2) startMove(f, 'heavy');
}

function spawnProjectile(f, d) {
  G.projectiles = G.projectiles.filter(function (p) { return p.owner !== f.slot; });
  G.projectiles.push({
    owner: f.slot,
    x: f.x + f.facing * 48,
    y: f.y - 72,
    vx: f.facing * d.speed,
    life: d.life,
    trail: [],
    dead: false,
    hit: {
      damage: d.damage,
      hitstun: d.hitstun,
      blockstun: d.blockstun,
      knockback: d.knockback,
      push: d.push,
      chip: d.chip,
      hitstop: d.hitstop,
      shake: d.shake,
      meterGain: d.meterGain,
      sfx: d.sfx,
    },
  });
}

function applyHit(atk, def, spec, melee) {
  const blocked = def.onGround && def.hp > 0 && def.hitstun <= 0 && !def.move && (def.wantBlock || def.blockstun > 0);
  const away = Math.sign(def.x - atk.x) || -atk.facing;
  const face = Math.sign(atk.x - def.x);
  if (face !== 0) def.facing = face;
  // 飛行道具打中時，攻擊者可能已經在出下一招，不能把這一招記成已命中。
  if (melee) {
    atk.hasHit = true;
    atk.vx = 0;
  }
  if (blocked) {
    const chip = spec.chip || 0;
    def.hp = Math.max(0, def.hp - chip);
    def.blockstun = spec.blockstun;
    def.state = 'block';
    def.vx = away * spec.push;
    def.combo = 0;
    def.comboTimer = 0;
    atk.combo = 0;
    atk.comboTimer = 0;
    atk.meter = Math.min(100, atk.meter + 3);
    burst((atk.x + def.x) / 2, def.y - 72, '#d7e6ff', 7, 2.1);
    sfx('block');
    G.hitstop = Math.max(G.hitstop, 4);
    G.shake = Math.max(G.shake, 2);
  } else {
    def.hp = Math.max(0, def.hp - spec.damage);
    def.hitstun = spec.hitstun;
    def.blockstun = 0;
    def.move = null;
    def.state = 'hitstun';
    def.vx = away * spec.knockback;
    def.vy = spec.damage >= 15 ? -2.2 : 0;
    def.hitFlash = 8;
    def.combo = 0;
    def.comboTimer = 0;
    if (atk.comboTimer > 0) atk.combo += 1;
    else atk.combo = 1;
    atk.comboTimer = Math.max(spec.hitstun, 26);
    atk.meter = Math.min(100, atk.meter + spec.meterGain);
    def.meter = Math.min(100, def.meter + 4);
    burst((atk.x + def.x) / 2, def.y - 70, '#ffe08a', 11, 3.3);
    if (spec.damage >= 15) burst((atk.x + def.x) / 2, def.y - 64, CHARS[atk.charId].accent, 8, 2.4);
    sfx(spec.sfx || 'light');
    G.hitstop = Math.max(G.hitstop, spec.hitstop || 5);
    G.shake = Math.max(G.shake, spec.shake || 4);
  }
  if (G.mode === 'cpu' && atk.slot === 1) {
    atk.plan = {
      until: G.frame + (blocked ? 28 : 78),
      left: false,
      right: false,
      up: false,
      down: false,
      attack: null,
      attackUsed: true,
    };
  }
}

function resolveHits() {
  const pending = [];
  G.fighters.forEach(function (f) {
    if (!inActive(f) || f.hasHit) return;
    const def = CHARS[f.charId].moves[f.move];
    if (def.kind === 'projectile') return;
    const foe = G.fighters[1 - f.slot];
    if (overlap(attackBox(f), hurtBox(foe))) pending.push([f, foe, def, true]);
  });
  G.projectiles.forEach(function (p) {
    if (p.dead) return;
    const foe = G.fighters[1 - p.owner];
    const box = { x: p.x - 16, y: p.y - 12, w: 32, h: 24 };
    if (overlap(box, hurtBox(foe))) {
      pending.push([G.fighters[p.owner], foe, p.hit, false]);
      p.dead = true;
    }
  });
  pending.forEach(function (hit) { applyHit(hit[0], hit[1], hit[2], hit[3]); });
  G.projectiles = G.projectiles.filter(function (p) { return !p.dead; });
}

function advanceMoves() {
  G.fighters.forEach(function (f) {
    if (!f.move) return;
    const d = CHARS[f.charId].moves[f.move];
    f.moveFrame += 1;
    if (f.moveFrame >= d.startup + d.active + d.recovery) clearMove(f);
  });
}

function updateProjectiles() {
  G.projectiles.forEach(function (p) {
    p.trail.push(p.x);
    if (p.trail.length > 5) p.trail.shift();
    p.x += p.vx;
    p.life -= 1;
    if (p.life <= 0 || p.x < -30 || p.x > VW + 30) p.dead = true;
  });
}

function blankInput() {
  return { left: false, right: false, up: false, down: false, light: false, heavy: false, special: false };
}

function readHuman(slot, edges) {
  const map = slot === 0 ? P1_KEYS : P2_KEYS;
  const alt = slot === 1 ? P2_ALT : null;
  const down = function (action) {
    return held.has(map[action]) || !!(alt && alt[action] && held.has(alt[action]));
  };
  const edged = function (action) {
    return edges.has(map[action]) || !!(alt && alt[action] && edges.has(alt[action]));
  };
  const input = {
    left: down('left'),
    right: down('right'),
    up: down('up'),
    down: down('down'),
    light: edged('light'),
    heavy: edged('heavy'),
    special: edged('special'),
  };
  if (input.left && input.right) {
    input.left = false;
    input.right = false;
  }
  return input;
}

function decidePlan(cpu, foe) {
  const dist = Math.abs(foe.x - cpu.x);
  const plan = {
    until: G.frame + 32 + (Math.random() * 26 | 0),
    left: false,
    right: false,
    up: false,
    down: false,
    attack: null,
    attackUsed: false,
  };
  const toward = foe.x < cpu.x ? 'left' : 'right';
  const away = toward === 'left' ? 'right' : 'left';
  if (cpu.meter >= 100 && cpu.charId === 'zhou' && dist > 150 && dist < 340 && Math.random() < 0.22) {
    plan.attack = 'special';
    plan.until = G.frame + 36;
    return plan;
  }
  if (cpu.meter >= 100 && cpu.charId === 'shen' && dist > 90 && dist < 160 && Math.random() < 0.2) {
    plan.attack = 'special';
    plan.until = G.frame + 36;
    return plan;
  }
  if (dist > 118) {
    plan[toward] = true;
    if (Math.random() < 0.08) plan.up = true;
    return plan;
  }
  if (dist < 40) {
    if (Math.random() < 0.45) plan[away] = true;
    else plan.attack = 'light';
    return plan;
  }
  const roll = Math.random();
  if (roll < 0.24) plan.attack = 'light';
  else if (roll < 0.34) plan.attack = 'heavy';
  else if (roll < 0.62) {
    /* 站著，給玩家出招的空隙 */
  } else if (roll < 0.82) plan[away] = true;
  else plan[toward] = true;
  return plan;
}

function cpuInput(cpu, foe) {
  const dist = Math.abs(cpu.x - foe.x);
  const move = foe.move ? CHARS[foe.charId].moves[foe.move] : null;
  const threatening = !!(move && !foe.hasHit);
  const close = !!(move && dist < move.range + 78);
  if (threatening && close && !cpu.sawThreat) {
    cpu.sawThreat = true;
    if (Math.random() < 0.36) cpu.blockAt = G.frame + 12;
  }
  if (!threatening) cpu.sawThreat = false;
  if (cpu.blockAt && G.frame >= cpu.blockAt) {
    cpu.blockUntil = G.frame + 16;
    cpu.blockAt = 0;
  }
  if (cpu.blockUntil && G.frame < cpu.blockUntil) {
    const back = blankInput();
    if (foe.x >= cpu.x) back.left = true;
    else back.right = true;
    return back;
  }
  if (!cpu.plan || G.frame >= cpu.plan.until) cpu.plan = decidePlan(cpu, foe);
  const plan = cpu.plan;
  const input = {
    left: plan.left,
    right: plan.right,
    up: plan.up,
    down: plan.down,
    light: false,
    heavy: false,
    special: false,
  };
  if (plan.attack && !plan.attackUsed) {
    input[plan.attack] = true;
    plan.attackUsed = true;
  }
  return input;
}

function updateFighter(f, input, foe) {
  f.stateFrame += 1;
  if (f.hitFlash > 0) f.hitFlash -= 1;
  if (f.meterFlash > 0) f.meterFlash -= 1;
  if (f.deny > 0) f.deny -= 1;
  if (f.comboTimer > 0) f.comboTimer -= 1;
  if (f.buffer) {
    f.bufferLeft -= 1;
    if (f.bufferLeft <= 0) f.buffer = null;
  }
  applyAttackEdges(f, input);

  if (!f.move && f.hitstun <= 0 && f.blockstun <= 0) {
    f.facing = foe.x >= f.x ? 1 : -1;
  }
  const back = (f.facing === 1 && input.left) || (f.facing === -1 && input.right);
  f.wantBlock = !!(input.down || back);

  if (f.hp <= 0) {
    f.state = 'lose';
    f.move = null;
    f.vx *= 0.8;
    physics(f);
    return;
  }
  if (f.hitstun > 0) {
    f.hitstun -= 1;
    f.state = 'hitstun';
    f.move = null;
    f.vx *= 0.86;
    physics(f);
    return;
  }
  if (f.blockstun > 0) {
    f.blockstun -= 1;
    f.state = 'block';
    f.vx *= 0.8;
    physics(f);
    return;
  }

  tryStartBuffered(f);
  if (f.move) {
    const d = CHARS[f.charId].moves[f.move];
    const active = f.moveFrame >= d.startup && f.moveFrame < d.startup + d.active;
    if (d.kind === 'dash' && active && !f.hasHit) f.vx = f.facing * d.dash;
    else f.vx = 0;
    physics(f);
    return;
  }

  if (!f.onGround) {
    if (input.left) f.vx = -AIR_SPEED;
    else if (input.right) f.vx = AIR_SPEED;
    else f.vx *= 0.98;
    f.state = 'jump';
  } else if (input.up) {
    f.vy = JUMP_V;
    f.onGround = false;
    f.state = 'jump';
    if (input.left) f.vx = -CHARS[f.charId].walk;
    else if (input.right) f.vx = CHARS[f.charId].walk;
  } else if (input.down) {
    f.vx = 0;
    f.state = 'block';
  } else if (input.left) {
    f.vx = -CHARS[f.charId].walk;
    f.state = 'walk';
  } else if (input.right) {
    f.vx = CHARS[f.charId].walk;
    f.state = 'walk';
  } else {
    f.vx *= 0.45;
    if (Math.abs(f.vx) < 0.2) f.vx = 0;
    f.state = 'idle';
  }
  physics(f);
}

function tickPhase() {
  if (G.phase === 'versus') {
    G.phaseTimer -= 1;
    G.fighters.forEach(function (f) { f.stateFrame += 1; });
    if (G.phaseTimer <= 0) startIntro();
    return;
  }
  if (G.phase === 'intro') {
    const before = G.phaseTimer;
    G.phaseTimer -= 1;
    G.fighters.forEach(function (f) { f.stateFrame += 1; });
    if (before > 45 && G.phaseTimer <= 45 && !G.gong) {
      G.gong = true;
      sfx('start');
    }
    if (G.phaseTimer <= 0) {
      G.phase = 'fight';
      G.timeLeft = ROUND_FRAMES;
    }
    return;
  }
  if (G.phase === 'roundend') {
    G.phaseTimer -= 1;
    G.fighters.forEach(function (f) { f.stateFrame += 1; });
    if (G.phaseTimer <= 0) {
      if (G.wins[0] >= 2 || G.wins[1] >= 2) {
        G.matchWinner = G.wins[0] >= 2 ? 0 : 1;
        G.screen = 'ending';
        renderOverlay();
      } else {
        if (G.roundCounted) G.round += 1;
        resetRound();
        startIntro();
      }
    }
  }
}

function step() {
  G.frame += 1;
  updateParticles();
  if (G.frame % 16 === 0) ember();
  if (G.flash > 0) G.flash -= 1;
  if (G.shake > 0) {
    G.shake *= 0.86;
    if (G.shake < 0.35) G.shake = 0;
  }

  if (G.screen === 'ending') {
    G.fighters.forEach(function (f) { f.stateFrame += 1; });
    pendingEdges.clear();
    updateProbe();
    return;
  }
  if (G.screen !== 'match') {
    pendingEdges.clear();
    updateProbe();
    return;
  }
  if (G.paused) {
    pendingEdges.clear();
    updateProbe();
    return;
  }
  if (G.phase !== 'fight') {
    pendingEdges.clear();
    tickPhase();
    updateProbe();
    return;
  }
  if (G.hitstop > 0) {
    G.hitstop -= 1;
    if (G.timeLeft > 0) G.timeLeft -= 1;
    updateProbe();
    return;
  }

  const edges = pendingEdges;
  pendingEdges = new Set();
  if (G.timeLeft > 0) G.timeLeft -= 1;

  const left = readHuman(0, edges);
  const right = G.mode === 'cpu'
    ? cpuInput(G.fighters[1], G.fighters[0])
    : readHuman(1, edges);

  updateFighter(G.fighters[0], left, G.fighters[1]);
  updateFighter(G.fighters[1], right, G.fighters[0]);
  updateProjectiles();
  G.fighters.forEach(function (f) {
    if (!f.move) return;
    const d = CHARS[f.charId].moves[f.move];
    if (d.kind === 'projectile' && f.moveFrame === d.startup && !f.spawned) {
      spawnProjectile(f, d);
      f.spawned = true;
    }
  });
  resolveHits();
  G.fighters.forEach(tryCancelBuffered);
  G.fighters.forEach(cpuAutoCancel);
  advanceMoves();
  separate();
  checkEnd();
  updateProbe();
}

function armRatio(f) {
  if (!f.move) return 0;
  const d = CHARS[f.charId].moves[f.move];
  const activeEnd = d.startup + d.active;
  if (f.moveFrame < d.startup) return (f.moveFrame / Math.max(1, d.startup)) * 0.3;
  if (f.moveFrame < activeEnd) return 1;
  return Math.max(0, 1 - (f.moveFrame - activeEnd) / Math.max(1, d.recovery));
}

function handPoint(f) {
  if (f.state === 'win') return { x: 12, y: -118 };
  if (f.state === 'hitstun' || f.state === 'lose') return { x: -6, y: -58 };
  if (f.state === 'block' || f.blockstun > 0 || (f.wantBlock && !f.move && f.onGround)) return { x: 16, y: -76 };
  if (f.state === 'jump') return { x: 22, y: -90 };
  if (f.move) {
    const r = armRatio(f);
    const d = CHARS[f.charId].moves[f.move];
    if (d.kind === 'projectile') return { x: 18 + r * 18, y: -86 + r * 8 };
    if (f.move === 'heavy' && f.charId === 'zhou') return { x: 20 + r * 50, y: -36 - (1 - r) * 48 };
    if (f.move === 'heavy' && f.charId === 'shen') return { x: 14 + r * 40, y: -108 + r * 36 };
    if (d.kind === 'dash') return { x: 18 + r * 36, y: -70 };
    return { x: 16 + r * Math.min(50, d.range * 0.55), y: -70 };
  }
  if (f.state === 'walk') return { x: 18, y: -66 + Math.sin(f.stateFrame * 0.45) * 5 };
  return { x: 18, y: -66 };
}

function drawShadow(f) {
  const lift = Math.max(0, GROUND - f.y);
  ctx.fillStyle = 'rgba(0,0,0,0.32)';
  ctx.beginPath();
  ctx.ellipse(f.x, GROUND + 3, Math.max(12, 24 - lift / 18), Math.max(3, 7 - lift / 24), 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawLimb(x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawFighter(f) {
  const c = CHARS[f.charId];
  const flash = f.hitFlash > 0 && f.hitFlash % 2 === 0;
  const outfit = flash ? '#ffffff' : c.outfit;
  const shirt = flash ? '#ffffff' : c.shirt;
  const skin = flash ? '#ffe7d2' : c.skin;
  const hair = flash ? '#ffffff' : c.hair;
  const pants = flash ? '#ffffff' : c.pants;
  const bob = (f.state === 'idle' || f.state === 'walk' || f.state === 'win') ? Math.sin(f.stateFrame * 0.16) * 1.5 : 0;
  const swing = f.state === 'walk' ? Math.sin(f.stateFrame * 0.48) * 7 : (f.state === 'jump' ? 9 : 0);
  let lean = 0;
  if (f.state === 'hitstun' || f.state === 'lose') lean = 0.32;
  else if (f.state === 'block' || f.blockstun > 0) lean = -0.16;
  else if (f.state === 'win') lean = -0.08;

  ctx.save();
  ctx.translate(f.x, f.y + bob);
  ctx.scale(f.facing, 1);
  ctx.rotate(lean);

  const torsoTop = -90 - c.tall;
  const hip = -46;
  const headCY = torsoTop - c.headR + 1;
  const hand = handPoint(f);

  drawLimb(-8, hip, -10 - swing, -22, pants, 8);
  drawLimb(-10 - swing, -22, -6 - swing * 0.2, 0, pants, 8);
  drawLimb(8, hip, 10 + swing, -22, pants, 8);
  drawLimb(10 + swing, -22, 6 + swing * 0.2, 0, pants, 8);
  ctx.strokeStyle = flash ? '#fff' : c.shoe;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-14 - swing * 0.2, 0);
  ctx.lineTo(2 - swing * 0.2, 0);
  ctx.moveTo(0 + swing * 0.2, 0);
  ctx.lineTo(16 + swing * 0.2, 0);
  ctx.stroke();

  drawLimb(-12, torsoTop + 18, -18, -58, outfit, 7);
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(-18, -58, 4.5, 0, Math.PI * 2);
  ctx.fill();

  roundRect(-c.bodyW / 2, torsoTop, c.bodyW, hip - torsoTop + 6, 7, outfit, '#1a0c10');
  roundRect(-c.bodyW / 2 + 5, torsoTop + 8, c.bodyW - 10, 13, 3, shirt, null);
  ctx.fillStyle = flash ? '#fff' : c.sash;
  ctx.fillRect(-c.bodyW / 2, torsoTop + 26, c.bodyW, 7);
  ctx.fillStyle = flash ? '#fff' : c.accent;
  ctx.beginPath();
  ctx.arc(0, torsoTop + 29, 3.2, 0, Math.PI * 2);
  ctx.fill();

  if (c.hairStyle === 'messy' && !f.move) {
    ctx.fillStyle = c.accent;
    ctx.beginPath();
    ctx.ellipse(-22, -62, 7, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#6a3418';
    ctx.fillRect(-23.5, -52, 3, 10);
  }
  if (c.glasses && !f.move && f.state !== 'hitstun') {
    ctx.fillStyle = '#f7f4ee';
    ctx.fillRect(-6, torsoTop + 18, 12, 16);
    ctx.strokeStyle = c.outfit;
    ctx.lineWidth = 1;
    ctx.strokeRect(-6, torsoTop + 18, 12, 16);
  }

  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(0, headCY, c.headR, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#1a0c10';
  ctx.stroke();

  ctx.fillStyle = hair;
  ctx.beginPath();
  if (c.hairStyle === 'messy') {
    ctx.arc(0, headCY - 1, c.headR + 1.4, Math.PI, Math.PI * 2);
    ctx.fill();
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 5 - 3, headCY - c.headR + 2);
      ctx.lineTo(i * 5, headCY - c.headR - 7);
      ctx.lineTo(i * 5 + 3, headCY - c.headR + 2);
      ctx.fill();
    }
    ctx.fillStyle = c.accent;
    ctx.fillRect(-c.headR, headCY - 3, c.headR * 2, 4);
  } else {
    ctx.arc(0, headCY - 1, c.headR + 1.2, Math.PI * 1.08, Math.PI * 1.92);
    ctx.fill();
  }

  if (!flash) {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-6, headCY - 2, 2.6, 3);
    ctx.fillRect(3.2, headCY - 2, 2.6, 3);
    ctx.strokeStyle = '#6a3b32';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    if (c.hairStyle === 'messy') ctx.arc(0, headCY + 4, 3.5, 0.15 * Math.PI, 0.85 * Math.PI);
    else {
      ctx.moveTo(-3.5, headCY + 5);
      ctx.lineTo(3.5, headCY + 5);
    }
    ctx.stroke();
  }
  if (c.glasses) {
    ctx.strokeStyle = '#e7f1ff';
    ctx.lineWidth = 1.4;
    ctx.strokeRect(-8.5, headCY - 5, 7, 5.5);
    ctx.strokeRect(1.5, headCY - 5, 7, 5.5);
    ctx.beginPath();
    ctx.moveTo(-1.5, headCY - 2);
    ctx.lineTo(1.5, headCY - 2);
    ctx.stroke();
  }

  drawLimb(10, torsoTop + 18, hand.x, hand.y, outfit, 7);
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(hand.x, hand.y, 5, 0, Math.PI * 2);
  ctx.fill();

  if (f.move === 'heavy' && f.charId === 'zhou') {
    ctx.fillStyle = '#d5dae2';
    ctx.beginPath();
    ctx.ellipse(hand.x + 14, hand.y + 2, 16, 9, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#66707c';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else if (f.move === 'heavy' && f.charId === 'shen') {
    ctx.fillStyle = '#f4f1ea';
    ctx.fillRect(hand.x - 2, hand.y - 16, 16, 20);
    ctx.strokeStyle = '#1e4f86';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(hand.x - 2, hand.y - 16, 16, 20);
  } else if (f.move === 'special' && f.charId === 'shen') {
    ctx.fillStyle = '#a61d2d';
    ctx.fillRect(hand.x + 2, hand.y - 11, 16, 16);
    ctx.fillStyle = '#e4c27a';
    ctx.fillRect(hand.x + 6, hand.y - 7, 8, 8);
  }

  ctx.restore();
}

function drawProjectiles() {
  G.projectiles.forEach(function (p) {
    p.trail.forEach(function (tx, i) {
      ctx.globalAlpha = (i + 1) / (p.trail.length + 2);
      ctx.fillStyle = '#ff7a1a';
      ctx.beginPath();
      ctx.ellipse(tx, p.y, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ff4d1a';
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, 16, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(p.x - 4, p.y - 1, 2, 0, Math.PI * 2);
    ctx.arc(p.x + 3, p.y + 2, 1.6, 0, Math.PI * 2);
    ctx.arc(p.x + 6, p.y - 2, 1.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawParticles() {
  G.particles.forEach(function (p) {
    ctx.globalAlpha = Math.max(0, p.life / p.max);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });
  ctx.globalAlpha = 1;
}

function drawWorld(time) {
  const sky = ctx.createLinearGradient(0, 0, 0, GROUND);
  sky.addColorStop(0, '#140818');
  sky.addColorStop(0.45, '#3a1d42');
  sky.addColorStop(0.78, '#a24b45');
  sky.addColorStop(1, '#e7a15a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, VW, VH);

  ctx.fillStyle = 'rgba(255, 214, 170, 0.09)';
  ctx.beginPath();
  ctx.moveTo(180, 0);
  ctx.lineTo(60, 430);
  ctx.lineTo(340, 430);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(760, 0);
  ctx.lineTo(620, 430);
  ctx.lineTo(900, 430);
  ctx.fill();

  const pan = Math.sin(time * 0.15) * 10;
  skyline.forEach(function (b) {
    ctx.fillStyle = '#1a1424';
    ctx.fillRect(b.x + pan * 0.3, GROUND - 40 - b.h, b.w, b.h + 40);
    b.windows.forEach(function (w) {
      const on = Math.sin(time * 1.5 + w.phase) > -0.35;
      ctx.fillStyle = on ? w.hue : 'rgba(30,20,28,0.4)';
      ctx.fillRect(b.x + pan * 0.3 + w.wx, GROUND - 40 - b.h + w.wy, 4, 6);
    });
  });

  ctx.fillStyle = '#d9cbb8';
  ctx.beginPath();
  ctx.moveTo(300, 268);
  ctx.lineTo(480, 208);
  ctx.lineTo(660, 268);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#cbbba6';
  ctx.fillRect(324, 268, 312, 162);
  ctx.fillStyle = '#f3eadc';
  for (let i = 0; i < 6; i++) ctx.fillRect(346 + i * 46, 286, 16, 144);
  ctx.fillStyle = '#3a2a28';
  ctx.fillRect(450, 348, 60, 82);
  ctx.fillStyle = '#6e2430';
  ctx.font = font(16, 700);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('市府廣場', 480, 232);

  ctx.strokeStyle = '#e4c27a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(70, 250);
  for (let x = 70; x <= 890; x += 16) {
    const y = 262 + Math.sin(time * 2 + x * 0.05) * 6;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  for (let x = 86; x <= 880; x += 36) {
    ctx.fillStyle = x % 72 === 14 ? '#ffb703' : '#ff8a3d';
    const y = 262 + Math.sin(time * 2 + x * 0.05) * 6;
    ctx.beginPath();
    ctx.arc(x, y, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  drawFlag(78, '#ef6c1e', time, 1);
  drawFlag(882, '#1e4f86', time, -1);

  for (let i = 0; i < 26; i++) {
    const x = 18 + i * 37;
    const y = 392 + (i % 3) * 3 + Math.sin(time * 2.2 + i) * 2;
    ctx.fillStyle = i % 2 ? '#2a1424' : '#1a2438';
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 11, y + 6, 22, 28);
  }

  ctx.fillStyle = '#4a3023';
  ctx.fillRect(118, 392, 46, 46);
  ctx.fillRect(796, 392, 46, 46);
  ctx.fillStyle = '#2a1a14';
  ctx.fillRect(132, 404, 18, 12);
  ctx.fillRect(810, 404, 18, 12);
  ctx.strokeStyle = '#cbbba6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(480, 400);
  ctx.lineTo(480, 436);
  ctx.stroke();
  ctx.fillStyle = '#888';
  ctx.beginPath();
  ctx.arc(480, 398, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#3d2918';
  ctx.fillRect(0, 430, VW, VH - 430);
  ctx.fillStyle = '#7a1e2e';
  ctx.fillRect(70, 430, 820, 20);
  ctx.fillStyle = '#e4c27a';
  ctx.fillRect(70, 428, 820, 3);
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.fillRect(70, 436, 820, 4);

  drawBanner(24, 150, '#ef6c1e', '夜市', '共好');
  drawBanner(VW - 78, 150, '#1e4f86', '靜川', '市政');
}

function drawFlag(x, color, time, dir) {
  ctx.strokeStyle = '#e4c27a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, 286);
  ctx.lineTo(x, 430);
  ctx.stroke();
  const wave = Math.sin(time * 3 + x) * 5;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, 300);
  ctx.lineTo(x + dir * (42 + wave), 316);
  ctx.lineTo(x, 334);
  ctx.fill();
}

function drawBanner(x, y, color, a, b) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 54, 78);
  ctx.beginPath();
  ctx.moveTo(x, y + 78);
  ctx.lineTo(x + 27, y + 96);
  ctx.lineTo(x + 54, y + 78);
  ctx.fill();
  ctx.fillStyle = '#fff8ea';
  ctx.font = font(16, 700);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(a, x + 27, y + 16);
  ctx.fillText(b, x + 27, y + 40);
}

function drawBar(x, y, w, h, f, align) {
  const ratio = Math.max(0, f.hp / 100);
  const shown = Math.max(ratio, f.hpShown / 100);
  ctx.fillStyle = '#1a0c10';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#f0e2b6';
  if (align === 'left') ctx.fillRect(x, y, w * shown, h);
  else ctx.fillRect(x + w * (1 - shown), y, w * shown, h);
  const c = CHARS[f.charId];
  const grd = ctx.createLinearGradient(x, y, x + w, y);
  grd.addColorStop(0, align === 'left' ? c.color : c.accent);
  grd.addColorStop(1, align === 'left' ? c.accent : c.color);
  ctx.fillStyle = grd;
  if (align === 'left') ctx.fillRect(x, y, w * ratio, h);
  else ctx.fillRect(x + w * (1 - ratio), y, w * ratio, h);
  ctx.strokeStyle = '#e4c27a';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

  const my = y + h + 4;
  ctx.fillStyle = '#1a0c10';
  ctx.fillRect(x, my, w, 8);
  const m = Math.max(0, Math.min(1, f.meter / 100));
  const full = f.meter >= 100;
  ctx.fillStyle = f.meterFlash > 0 && f.meterFlash % 2 === 0 ? '#ff8d8d' : (full ? '#fff1c4' : '#e4c27a');
  if (align === 'left') ctx.fillRect(x, my, w * m, 8);
  else ctx.fillRect(x + w * (1 - m), my, w * m, 8);
  if (full) {
    paint('必殺', align === 'left' ? x + 4 : x + w - 4, my - 1, {
      size: 11, color: '#3a2408', align: align === 'left' ? 'left' : 'right', weight: 700,
    });
  }
}

function drawPips(x, dir, wins, color) {
  for (let i = 0; i < 2; i++) {
    ctx.beginPath();
    ctx.arc(x + dir * i * 16, 78, 5, 0, Math.PI * 2);
    ctx.fillStyle = wins > i ? color : 'rgba(255,255,255,0.18)';
    ctx.fill();
    ctx.strokeStyle = '#e4c27a';
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }
}

function drawHUD() {
  const f0 = G.fighters[0];
  const f1 = G.fighters[1];
  if (!f0 || !f1) return;
  f0.hpShown += (f0.hp - f0.hpShown) * 0.14;
  f1.hpShown += (f1.hp - f1.hpShown) * 0.14;
  const c0 = CHARS[f0.charId];
  const c1 = CHARS[f1.charId];
  paint('1P  ' + c0.name, 28, 8, { size: 18, shadow: true });
  paint(c0.party, 28, 86, { size: 13, color: '#f0d7b0', weight: 400, shadow: true });
  paint(c1.name + '  ' + (G.mode === 'cpu' ? '電腦' : '2P'), VW - 28, 8, { size: 18, align: 'right', shadow: true });
  paint(c1.party, VW - 28, 86, { size: 13, color: '#f0d7b0', align: 'right', weight: 400, shadow: true });

  drawBar(28, 34, 340, 20, f0, 'left');
  drawBar(VW - 28 - 340, 34, 340, 20, f1, 'right');
  drawPips(VW / 2 - 58, -1, G.wins[0], c0.color);
  drawPips(VW / 2 + 58, 1, G.wins[1], c1.color);

  const sec = Math.max(0, Math.ceil(G.timeLeft / 60));
  ctx.fillStyle = '#140c10';
  ctx.fillRect(VW / 2 - 34, 26, 68, 40);
  ctx.strokeStyle = '#e4c27a';
  ctx.lineWidth = 2;
  ctx.strokeRect(VW / 2 - 34, 26, 68, 40);
  paint(String(sec).padStart(2, '0'), VW / 2, 32, {
    size: 26,
    align: 'center',
    color: sec <= 10 && G.phase === 'fight' ? '#ff8d8d' : '#f6edd9',
    shadow: false,
  });

  if (G.phase === 'fight' || G.phase === 'intro' || G.phase === 'roundend') {
    ctx.fillStyle = 'rgba(8, 4, 8, 0.72)';
    ctx.fillRect(0, 512, VW, 28);
    const right = G.mode === 'cpu'
      ? '右側由電腦操作'
      : '2P  ←→移動  ↑跳  ↓防  1輕  2重  3必殺';
    paint('1P  A/D移動  W跳  S防  J輕  K重  L必殺', 14, 518, { size: 13, weight: 400, shadow: false });
    paint(right, VW - 14, 518, { size: 13, align: 'right', weight: 400, shadow: false });
  }
}

function drawFloaters() {
  G.fighters.forEach(function (f) {
    if (f.deny > 0) {
      paint('能量不足', f.x, f.y - 138, { size: 14, align: 'center', color: '#ffd0d0', shadow: true });
    } else if (f.combo >= 2 && f.comboTimer > 0) {
      paint(f.combo + ' 連擊', f.x, f.y - 136, { size: 16, align: 'center', color: '#ffe7a3', shadow: true });
    }
  });
}

function drawCallout(big, sub) {
  ctx.fillStyle = 'rgba(8, 4, 8, 0.5)';
  ctx.fillRect(0, 168, VW, 108);
  paint(big, VW / 2, 180, { size: 54, align: 'center', color: '#f6edd9', shadow: true });
  if (sub) paint(sub, VW / 2, 244, { size: 18, align: 'center', color: '#e4c27a', shadow: true });
}

function drawVersus() {
  const a = CHARS[G.p1Char];
  const b = CHARS[G.p2Char];
  ctx.fillStyle = 'rgba(8, 4, 8, 0.28)';
  ctx.fillRect(0, 0, VW, VH);
  ctx.fillStyle = a.outfit;
  ctx.fillRect(0, 0, 390, VH);
  ctx.fillStyle = b.outfit;
  ctx.fillRect(570, 0, 390, VH);
  ctx.fillStyle = '#140c10';
  ctx.fillRect(390, 0, 180, VH);

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 120, 390, 360);
  ctx.clip();
  drawPortrait(G.fighters[0], 210, 470, 1.55);
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.rect(570, 120, 390, 360);
  ctx.clip();
  drawPortrait(G.fighters[1], 750, 470, 1.55);
  ctx.restore();

  paint('1P', 28, 36, { size: 16, color: '#fff4dd' });
  paint(a.name, 28, 58, { size: 36, shadow: true });
  paint(a.party, 28, 104, { size: 16, weight: 400 });
  paint(a.line, 28, 500, { size: 14, weight: 400, shadow: true });

  paint(G.mode === 'cpu' ? '電腦' : '2P', VW - 28, 36, { size: 16, align: 'right', color: '#fff4dd' });
  paint(b.name, VW - 28, 58, { size: 36, align: 'right', shadow: true });
  paint(b.party, VW - 28, 104, { size: 16, align: 'right', weight: 400 });
  paint(b.line, VW - 28, 500, { size: 14, align: 'right', weight: 400, shadow: true });

  paint('對', VW / 2, 230, { size: 48, align: 'center', shadow: true });
  paint('三戰兩勝', VW / 2, 292, { size: 16, align: 'center', color: '#e4c27a' });
  paint('Enter 開始', VW / 2, 330, { size: 14, align: 'center', weight: 400 });
}

function drawPortrait(f, dx, dy, scale) {
  ctx.save();
  ctx.translate(dx, dy);
  ctx.scale(scale, scale);
  ctx.translate(-f.x, -f.y);
  drawShadow(f);
  drawFighter(f);
  ctx.restore();
}

function drawPause() {
  ctx.fillStyle = 'rgba(6, 3, 8, 0.62)';
  ctx.fillRect(0, 0, VW, VH);
  paint('暫停', VW / 2, 210, { size: 56, align: 'center', shadow: true });
  paint('Esc 繼續　　Q 回到開頭', VW / 2, 280, { size: 18, align: 'center', color: '#e4c27a', shadow: true });
}

function render() {
  const time = performance.now() / 1000;
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  ctx.clearRect(0, 0, VW, VH);
  ctx.save();
  if (G.shake > 0.4 && !reduceMotion) {
    ctx.translate((Math.random() - 0.5) * G.shake, (Math.random() - 0.5) * G.shake);
  }
  drawWorld(time);
  const showActors = (G.screen === 'match' || G.screen === 'ending') && G.fighters.length === 2;
  if (showActors && G.phase !== 'versus') {
    drawShadow(G.fighters[0]);
    drawShadow(G.fighters[1]);
    const order = G.fighters.slice().sort(function (a, b) { return a.y - b.y; });
    order.forEach(drawFighter);
    drawProjectiles();
  }
  drawParticles();
  if (BOXES && showActors && G.phase !== 'versus') drawDebug();
  ctx.restore();

  if (G.flash > 0) {
    ctx.fillStyle = G.flashColor;
    ctx.globalAlpha = 0.16;
    ctx.fillRect(0, 0, VW, VH);
    ctx.globalAlpha = 1;
  }
  if (showActors && G.phase !== 'versus') {
    drawHUD();
    drawFloaters();
  }
  if (G.screen === 'match' && G.phase === 'versus' && G.fighters.length === 2) drawVersus();
  if (G.screen === 'match' && G.phase === 'intro') {
    if (G.phaseTimer > 45) drawCallout('第 ' + G.round + ' 回合', '三戰兩勝');
    else drawCallout('開打', '');
  }
  if ((G.screen === 'match' || G.screen === 'ending') && G.phase === 'roundend' && G.screen !== 'ending') {
    drawCallout(G.banner, G.bannerSub);
  }
  if (G.paused) drawPause();
  updateProbe();
}

function drawDebug() {
  G.fighters.forEach(function (f) {
    const h = hurtBox(f);
    ctx.strokeStyle = 'rgba(80, 220, 140, 0.9)';
    ctx.lineWidth = 1;
    ctx.strokeRect(h.x, h.y, h.w, h.h);
    if (inActive(f)) {
      const d = CHARS[f.charId].moves[f.move];
      if (d.kind !== 'projectile') {
        const a = attackBox(f);
        ctx.strokeStyle = 'rgba(255, 70, 70, 0.95)';
        ctx.strokeRect(a.x, a.y, a.w, a.h);
      }
    }
  });
}

function cardHtml(charId, side) {
  const c = CHARS[charId];
  const sideLabel = side === 'left'
    ? '左側 · 1P'
    : (G.mode === 'cpu' ? '右側 · 電腦' : '右側 · 2P');
  return (
    '<article class="card" style="border-color:' + c.accent + '">' +
      '<p class="kicker">' + sideLabel + '</p>' +
      '<h3>' + c.name + '</h3>' +
      '<p>' + c.party + '</p>' +
      '<p>' + c.trait + '</p>' +
      '<ul><li>輕攻　' + c.lightName + '</li><li>重攻　' + c.heavyName + '</li><li>必殺　' + c.specialName + '</li></ul>' +
    '</article>'
  );
}

function renderOverlay() {
  if (G.screen === 'match') {
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
    updateProbe();
    return;
  }
  overlay.classList.remove('hidden');
  if (G.screen === 'title') {
    overlay.innerHTML =
      '<section class="panel">' +
        '<div class="seal">虛構</div>' +
        '<p class="kicker">諷刺短篇 · 二〇二六</p>' +
        '<h1>臺北市長<br>政見格鬥</h1>' +
        '<p class="lead">兩個發明出來的候選人，約在市府廣場的辯論臺上，把吵不完的規則換成三個回合。</p>' +
        '<p class="disclaimer">角色、黨名、主張皆為創作，與任何真實人物、政黨、選舉無關。這不是競選文宣。</p>' +
        '<div class="row"><button type="button" data-act="start-story">進入廣場</button></div>' +
        '<p class="disclaimer">Enter 或空白鍵繼續</p>' +
      '</section>';
  } else if (G.screen === 'story') {
    const page = STORY[G.storyPage];
    const last = G.storyPage === STORY.length - 1;
    const paras = page.paragraphs.map(function (p) { return '<p>' + p + '</p>'; }).join('');
    overlay.innerHTML =
      '<section class="panel">' +
        '<p class="kicker">' + page.kicker + ' · ' + (G.storyPage + 1) + ' / ' + STORY.length + '</p>' +
        '<h1>' + page.title + '</h1>' +
        paras +
        '<div class="row">' +
          (G.storyPage > 0 ? '<button type="button" class="ghost" data-act="story-prev">上一頁</button>' : '') +
          '<button type="button" data-act="story-next">' + (last ? '走向對戰' : '繼續') + '</button>' +
        '</div>' +
      '</section>';
  } else if (G.screen === 'mode') {
    const who = G.mode === 'cpu'
      ? '你操作左側的' + CHARS[G.p1Char].name + '，右側的' + CHARS[G.p2Char].name + '由電腦操作。'
      : '1P 操作左側的' + CHARS[G.p1Char].name + '，2P 操作右側的' + CHARS[G.p2Char].name + '。';
    overlay.innerHTML =
      '<section class="panel">' +
        '<p class="kicker">選擇怎麼打這一場</p>' +
        '<h1>走上講臺</h1>' +
        '<div class="row">' +
          '<button type="button" data-act="mode-pvp" aria-pressed="' + (G.mode === 'pvp') + '">雙人同鍵盤</button>' +
          '<button type="button" data-act="mode-cpu" aria-pressed="' + (G.mode === 'cpu') + '">對上電腦</button>' +
        '</div>' +
        '<div class="cards">' + cardHtml(G.p1Char, 'left') + cardHtml(G.p2Char, 'right') + '</div>' +
        '<p>' + who + '</p>' +
        '<p>往後退會順便防禦，S 與 ↓ 則是原地防禦。跳起來可以躲過多數站立攻擊。打中後，輕攻可接重攻或必殺，重攻可接必殺。必殺被防住仍會削一點血。</p>' +
        '<div class="row">' +
          '<button type="button" class="ghost" data-act="swap">交換左右角色（R）</button>' +
          '<button type="button" data-act="fight">開始對戰</button>' +
        '</div>' +
      '</section>';
  } else if (G.screen === 'ending') {
    const f = G.fighters[G.matchWinner];
    const c = CHARS[f.charId];
    const other = G.wins[1 - G.matchWinner];
    overlay.innerHTML =
      '<section class="panel">' +
        '<p class="kicker">這一晚的麥克風</p>' +
        '<h1>' + c.name + '</h1>' +
        '<p>' + c.party + '　' + G.wins[G.matchWinner] + ' 勝 ' + other + '</p>' +
        '<p>' + c.win + '</p>' +
        '<p class="disclaimer">這是諷刺虛構，不是政見，也不是在幫任何人拉票。</p>' +
        '<div class="row">' +
          '<button type="button" data-act="rematch">再戰一場</button>' +
          '<button type="button" class="ghost" data-act="title">回到開頭</button>' +
        '</div>' +
      '</section>';
  }
  updateProbe();
}

function goTitle() {
  G.screen = 'title';
  G.paused = false;
  G.storyPage = 0;
  renderOverlay();
}

function handleMenu(code) {
  if (code === 'Escape' && G.screen === 'match' && !G.paused && G.phase === 'fight') {
    G.paused = true;
    return;
  }
  if (G.paused && code === 'Escape') {
    G.paused = false;
    return;
  }
  if (G.paused && code === 'KeyQ') {
    goTitle();
    return;
  }
  if (G.screen === 'title' && (code === 'Enter' || code === 'Space')) {
    G.screen = 'story';
    G.storyPage = 0;
    renderOverlay();
    return;
  }
  if (G.screen === 'story' && (code === 'Enter' || code === 'Space')) {
    advanceStory();
    return;
  }
  if (G.screen === 'story' && code === 'Backspace') {
    if (G.storyPage > 0) {
      G.storyPage -= 1;
      renderOverlay();
    }
    return;
  }
  if (G.screen === 'mode') {
    if (code === 'Digit1') { G.mode = 'pvp'; renderOverlay(); return; }
    if (code === 'Digit2') { G.mode = 'cpu'; renderOverlay(); return; }
    if (code === 'KeyR') { swapChars(); return; }
    if (code === 'Enter' || code === 'Space') { startMatch(); return; }
  }
  if (G.screen === 'match' && G.phase === 'versus' && (code === 'Enter' || code === 'Space')) {
    startIntro();
    return;
  }
  if (G.screen === 'ending' && (code === 'Enter' || code === 'Space')) startMatch();
}

function advanceStory() {
  if (G.storyPage >= STORY.length - 1) {
    G.screen = 'mode';
    renderOverlay();
    return;
  }
  G.storyPage += 1;
  renderOverlay();
}

function swapChars() {
  const tmp = G.p1Char;
  G.p1Char = G.p2Char;
  G.p2Char = tmp;
  renderOverlay();
}

function onClickOverlay(e) {
  const node = e.target.closest('[data-act]');
  if (!node) return;
  ensureAudio();
  const act = node.dataset.act;
  if (act === 'start-story') {
    G.screen = 'story';
    G.storyPage = 0;
    renderOverlay();
  } else if (act === 'story-next') advanceStory();
  else if (act === 'story-prev' && G.storyPage > 0) {
    G.storyPage -= 1;
    renderOverlay();
  } else if (act === 'mode-pvp') {
    G.mode = 'pvp';
    renderOverlay();
  } else if (act === 'mode-cpu') {
    G.mode = 'cpu';
    renderOverlay();
  } else if (act === 'swap') swapChars();
  else if (act === 'fight') startMatch();
  else if (act === 'rematch') startMatch();
  else if (act === 'title') goTitle();
}

function onKeyDown(e) {
  if (e.code === 'Enter' || e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    e.preventDefault();
  }
  if (e.code === 'Backspace' && G.screen === 'story') e.preventDefault();
  if (e.code === 'Tab' && G.screen === 'match') e.preventDefault();
  if (e.repeat) return;
  held.add(e.code);
  pendingEdges.add(e.code);
  ensureAudio();
  handleMenu(e.code);
}

function onKeyUp(e) {
  held.delete(e.code);
}

function fighterSnap(f) {
  if (!f) return null;
  return {
    charId: f.charId,
    name: CHARS[f.charId].name,
    hp: f.hp,
    meter: Math.round(f.meter),
    x: Math.round(f.x * 10) / 10,
    y: Math.round(f.y * 10) / 10,
    state: f.state,
    move: f.move,
    moveFrame: f.moveFrame,
    facing: f.facing,
    hitstun: f.hitstun,
    blockstun: f.blockstun,
    onGround: f.onGround,
    deny: f.deny,
  };
}

function updateProbe() {
  if (!DEBUG || !probe) return;
  probe.textContent = JSON.stringify(snapshot());
}

function snapshot() {
  return {
    screen: G.screen,
    storyPage: G.storyPage,
    mode: G.mode,
    phase: G.phase,
    phaseTimer: G.phaseTimer,
    paused: G.paused,
    round: G.round,
    wins: G.wins.slice(),
    timeLeft: G.timeLeft,
    banner: G.banner,
    bannerSub: G.bannerSub,
    p1Char: G.p1Char,
    p2Char: G.p2Char,
    projectiles: G.projectiles.length,
    matchWinner: G.matchWinner,
    p1: fighterSnap(G.fighters[0]),
    p2: fighterSnap(G.fighters[1]),
  };
}

if (DEBUG) {
  window.__GAME = {
    setManual: function (v) { G.manual = !!v; },
    step: function (n) {
      const count = n || 1;
      for (let i = 0; i < count; i++) step();
      render();
    },
    snapshot: snapshot,
    start: function (mode) {
      if (mode) G.mode = mode;
      startMatch();
      render();
    },
    swap: function () { swapChars(); render(); },
    setHp: function (slot, hp) {
      const f = G.fighters[slot];
      f.hp = hp;
      f.hpShown = hp;
    },
    setMeter: function (slot, m) { G.fighters[slot].meter = m; },
    setTime: function (frames) { G.timeLeft = frames; },
    setPos: function (slot, x) { G.fighters[slot].x = x; },
    hold: function (slot, dir, on) {
      const map = slot === 0 ? P1_KEYS : P2_KEYS;
      const code = map[dir];
      if (!code) return;
      if (on) held.add(code);
      else held.delete(code);
    },
    tap: function (slot, action) {
      const map = slot === 0 ? P1_KEYS : P2_KEYS;
      pendingEdges.add(map[action]);
    },
  };
}

muteBtn.addEventListener('click', function () {
  ensureAudio();
  G.muted = !G.muted;
  muteBtn.textContent = G.muted ? '音效：關' : '音效：開';
});
overlay.addEventListener('click', onClickOverlay);
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
window.addEventListener('blur', function () {
  held.clear();
  pendingEdges.clear();
});
canvas.addEventListener('click', function () {
  ensureAudio();
  if (G.screen === 'match' && G.phase === 'versus') startIntro();
});

buildSkyline();
renderOverlay();

let lastTime = 0;
let accumulator = 0;
function loop(now) {
  if (!lastTime) lastTime = now;
  const dt = Math.min(48, now - lastTime);
  lastTime = now;
  if (!G.manual) {
    accumulator += dt;
    let guard = 0;
    while (accumulator >= 1000 / 60 && guard < 5) {
      step();
      accumulator -= 1000 / 60;
      guard += 1;
    }
  }
  render();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
