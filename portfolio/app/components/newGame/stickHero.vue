<template>
  <div class="relative mt-4 w-full max-w-2xl md:max-w-xl lg:max-w-xl mx-auto">
    <!-- Dezenter Farbschein hinter dem Spiel, deutlich zurückhaltender als bei den Projekten,
         da der Spiel-Hintergrund selbst schon kräftig eingefärbt ist -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
      <div
        class="w-48 h-48 md:w-72 md:h-72 rounded-full blur-3xl opacity-10"
        style="background: var(--color-accent)"
      />
    </div>

    <div class="relative aspect-video rounded-xl overflow-hidden shadow-xl bg-[#9CAF88] theme-sunset:bg-[#f2a65a] theme-ocean:bg-[#6CA6CD] theme-slate:bg-[#8b96a5]">

    <div class="absolute top-4 right-6 text-3xl font-bold text-gray-800 font-mono z-10">
      {{ score }}
    </div>

    <div v-if="gameState === 'GAMEOVER'" class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-20 transition-opacity">
      <h2 class="text-4xl font-bold text-white mb-4">Game Over</h2>
      <button
        @click="resetGame"
        class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-105"
      >
        Nochmal spielen
      </button>
    </div>

    <div v-if="gameState === 'WAITING' && score === 0" class="absolute top-1/4 w-full text-center text-gray-500 font-medium z-10 animate-pulse pointer-events-none">
      Halte gedrückt, um die Brücke zu bauen
    </div>

    <canvas
      ref="gameCanvas"
      width="800"
      height="450"
      class="w-full h-full block cursor-pointer"
      @mousedown="startBuilding"
      @touchstart.prevent="startBuilding"
      @mouseup="stopBuilding"
      @touchend.prevent="stopBuilding"
      @mouseleave="stopBuilding"
    ></canvas>

    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const enum GameStates {
  WAITING = 'WAITING',
  GROWING = 'GROWING',
  FALLING = 'FALLING',
  WALKING = 'WALKING',
  PANNING = 'PANNING',
  GAMEOVER = 'GAMEOVER'
}

const gameCanvas = ref<HTMLCanvasElement | null>(null);
const score = ref(0);
const gameState = ref(GameStates.WAITING);
let ctx: CanvasRenderingContext2D | null = null;
let animationFrameId: number | null = null;

const { current: currentTheme } = useColorTheme();


// --- SPIEL VARIABLEN ---
const CANVAS_W = 800;
const CANVAS_H = 450;
const PLATFORM_H = 120; // Höhe der Plattformen vom unteren Rand
const PLATFORM_W = 100; // Breite der Plattform
const POS_PLATFORM = 50;
const PLATFORM_TOP = CANVAS_H - PLATFORM_H;
const PLATFORM_COLOR = '#2c3e50';
const PERFECT_ZONE_W = 14; // Breite der roten Zielmarkierung in der Plattformmitte

// --- Platform und Canvas Objekte ---
const platformList: Platform[] = [];


interface Platform {
  posCanvasX: number;
  width: number;
}

function generateInitialPlatorms() {
    const initialPlatform: Platform = {
    posCanvasX: POS_PLATFORM,
    width: PLATFORM_W
    };

    platformList.push(initialPlatform);
    let actualPlatform: Platform = initialPlatform;

    for(let i = 0; i < 4; i++) {
        const newPlatform: Platform = generatePlatform(actualPlatform);
        platformList.push(newPlatform);
        actualPlatform = newPlatform;
    }

}

interface Character {
  size: number;
  posX: number;
  posY: number;
  style: string;
}

const characterSize = 30;
const character: Character = {
    size: characterSize,
    posX: CANVAS_H - PLATFORM_H - characterSize,
    posY: CANVAS_H - PLATFORM_H - characterSize,
    style: '#e74c3c' // Farbe von Stirnband und Zielmarkierungen
};
const CHARACTER_BODY_COLOR = '#1f2933';

// --- Animations- und Effekt-Zustand (rein optisch, beeinflusst die Spiellogik nicht) ---
let elapsed = 0; // Gesamtzeit in s, für Atmen, Funkeln und Wolken-Drift
let worldScroll = 0; // Wie weit die Welt insgesamt gescrollt ist, für den Parallax-Hintergrund
let walkCycle = 0; // Phase der Laufanimation
let isMoving = false;
let squash = 0; // 1 = maximal gestaucht direkt nach der Landung, klingt auf 0 ab
let charRotation = 0; // Drehung beim Absturz
let shakeTime = 0;
let shakeDuration = 0;
let shakeStrength = 0;
let landedPerfect = false;
let bridgeTooShort = false;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  life: number;
  maxLife: number;
}

interface Cloud {
  x: number;
  y: number;
  scale: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  phase: number;
}

let particles: Particle[] = [];
let floatingTexts: FloatingText[] = [];
let clouds: Cloud[] = [];
let stars: Star[] = [];

function mod(value: number, n: number) {
  return ((value % n) + n) % n;
}

function generateBackground() {
  clouds = Array.from({ length: 5 }, (_, i) => ({
    x: i * 200 + Math.random() * 100,
    y: 40 + Math.random() * 110,
    scale: 0.6 + Math.random() * 0.6,
  }));
  stars = Array.from({ length: 45 }, () => ({
    x: Math.random() * CANVAS_W,
    y: Math.random() * 230,
    size: Math.random() < 0.8 ? 1.5 : 2.5,
    phase: Math.random() * Math.PI * 2,
  }));
}

function spawnParticles(x: number, y: number, count: number, color: string, speed: number) {
  for (let i = 0; i < count; i++) {
    const maxLife = 0.4 + Math.random() * 0.4;
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * speed,
      vy: -Math.random() * speed * 0.8,
      life: maxLife,
      maxLife,
      size: 2 + Math.random() * 3,
      color,
    });
  }
}

function triggerShake(duration: number, strength: number) {
  shakeTime = duration;
  shakeDuration = duration;
  shakeStrength = strength;
}

// Verschiebt die komplette Spielwelt nach links (die "Kamera" fährt nach rechts)
function scrollWorld(step: number) {
  platformList.forEach(p => p.posCanvasX -= step);
  bridge.posX -= step;
  particles.forEach(p => p.x -= step);
  floatingTexts.forEach(t => t.x -= step);
  worldScroll += step;
}

// --- Zeichnen ---
function roundedRectPath(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function drawSkyDecor(c: CanvasRenderingContext2D) {
  if (currentTheme.value.isDark) {
    // Dunkle Themes: funkelnde Sterne
    c.fillStyle = '#ffffff';
    stars.forEach((s) => {
      c.globalAlpha = 0.35 + 0.35 * Math.sin(elapsed * 2 + s.phase);
      c.fillRect(mod(s.x - worldScroll * 0.05, CANVAS_W), s.y, s.size, s.size);
    });
    c.globalAlpha = 1;
    return;
  }

  // Helle Themes: Wolken, die langsam treiben und sich kaum mitbewegen (weit weg)
  c.fillStyle = 'rgba(255, 255, 255, 0.55)';
  c.beginPath();
  clouds.forEach((cloud) => {
    const x = mod(cloud.x - worldScroll * 0.1 - elapsed * 6, CANVAS_W + 200) - 100;
    const s = cloud.scale;
    const circles: [number, number, number][] = [
      [x, cloud.y, 18 * s],
      [x + 20 * s, cloud.y - 10 * s, 24 * s],
      [x + 44 * s, cloud.y, 18 * s],
    ];
    circles.forEach(([cx, cy, r]) => {
      c.moveTo(cx + r, cy);
      c.arc(cx, cy, r, 0, Math.PI * 2);
    });
  });
  c.fill();
}

function drawHills(c: CanvasRenderingContext2D, parallax: number, offset: number, baseY: number, amp1: number, amp2: number, color: string) {
  const shift = worldScroll * parallax + offset;
  c.fillStyle = color;
  c.beginPath();
  c.moveTo(0, CANVAS_H);
  for (let x = 0; x <= CANVAS_W; x += 8) {
    const wx = x + shift;
    c.lineTo(x, baseY - amp1 * Math.sin(wx * 0.006) - amp2 * Math.sin(wx * 0.017 + 1.3));
  }
  c.lineTo(CANVAS_W, CANVAS_H);
  c.closePath();
  c.fill();
}

function drawCharacter(c: CanvasRenderingContext2D) {
  const { posX, posY, size } = character;
  const standing = gameState.value === GameStates.WAITING
    || gameState.value === GameStates.GROWING
    || gameState.value === GameStates.FALLING;
  const breathe = standing ? Math.sin(elapsed * 3) * 0.025 : 0;

  c.save();
  // Ursprung auf die Füße legen, damit Stauchen und Atmen vom Boden aus wirken
  c.translate(posX + size / 2, posY + size);
  c.scale(1 + 0.3 * squash, 1 - 0.3 * squash + breathe);
  if (charRotation !== 0) {
    c.translate(0, -size / 2);
    c.rotate(charRotation);
    c.translate(0, size / 2);
  }

  // Beine
  const legSwing = isMoving ? Math.sin(walkCycle) * 4 : 0;
  c.fillStyle = CHARACTER_BODY_COLOR;
  c.fillRect(-7 + legSwing, -9, 5, 9);
  c.fillRect(2 - legSwing, -9, 5, 9);

  // Körper
  roundedRectPath(c, -11, -size, 22, 23, 6);
  c.fill();

  // Stirnband mit flatternden Enden am Hinterkopf
  const flutter = Math.sin(elapsed * (isMoving ? 18 : 5)) * 2;
  c.fillStyle = character.style;
  c.fillRect(-11, -23, 22, 4);
  c.beginPath();
  c.moveTo(-11, -22);
  c.lineTo(-19, -25 + flutter);
  c.lineTo(-18, -19 + flutter);
  c.closePath();
  c.fill();

  // Auge (schaut nach rechts, in Laufrichtung)
  c.fillStyle = '#ffffff';
  c.fillRect(4, -16, 3, 3);

  c.restore();
}

function draw() {
    if(!ctx || platformList.length === 0) return;
    const c = ctx;

    c.clearRect(0, 0, CANVAS_W, CANVAS_H);
    c.save();

    if (shakeTime > 0) {
      const strength = shakeStrength * (shakeTime / shakeDuration);
      c.translate((Math.random() - 0.5) * 2 * strength, (Math.random() - 0.5) * 2 * strength);
    }

    // Hintergrund: je weiter hinten, desto langsamer bewegt er sich mit (Parallax)
    drawSkyDecor(c);
    drawHills(c, 0.15, 0, 265, 40, 15, 'rgba(0, 0, 0, 0.07)');
    drawHills(c, 0.35, 500, 320, 30, 12, 'rgba(0, 0, 0, 0.12)');

    platformList.forEach((platform, index) => {
        c.fillStyle = PLATFORM_COLOR;
        c.fillRect(platform.posCanvasX, PLATFORM_TOP, platform.width, PLATFORM_H);

        // Zielmarkierung für den Perfect Hit, nicht auf der Plattform, auf der man gerade steht
        const isCurrent = index === 0 || (index === 1 && gameState.value === GameStates.PANNING);
        if (!isCurrent) {
            c.fillStyle = character.style;
            c.fillRect(platform.posCanvasX + platform.width / 2 - PERFECT_ZONE_W / 2, PLATFORM_TOP, PERFECT_ZONE_W, 5);
        }
    });

    if (bridge.length > 0) {
        c.save();
        c.translate(bridge.posX, bridge.posY);
        c.rotate(bridge.angle);
        c.fillStyle = PLATFORM_COLOR;
        c.fillRect(0, -bridge.thickness, bridge.length, bridge.thickness);
        c.restore();
    }

    particles.forEach((p) => {
        c.globalAlpha = Math.max(p.life / p.maxLife, 0);
        c.fillStyle = p.color;
        c.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    });
    c.globalAlpha = 1;

    drawCharacter(c);

    c.textAlign = 'center';
    c.font = 'bold 26px Oswald, sans-serif';
    c.lineWidth = 4;
    floatingTexts.forEach((t) => {
        c.globalAlpha = Math.max(t.life / t.maxLife, 0);
        c.strokeStyle = 'rgba(0, 0, 0, 0.35)';
        c.strokeText(t.text, t.x, t.y);
        c.fillStyle = '#ffffff';
        c.fillText(t.text, t.x, t.y);
    });
    c.globalAlpha = 1;

    c.restore();
}

function generatePlatform(lastPlatform: Platform): Platform {
    const minWidth = 60;
    const maxWidth = 120;
    const gapMin = 80;
    const gapMax = 300;

    const width = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
    const gap = Math.floor(Math.random() * (gapMax - gapMin + 1)) + gapMin;
    const newPos = lastPlatform.posCanvasX + lastPlatform.width + gap;
    return {
        posCanvasX: newPos ,
        width: width
    };
}

// --- Brückenbaulogik ---
let walkedDistance = 0;

// --- Kamera-Pan Interpolation (Charakter läuft sichtbar zur Plattformkante) ---
let panEdgeOffset = 0;

function startBuilding() {
    if(gameState.value === GameStates.WAITING) {
        gameState.value = GameStates.GROWING;
    }
}

function stopBuilding() {
    if(gameState.value === GameStates.GROWING) {
        gameState.value = GameStates.FALLING;
    }
}

let lastTimestamp: number | null = null;

function loop(timestamp: number) {
  if (lastTimestamp === null) lastTimestamp = timestamp;
  // Clamp verhindert einen riesigen Sprung, falls der Tab kurz inaktiv/im Hintergrund war
  const deltaSeconds = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
  lastTimestamp = timestamp;

  update(deltaSeconds);
  draw();
  animationFrameId = requestAnimationFrame(loop);
}

interface Bridge {
    posX: number;
    posY: number;
    length: number;
    angle: number;
    thickness: number;
}

let bridge: Bridge = {
    posX: 0,
    posY: 0,
    length: 0,
    angle: -Math.PI / 2,
    thickness: 6
};

// --- Geschwindigkeiten in Einheiten pro Sekunde (nicht mehr pro Frame!) ---
// Dadurch läuft das Spiel auf jedem Bildschirm gleich schnell, egal ob 60Hz oder 144Hz.
const GROWTH_SPEED_BASE = 280; // px/s, Brücke wächst beim Halten (Basistempo)
const GROWTH_SPEED_MAX = 720; // Obergrenze, damit es nie "unschaffbar" schnell wird
const GROWTH_SPEED_PER_SCORE = 16; // px/s schneller pro erreichtem Punkt, bis zur Obergrenze (bei Score ~28 erreicht)
const FALL_ROTATION_SPEED = 3; // rad/s, Brücke kippt beim Loslassen um
const WALK_SPEED = 300; // px/s, Charakter läuft über die fertige Brücke
const PAN_SPEED = 240; // px/s, Kamera schwenkt zur neuen Plattform
const WALK_TO_EDGE_SPEED = 240; // px/s, Charakter läuft zur Plattformkante
const GAMEOVER_FALL_SPEED = 480; // px/s, Charakter fällt bei Game Over
const GAMEOVER_SPIN_SPEED = 5; // rad/s, Charakter dreht sich beim Fallen

function currentGrowthSpeed() {
  return Math.min(GROWTH_SPEED_BASE + score.value * GROWTH_SPEED_PER_SCORE, GROWTH_SPEED_MAX);
}

// Brücke ist gerade flach aufgeschlagen: Perfect Hit prüfen und Aufprall-Effekt auslösen
function onBridgeLanded() {
  const target = platformList[1]!;
  const tipX = bridge.posX + bridge.length;
  const targetCenter = target.posCanvasX + target.width / 2;

  landedPerfect = Math.abs(tipX - targetCenter) <= PERFECT_ZONE_W / 2;
  bridgeTooShort = tipX < target.posCanvasX;

  if (tipX >= target.posCanvasX && tipX <= target.posCanvasX + target.width) {
    spawnParticles(tipX, PLATFORM_TOP, 6, 'rgba(255, 255, 255, 0.8)', 120);
    triggerShake(0.1, 2);
  }
}

function onSuccessfulLanding(target: Platform) {
  score.value += landedPerfect ? 2 : 1;
  squash = 1;
  spawnParticles(character.posX + character.size / 2, PLATFORM_TOP, 8, 'rgba(255, 255, 255, 0.8)', 100);

  if (landedPerfect) {
    const centerX = target.posCanvasX + target.width / 2;
    spawnParticles(centerX, PLATFORM_TOP, 18, character.style, 260);
    floatingTexts.push({ x: centerX, y: PLATFORM_TOP - 60, text: 'PERFECT +2', life: 1, maxLife: 1 });
  }
}

function updateEffects(deltaSeconds: number) {
  if (isMoving) walkCycle += deltaSeconds * 16;
  squash = Math.max(0, squash - deltaSeconds * 4);
  shakeTime = Math.max(0, shakeTime - deltaSeconds);

  particles.forEach((p) => {
    p.vy += 700 * deltaSeconds;
    p.x += p.vx * deltaSeconds;
    p.y += p.vy * deltaSeconds;
    p.life -= deltaSeconds;
  });
  particles = particles.filter(p => p.life > 0);

  floatingTexts.forEach((t) => {
    t.y -= 40 * deltaSeconds;
    t.life -= deltaSeconds;
  });
  floatingTexts = floatingTexts.filter(t => t.life > 0);
}

function update(deltaSeconds: number) {
  elapsed += deltaSeconds;
  isMoving = false;

  if (gameState.value === GameStates.GROWING) {
    bridge.length += currentGrowthSpeed() * deltaSeconds;
  }
  if (gameState.value === GameStates.FALLING) {
    bridge.angle += FALL_ROTATION_SPEED * deltaSeconds;
    if (bridge.angle >= 0) {
      bridge.angle = 0;
      onBridgeLanded();
      gameState.value = GameStates.WALKING;
    }
  }
  if (gameState.value === GameStates.WALKING) {
    const step = WALK_SPEED * deltaSeconds;

    scrollWorld(step);
    walkedDistance += step;
    isMoving = true;

    // Hat die Spitze der Brücke den Charakter erreicht?
    if (walkedDistance >= bridge.length) {
      const targetPlatform = platformList[1]!;
      const charCenter = character.posX + character.size;
      // Steht der Charakter über der Zielplattform?
      if (charCenter >= targetPlatform.posCanvasX && charCenter <= targetPlatform.posCanvasX + targetPlatform.width) {
        onSuccessfulLanding(targetPlatform);
        // Zielposition (Offset relativ zur Plattform) für das Weiterlaufen zur Kante merken
        panEdgeOffset = targetPlatform.width - character.size - bridge.thickness;
        gameState.value = GameStates.PANNING;
      } else {
        triggerShake(0.4, 8);
        gameState.value = GameStates.GAMEOVER;
      }
    }
  }

  if (gameState.value === GameStates.PANNING) {
    const targetPlatform = platformList[1]!;

    // Versatz des Charakters relativ zur Zielplattform VOR dem Kamera-Schwenk dieses Frames
    const prevOffset = character.posX - targetPlatform.posCanvasX;

    const remaining = targetPlatform.posCanvasX - POS_PLATFORM;
    if (remaining > 0) {
      scrollWorld(Math.min(PAN_SPEED * deltaSeconds, remaining));
    }

    // Charakter läuft unabhängig vom Kamera-Schwenk mit eigenem Tempo zur Plattformkante
    const offsetDiff = panEdgeOffset - prevOffset;
    const offsetStep = Math.sign(offsetDiff) * Math.min(WALK_TO_EDGE_SPEED * deltaSeconds, Math.abs(offsetDiff));
    const newOffset = prevOffset + offsetStep;
    character.posX = targetPlatform.posCanvasX + newOffset;
    if (Math.abs(offsetStep) > 0.01) isMoving = true;

    const panDone = targetPlatform.posCanvasX <= POS_PLATFORM;
    const walkDone = Math.abs(offsetDiff) < 0.01;

    if (panDone && walkDone) {

      platformList.shift();
      platformList.push(generatePlatform(platformList[platformList.length - 1]!));

      // B. Um Pixelfehler zu vermeiden, richten wir die Plattform exakt auf X=50 aus
      const offset = POS_PLATFORM - platformList[0]!.posCanvasX;
      platformList.forEach(p => p.posCanvasX += offset);

      // C. Charakter und Brücke an die Kante der neuen Plattform setzen
      character.posX = platformList[0]!.posCanvasX + platformList[0]!.width - character.size - bridge.thickness;

      bridge.length = 0;
      walkedDistance = 0;
      bridge.angle = -Math.PI / 2;
      bridge.posX = platformList[0]!.posCanvasX + platformList[0]!.width - bridge.thickness;

      // Bereit für den nächsten Klick!
      gameState.value = GameStates.WAITING;
    }
  }

  // 5. Game Over (Charakter fällt, eine zu kurze Brücke kippt nach unten weg)
  if (gameState.value === GameStates.GAMEOVER) {
    character.posY += GAMEOVER_FALL_SPEED * deltaSeconds;
    charRotation += GAMEOVER_SPIN_SPEED * deltaSeconds;
    if (bridgeTooShort && bridge.angle < Math.PI / 2) {
      bridge.angle = Math.min(bridge.angle + FALL_ROTATION_SPEED * deltaSeconds, Math.PI / 2);
    }
  }

  updateEffects(deltaSeconds);
}

function initGame() {
    generateInitialPlatorms();
    generateBackground();
    // Gleiche Startposition wie nach jedem Plattformwechsel: an der Kante, direkt hinter der Brücke
    character.posX = platformList[0]!.posCanvasX + platformList[0]!.width - character.size - bridge.thickness;
    bridge = {
        posX: platformList[0]!.posCanvasX + platformList[0]!.width - bridge.thickness,
        posY: CANVAS_H - PLATFORM_H + bridge.thickness,
        length: 0,
        angle: -Math.PI / 2,
        thickness: 6
    };
}

function resetGame() {
  score.value = 0;
  walkedDistance = 0;

  platformList.length = 0;
  generateInitialPlatorms();

  character.posX = platformList[0]!.posCanvasX + platformList[0]!.width - character.size - bridge.thickness;
  character.posY = CANVAS_H - PLATFORM_H - character.size;

  bridge.length = 0;
  bridge.angle = -Math.PI / 2;
  bridge.posX = platformList[0]!.posCanvasX + platformList[0]!.width - bridge.thickness;
  bridge.posY = CANVAS_H - PLATFORM_H + bridge.thickness;

  particles = [];
  floatingTexts = [];
  squash = 0;
  charRotation = 0;
  shakeTime = 0;
  landedPerfect = false;
  bridgeTooShort = false;

  gameState.value = GameStates.WAITING;
}

onMounted(() => {
  if (gameCanvas.value) {
    // In der echten Pixeldichte rendern, damit die Figur auf Handys/Retina-Displays scharf bleibt.
    // Die Spiellogik rechnet weiterhin in 800x450, das Skalieren übernimmt die Transformation.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    gameCanvas.value.width = CANVAS_W * dpr;
    gameCanvas.value.height = CANVAS_H * dpr;

    ctx = gameCanvas.value.getContext('2d');
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    initGame();
    draw();
    animationFrameId = requestAnimationFrame(loop);
  }
});

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
});

</script>
