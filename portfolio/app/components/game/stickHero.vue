<template>
  <div class="relative mt-4 w-full max-w-xl mx-auto aspect-video bg-[#faf8f5] dark:bg-[#ffd166] rounded-xl overflow-hidden shadow-xl border border-gray-200">
    
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
      @mousedown="startGrowing"
      @touchstart.prevent="startGrowing"
      @mouseup="stopGrowing"
      @touchend.prevent="stopGrowing"
    ></canvas>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// --- VUE REFS FÜR UI ---
const gameCanvas = ref(null);
const score = ref(0);
const gameState = ref('WAITING'); // States: WAITING, GROWING, FALLING, WALKING, GAMEOVER

// --- SPIEL VARIABLEN ---
let ctx = null;
let animationFrameId = null;

const CANVAS_W = 800;
const CANVAS_H = 450;
const PLATFORM_H = 120; // Höhe der Plattformen vom unteren Rand

// Spielobjekte
let platforms = [];
let hero = { x: 0, y: 0, size: 24, color: '#e74c3c' };
let stick = { x: 0, y: 0, length: 0, angle: 0 };

// --- LOGIK & SETUP ---
function initGame() {
  score.value = 0;
  platforms = [
    { x: 50, w: 100 }, // Startplattform
    generatePlatform(200) // Erste Zielplattform
  ];
  resetHeroAndStick();
  gameState.value = 'WAITING';
}

function resetGame() {
  initGame();
}

function generatePlatform(minX) {
  const minWidth = 40;
  const maxWidth = 120;
  const gapMin = 50;
  const gapMax = 300;
  
  const w = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
  const gap = Math.floor(Math.random() * (gapMax - gapMin + 1)) + gapMin;
  
  return { x: minX + gap, w: w };
}

function resetHeroAndStick() {
  const p1 = platforms[0];
  hero.x = p1.x + p1.w - hero.size - 10;
  hero.y = CANVAS_H - PLATFORM_H - hero.size;
  
  stick.x = p1.x + p1.w;
  stick.y = CANVAS_H - PLATFORM_H;
  stick.length = 0;
  stick.angle = -Math.PI / 2;
}

// --- STEUERUNG ---
function startGrowing() {
  if (gameState.value === 'WAITING') {
    gameState.value = 'GROWING';
  }
}

function stopGrowing() {
  if (gameState.value === 'GROWING') {
    gameState.value = 'FALLING';
  }
}

// --- GAME LOOP ---
function update() {
  // 1. Brücke wächst
  if (gameState.value === 'GROWING') {
    stick.length += 5; // Wachstumsgeschwindigkeit
  }
  
  // 2. Brücke fällt um
  if (gameState.value === 'FALLING') {
    stick.angle += 0.05; // Fallgeschwindigkeit
    if (stick.angle >= 0) { // 90 Grad erreicht
      stick.angle = 0;
      gameState.value = 'WALKING';
    }
  }

  // 3. Figur läuft über die Brücke
  if (gameState.value === 'WALKING') {
    hero.x += 4; // Laufgeschwindigkeit
    const targetX = stick.x + stick.length;
    
    // Wenn die Figur das Ende des Stocks erreicht hat
    if (hero.x + hero.size >= targetX) {
      checkSuccess();
    }
  }

  // 4. Game Over Animation (Figur fällt)
  if (gameState.value === 'GAMEOVER') {
    hero.y += 8; // Fallgeschwindigkeit in den Abgrund
  }
}

function checkSuccess() {
  const p2 = platforms[1];
  const stickEnd = stick.x + stick.length;
  
  // Prüfen, ob das Ende des Stocks innerhalb der Zielplattform liegt
  if (stickEnd >= p2.x && stickEnd <= p2.x + p2.w) {
    // Erfolgreich!
    score.value++;
    
    // Level verschieben (vereinfachter "Kameraschwenk")
    platforms.shift(); // Alte Startplattform löschen
    platforms[0].x = 50; // Zielplattform wird neue Startplattform
    platforms.push(generatePlatform(platforms[0].x + platforms[0].w)); // Neue Zielplattform
    
    resetHeroAndStick();
    gameState.value = 'WAITING';
  } else {
    // Daneben!
    gameState.value = 'GAMEOVER';
  }
}

// --- RENDER (ZEICHNEN) ---
function draw() {
  // Hintergrund löschen
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  // Plattformen zeichnen
  ctx.fillStyle = '#2c3e50'; // Dunkelblau/Grau für Plattformen
  platforms.forEach(p => {
    ctx.fillRect(p.x, CANVAS_H - PLATFORM_H, p.w, PLATFORM_H);
  });

  // Brücke (Stock) zeichnen
  ctx.save();
  ctx.translate(stick.x, stick.y);
  ctx.rotate(stick.angle);
  ctx.fillStyle = '#34495e';
  ctx.fillRect(0, -4, stick.length, 4); // Stock ist 4px dick
  ctx.restore();

  // Figur zeichnen (aktuell ein rotes Quadrat)
  ctx.fillStyle = hero.color;
  ctx.fillRect(hero.x, hero.y, hero.size, hero.size);
}

// Die Hauptschleife
function loop() {
  update();
  draw();
  animationFrameId = requestAnimationFrame(loop);
}

// --- LIFECYCLE HOOKS ---
onMounted(() => {
  if (gameCanvas.value) {
    ctx = gameCanvas.value.getContext('2d');
    initGame();
    loop();
  }
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId); // Verhindert Memory Leaks, wenn die Seite gewechselt wird
});
</script>