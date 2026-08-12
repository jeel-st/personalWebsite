<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const activeIndex = ref(0);
const hoveredIndex = ref<number | null>(null);
const count = projects.length;

const activeProject = computed(() => projects[activeIndex.value]!);

function next() {
  activeIndex.value = (activeIndex.value + 1) % count;
}

function prev() {
  activeIndex.value = (activeIndex.value - 1 + count) % count;
}

function goTo(index: number) {
  activeIndex.value = index;
}

// Kürzeste Distanz einer Karte zur aktiven Mitte, im Kreis gedacht
// (Karte 4 ist also "einen Schritt links" von Karte 1, nicht drei Schritte rechts).
function circularOffset(index: number) {
  let diff = index - activeIndex.value;
  if (diff > count / 2) diff -= count;
  if (diff < -count / 2) diff += count;
  return diff;
}

function cardStyle(index: number) {
  const offset = circularOffset(index);
  const distance = Math.abs(offset);

  if (distance > 1) {
    return {
      transform: `translateX(${offset * 60}%) scale(0.4)`,
      opacity: '0',
      zIndex: '0',
      pointerEvents: 'none' as const,
    };
  }

  const isActive = distance === 0;
  const isHovered = hoveredIndex.value === index;
  const scale = isActive ? (isHovered ? 1.04 : 1) : 0.74;

  return {
    transform: `translateX(${offset * 68}%) rotate(${offset * -7}deg) scale(${scale})`,
    opacity: isActive ? '1' : '0.45',
    zIndex: isActive ? '20' : '10',
  };
}

function cardClass(index: number) {
  return circularOffset(index) === 0
    ? 'shadow-[0_15px_35px_-15px_var(--color-accent)] ring-1 ring-white/10'
    : 'shadow-xl';
}

// Swipe-Steuerung
let touchStartX = 0;

function onTouchStart(event: TouchEvent) {
  touchStartX = event.touches[0]!.clientX;
}

function onTouchEnd(event: TouchEvent) {
  const delta = event.changedTouches[0]!.clientX - touchStartX;
  if (Math.abs(delta) < 40) return;
  if (delta > 0) prev();
  else next();
}

// Pfeiltasten-Steuerung
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') prev();
  if (event.key === 'ArrowRight') next();
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
  <section class="relative w-full max-w-6xl mx-auto mt-24 md:mt-32 px-4">
    <!-- Weicher Farbschein im Hintergrund, folgt automatisch der Akzentfarbe des Themes -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
      <div
        class="w-64 h-64 md:w-[34rem] md:h-[34rem] rounded-full blur-3xl opacity-15"
        style="background: var(--color-accent)"
      />
    </div>

    <div class="text-center mb-14 md:mb-20">
      <p class="text-xs md:text-sm font-semibold tracking-[0.3em] text-secondary uppercase mb-3">
        Ausgewählte Arbeiten
      </p>
      <h2 class="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-bodyText">
        PROJEKTE
      </h2>
    </div>

    <div
      class="relative h-72 sm:h-80 md:h-[23rem] lg:h-[25rem] flex items-center justify-center select-none touch-pan-y"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >
      <button
        class="absolute left-2 md:left-6 z-30 flex items-center justify-center size-12 md:size-14 rounded-full bg-surface/70 backdrop-blur-md border border-secondary/20 shadow-lg hover:scale-110 hover:border-secondary/50 transition-all duration-300"
        aria-label="Vorheriges Projekt"
        @click="prev"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-bodyText">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <div
        v-for="(project, index) in projects"
        :key="project.id"
        data-cursor="view"
        class="group absolute w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[24rem] lg:h-[24rem] rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        :class="cardClass(index)"
        :style="cardStyle(index)"
        @click="goTo(index)"
        @mouseenter="hoveredIndex = index"
        @mouseleave="hoveredIndex = null"
      >
        <img :src="project.image" :alt="project.title" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent" />
        <div class="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <p class="text-white font-bold text-lg md:text-2xl tracking-wide drop-shadow">
            {{ project.title }}
          </p>
        </div>
      </div>

      <button
        class="absolute right-2 md:right-6 z-30 flex items-center justify-center size-12 md:size-14 rounded-full bg-surface/70 backdrop-blur-md border border-secondary/20 shadow-lg hover:scale-110 hover:border-secondary/50 transition-all duration-300"
        aria-label="Nächstes Projekt"
        @click="next"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-bodyText">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>

    <div class="flex items-center justify-center gap-4 mt-10">
      <span class="font-mono text-sm text-mutedText tabular-nums">
        {{ String(activeIndex + 1).padStart(2, '0') }} / {{ String(count).padStart(2, '0') }}
      </span>
      <div class="flex">
        <button
          v-for="(project, index) in projects"
          :key="project.id"
          class="flex items-center justify-center size-9 rounded-full transition-colors duration-200 hover:bg-surface"
          :aria-label="`Zu ${project.title}`"
          @click="goTo(index)"
        >
          <span
            class="block h-1.5 rounded-full transition-all duration-300"
            :class="index === activeIndex ? 'w-8 bg-secondary' : 'w-1.5 bg-mutedText'"
          />
        </button>
      </div>
    </div>

    <p class="sr-only">Aktuell ausgewählt: {{ activeProject.title }}</p>
  </section>
</template>
