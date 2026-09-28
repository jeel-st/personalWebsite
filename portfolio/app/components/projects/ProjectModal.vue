<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import type { Project } from '~/utils/projects';

const { currentProject, close } = useProjectModal();

// Hält das zuletzt gezeigte Projekt fest, damit der Inhalt beim Ausblenden nicht schlagartig verschwindet
const shown = ref<Project | null>(currentProject.value);
const closeButton = ref<HTMLButtonElement | null>(null);

watch(currentProject, async (project) => {
  if (project) shown.value = project;
  document.body.style.overflow = project ? 'hidden' : '';
  if (project) {
    await nextTick();
    closeButton.value?.focus({ preventScroll: true });
  }
});

function paragraphs(text: string) {
  return text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && currentProject.value) close();
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
  // Direkter Link auf ein Projekt: Fenster ist schon beim Laden offen
  if (currentProject.value) document.body.style.overflow = 'hidden';
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
  document.body.style.overflow = '';
});
</script>

<template>
  <!-- "#teleports" statt "body": Nuxt stellt dieses Ziel auch beim Server-Rendering bereit,
       dadurch funktioniert auch ein direkter Link auf ein Projekt (?project=...) -->
  <Teleport to="#teleports">
    <Transition name="modal" :duration="450">
      <div
        v-if="currentProject"
        class="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`project-title-${shown?.slug}`"
      >
        <div class="modal-backdrop absolute inset-0 bg-black/60 backdrop-blur-sm" @click="close" />

        <div
          v-if="shown"
          class="modal-panel relative w-full md:max-w-2xl max-h-[92dvh] md:max-h-[85dvh] overflow-y-auto bg-primary text-bodyText rounded-t-3xl md:rounded-3xl shadow-2xl"
        >
          <div class="relative">
            <img :src="shown.image" :alt="shown.title" class="w-full aspect-video object-cover">
            <button
              ref="closeButton"
              class="absolute top-4 right-4 flex items-center justify-center size-11 rounded-full bg-surface/70 backdrop-blur-md border border-secondary/20 shadow-lg hover:scale-110 transition-transform duration-300"
              aria-label="Close"
              @click="close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-bodyText">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 md:p-8">
            <div class="flex flex-wrap items-center gap-2 mb-4">
              <span v-if="shown.year" class="font-mono text-sm text-mutedText mr-2">{{ shown.year }}</span>
              <span
                v-for="tag in shown.tags"
                :key="tag"
                class="px-3 py-1 rounded-full bg-surface text-bodyText text-xs font-semibold uppercase tracking-wide"
              >
                {{ tag }}
              </span>
            </div>

            <h2 :id="`project-title-${shown.slug}`" class="font-serif text-4xl md:text-5xl font-bold mb-3">
              {{ shown.title }}
            </h2>
            <p class="text-mutedText text-lg mb-6">{{ shown.summary }}</p>

            <div class="space-y-4 leading-relaxed">
              <p v-for="(paragraph, i) in paragraphs(shown.description)" :key="i">{{ paragraph }}</p>
            </div>

            <div v-if="shown.github || shown.demo" class="flex flex-wrap gap-3 mt-8">
              <a
                v-if="shown.demo"
                :href="shown.demo"
                target="_blank"
                rel="noopener noreferrer"
                class="px-6 py-3 rounded-full bg-secondary text-white font-bold tracking-wide shadow-lg hover:scale-105 transition-transform duration-300"
              >
                Live Demo ↗
              </a>
              <a
                v-if="shown.github"
                :href="shown.github"
                target="_blank"
                rel="noopener noreferrer"
                class="px-6 py-3 rounded-full bg-surface text-bodyText font-bold tracking-wide hover:scale-105 transition-transform duration-300"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop,
.modal-panel {
  transition: opacity 300ms ease, transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
}

.modal-enter-from .modal-backdrop,
.modal-leave-to .modal-backdrop {
  opacity: 0;
}

/* Handy: Fenster gleitet von unten herein. Desktop: leichtes Hochgleiten + Zoomen */
.modal-enter-from .modal-panel,
.modal-leave-to .modal-panel {
  opacity: 0;
  transform: translateY(40px) scale(0.97);
}

@media (max-width: 767px) {
  .modal-enter-from .modal-panel,
  .modal-leave-to .modal-panel {
    opacity: 1;
    transform: translateY(100%);
  }
}
</style>
