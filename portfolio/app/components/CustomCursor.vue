<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const x = ref(0);
const y = ref(0);
const isVisible = ref(false);
const mode = ref<'default' | 'hover' | 'view'>('default');

// Elemente, bei denen der Cursor generisch "wächst" (ohne Text)
const HOVER_SELECTOR = 'a, button, [role="button"], input, select, textarea, canvas';
// Elemente, bei denen der Cursor zum "Ansehen"-Ring wird
const VIEW_SELECTOR = '[data-cursor="view"]';

function onMouseMove(event: MouseEvent) {
  x.value = event.clientX;
  y.value = event.clientY;
  if (!isVisible.value) isVisible.value = true;
}

function modeFor(target: EventTarget | null): 'default' | 'hover' | 'view' {
  const el = target as HTMLElement | null;
  if (el?.closest(VIEW_SELECTOR)) return 'view';
  if (el?.closest(HOVER_SELECTOR)) return 'hover';
  return 'default';
}

function onMouseOver(event: MouseEvent) {
  mode.value = modeFor(event.target);
}

function onMouseOut(event: MouseEvent) {
  mode.value = modeFor(event.relatedTarget);
}

function onWindowLeave() {
  isVisible.value = false;
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseover', onMouseOver);
  document.addEventListener('mouseout', onMouseOut);
  document.addEventListener('mouseleave', onWindowLeave);
});

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseover', onMouseOver);
  document.removeEventListener('mouseout', onMouseOut);
  document.removeEventListener('mouseleave', onWindowLeave);
});
</script>

<template>
  <div
    class="custom-cursor fixed top-0 left-0 z-[100] pointer-events-none"
    :class="isVisible ? 'opacity-100' : 'opacity-0'"
    :style="{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%)` }"
  >
    <div
      class="flex items-center justify-center rounded-full bg-secondary transition-all duration-300 ease-out"
      :class="mode === 'view' ? 'w-20 h-20' : mode === 'hover' ? 'w-10 h-10' : 'w-3 h-3'"
    >
      <span
        class="text-[11px] font-bold uppercase tracking-wide text-white transition-opacity duration-200 whitespace-nowrap"
        :class="mode === 'view' ? 'opacity-100' : 'opacity-0'"
      >
        Ansehen
      </span>
    </div>
  </div>
</template>

<style scoped>
/* Standardmäßig ausgeblendet - nur auf Geräten mit echter Maus aktivieren */
.custom-cursor {
  display: none;
}

@media (hover: hover) and (pointer: fine) {
  .custom-cursor {
    display: block;
    transition: transform 120ms linear, opacity 200ms ease;
  }

  :global(html),
  :global(html *) {
    cursor: none !important;
  }
}
</style>
