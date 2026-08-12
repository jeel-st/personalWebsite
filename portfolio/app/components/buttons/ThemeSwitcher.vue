<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const { theme, themes } = useColorTheme();
const isOpen = ref(false);
const rootEl = ref<HTMLElement | null>(null);

function toggleOpen() {
  isOpen.value = !isOpen.value;
}

function selectTheme(id: (typeof themes)[number]['id']) {
  theme.value = id;
  isOpen.value = false;
}

function handleClickOutside(event: MouseEvent) {
  if (rootEl.value && !rootEl.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));
</script>

<template>
  <div ref="rootEl" class="fixed bottom-6 right-6 z-50">
    <button
      class="flex items-center justify-center size-12 rounded-full bg-surface shadow-lg hover:scale-110 transition-all duration-300"
      aria-label="Farbschema wählen"
      :aria-expanded="isOpen"
      @click="toggleOpen"
    >
      <span
        class="block size-5 rounded-full ring-2 ring-surface"
        :style="{ backgroundColor: themes.find((t) => t.id === theme)?.swatch }"
      />
    </button>

    <div
      v-if="isOpen"
      class="absolute bottom-full right-0 mb-3 flex gap-3 p-3 rounded-2xl bg-surface shadow-lg"
    >
      <button
        v-for="t in themes"
        :key="t.id"
        class="flex items-center justify-center size-11 -m-1 rounded-full"
        :aria-label="t.label"
        :title="t.label"
        @click="selectTheme(t.id)"
      >
        <span
          class="block size-8 rounded-full transition-transform duration-200"
          :class="theme === t.id ? 'ring-2 ring-offset-2 ring-secondary ring-offset-surface scale-110' : ''"
          :style="{ backgroundColor: t.swatch }"
        />
      </button>
    </div>
  </div>
</template>
