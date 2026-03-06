<template>
  <div class="relative mt-4 w-full max-w-2xl mx-auto aspect-video bg-[#faf8f5] rounded-xl overflow-hidden shadow-xl border border-gray-200">
    
    <div class="absolute top-4 right-6 text-3xl font-bold text-gray-800 font-mono z-10">
      {{ score }}
    </div>

    <div v-if="gameState === 'GAMEOVER'" class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-20 transition-opacity">
      <h2 class="text-4xl font-bold text-white mb-4">Game Over</h2>
      <button 
        @click="" 
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


// --- SPIEL VARIABLEN ---
const CANVAS_W = 800;
const CANVAS_H = 450;
const PLATFORM_H = 120; // Höhe der Plattformen vom unteren Rand
const PLATFORM_W = 100; // Breite der Plattform
const POS_PLATFORM = 50;

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
    style: '#e74c3c'
};

function draw() {
    if(ctx && platformList.length > 0) {
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = '#2c3e50';
        platformList.forEach((platform) => {
            // Wir iterieren durch alle 5 Plattformen und zeichnen sie an ihrer jeweiligen X-Position
            ctx!.fillRect(platform.posCanvasX, CANVAS_H - PLATFORM_H, platform.width, PLATFORM_H);
        });
        if (bridge.length > 0) {
            ctx.save(); 
            
            ctx.translate(bridge.posX, bridge.posY); 
            
            ctx.rotate(bridge.angle); 
            
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(0, -bridge.thickness, bridge.length, bridge.thickness); 
            
            ctx.restore();
        }
        ctx.fillStyle = character.style;
        const currentPlatform = platformList[0]!;
        ctx.fillRect(character.posX, character.posY, character.size, character.size);
    }
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

function loop() {
  update();
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

function update() {
  if (gameState.value === GameStates.GROWING) {
    bridge.length += 4;
  }
  if (gameState.value === GameStates.FALLING) {
    bridge.angle += 0.05;
    if (bridge.angle >= 0) {
      bridge.angle = 0;
      gameState.value = GameStates.WALKING;
    }
  }
  if (gameState.value === GameStates.WALKING) {
    const walkSpeed = 5;
    
    platformList.forEach(p => p.posCanvasX -= walkSpeed);
    bridge.posX -= walkSpeed;
    
    walkedDistance += walkSpeed;

    // Hat die Spitze der Brücke den Charakter erreicht?
    if (walkedDistance >= bridge.length) {
      const targetPlatform = platformList[1]!;
      const charCenter = character.posX + character.size / 2;
      console.log(character.posX)
      // Steht der Charakter über der Zielplattform?
      if (charCenter >= targetPlatform.posCanvasX && charCenter <= targetPlatform.posCanvasX + targetPlatform.width) {
        score.value++;
        gameState.value = GameStates.PANNING; // Jetzt Kamera final ausrichten
      } else {
        gameState.value = GameStates.GAMEOVER;
      }
    }
  }
  
  if (gameState.value === GameStates.PANNING) {
    const panSpeed = 4;
    
    // Alles rutscht weiter nach links, bis die neue Plattform bei X=50 ankommt
    if (platformList[1]!.posCanvasX > POS_PLATFORM) {
      platformList.forEach(p => p.posCanvasX -= panSpeed);
      bridge.posX -= panSpeed;
      character.posX -= panSpeed; // JETZT rutscht der Charakter physisch mit!
    } else {
      // ZIEL ERREICHT! Reset für die nächste Runde:
      
      // A. Alte Plattform wegwerfen, neue hinten anfügen
      platformList.shift(); 
      platformList.push(generatePlatform(platformList[platformList.length - 1]!));
      
      // B. Um Pixelfehler zu vermeiden, richten wir die Plattform exakt auf X=50 aus
      const offset = POS_PLATFORM - platformList[0]!.posCanvasX;
      platformList.forEach(p => p.posCanvasX += offset);
      
      // C. Charakter und Brücke an die Kante der neuen Plattform setzen
      character.posX = platformList[0]!.posCanvasX + platformList[0]!.width - character.size - bridge.thickness;
      
      bridge.length = 0;
      bridge.angle = -Math.PI / 2;
      bridge.posX = platformList[0]!.posCanvasX + platformList[0]!.width - bridge.thickness;
      
      // Bereit für den nächsten Klick!
      gameState.value = GameStates.WAITING;
    }
  }

  // 5. Game Over (Charakter fällt)
  if (gameState.value === GameStates.GAMEOVER) {
    character.posY += 8;
  }
}

function initGame() {
    generateInitialPlatorms();
    character.posX = platformList[0]!.posCanvasX + platformList[0]!.width/2;
    bridge = {
        posX: platformList[0]!.posCanvasX + platformList[0]!.width - bridge.thickness,
        posY: CANVAS_H - PLATFORM_H + bridge.thickness,
        length: 0,
        angle: -Math.PI / 2,
        thickness: 6
    };
}

onMounted(() => {
  if (gameCanvas.value) {
    ctx = gameCanvas.value.getContext('2d');
    initGame();
    draw();
    loop();
    //initGame();
    //loop();
  }
});

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
});

</script>