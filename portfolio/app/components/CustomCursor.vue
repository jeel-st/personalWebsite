<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const x = ref(0);
const y = ref(0);
const isVisible = ref(false);
const mode = ref<'default' | 'hover' | 'label'>('default');
// Bleibt beim Ausblenden stehen, damit der Text sauber ausfadet statt sofort zu verschwinden
const label = ref('');

// Elemente, bei denen der Cursor zum Ring wächst (ohne Text)
const HOVER_SELECTOR = 'a, button, [role="button"], input, select, textarea, canvas, [data-cursor]';

// Ein Element kann per data-cursor-label="..." selbst festlegen, welcher Text im Ring steht
function updateFor(target: Element | null) {
  const labelled = target?.closest<HTMLElement>('[data-cursor-label]');
  const text = labelled?.dataset.cursorLabel;
  if (text) {
    mode.value = 'label';
    label.value = text;
  } else if (target?.closest(HOVER_SELECTOR)) {
    mode.value = 'hover';
  } else {
    mode.value = 'default';
  }
}

function onMouseMove(event: MouseEvent) {
  x.value = event.clientX;
  y.value = event.clientY;
  if (!isVisible.value) isVisible.value = true;
  updateFor(event.target as Element | null);
}

// Nach einem Klick kann sich unter dem stillstehenden Cursor etwas ändern
// (z. B. rückt eine Karussell-Karte in die Mitte), daher neu auswerten, sobald Vue gerendert hat
function onClick() {
  requestAnimationFrame(() => updateFor(document.elementFromPoint(x.value, y.value)));
}

function onWindowLeave() {
  isVisible.value = false;
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('click', onClick);
  document.addEventListener('mouseleave', onWindowLeave);
});

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('click', onClick);
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
      :class="mode === 'label' ? 'w-20 h-20' : mode === 'hover' ? 'w-10 h-10' : 'w-3 h-3'"
    >
      <span
        class="text-[11px] font-bold uppercase tracking-wide text-white transition-opacity duration-200 whitespace-nowrap"
        :class="mode === 'label' ? 'opacity-100' : 'opacity-0'"
      >
        {{ label }}
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
