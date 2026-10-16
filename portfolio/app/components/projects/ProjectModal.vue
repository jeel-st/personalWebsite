<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import type { Project } from '~/utils/projects';

const { currentProject, close } = useProjectModal();

// Hält das zuletzt gezeigte Projekt fest, damit der Inhalt beim Ausblenden nicht schlagartig verschwindet
const shown = ref<Project | null>(currentProject.value);
const closeButton = ref<HTMLButtonElement | null>(null);

// --- Vollbild-Ansicht für Bilder im Projekttext ---
interface LightboxImage {
  src: string;
  alt: string;
}
const lightboxImages = ref<LightboxImage[]>([]);
const lightboxIndex = ref<number | null>(null);
const lightboxImage = computed(() => (lightboxIndex.value === null ? null : lightboxImages.value[lightboxIndex.value] ?? null));

// Klick auf ein Bild im Text: Bilder derselben Galerie werden zusammen durchblätterbar, ein einzelnes Bild allein
function onContentClick(event: MouseEvent) {
  const img = (event.target as HTMLElement).closest('img');
  if (!img) return;
  const group = img.closest('.gallery') ?? img;
  const imgs = group === img ? [img] : [...group.querySelectorAll('img')];
  lightboxImages.value = imgs.map(i => ({ src: i.getAttribute('src') ?? '', alt: i.getAttribute('alt') ?? '' }));
  lightboxIndex.value = imgs.indexOf(img);
}

function closeLightbox() {
  lightboxIndex.value = null;
}

function stepLightbox(direction: 1 | -1) {
  if (lightboxIndex.value === null) return;
  const count = lightboxImages.value.length;
  lightboxIndex.value = (lightboxIndex.value + direction + count) % count;
}

let touchStartX = 0;
function onLightboxTouchStart(event: TouchEvent) {
  touchStartX = event.touches[0]!.clientX;
}
function onLightboxTouchEnd(event: TouchEvent) {
  const delta = event.changedTouches[0]!.clientX - touchStartX;
  if (Math.abs(delta) > 40 && lightboxImages.value.length > 1) stepLightbox(delta > 0 ? -1 : 1);
}

watch(currentProject, async (project) => {
  if (project) shown.value = project;
  closeLightbox();
  document.body.style.overflow = project ? 'hidden' : '';
  if (project) {
    await nextTick();
    closeButton.value?.focus({ preventScroll: true });
  }
});

function onKeydown(event: KeyboardEvent) {
  // Ist die Vollbild-Ansicht offen, gehören die Tasten ihr (Escape schließt dann nur das Bild, nicht das Projekt)
  if (lightboxImage.value) {
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') stepLightbox(-1);
    if (event.key === 'ArrowRight') stepLightbox(1);
    return;
  }
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

            <!-- HTML wird beim Bauen aus deinen eigenen Markdown-Dateien erzeugt (keine Besucher-Eingaben),
                 daher ist v-html hier unbedenklich -->
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="project-content" @click="onContentClick" v-html="shown.html" />

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

        <!-- Vollbild-Ansicht eines Bildes aus dem Projekttext -->
        <Transition name="lightbox">
          <div
            v-if="lightboxImage"
            class="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/90 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Bildansicht"
            @click.self="closeLightbox"
            @touchstart.passive="onLightboxTouchStart"
            @touchend="onLightboxTouchEnd"
          >
            <img
              :key="lightboxImage.src"
              :src="lightboxImage.src"
              :alt="lightboxImage.alt"
              class="max-w-full max-h-[80dvh] object-contain rounded-xl shadow-2xl"
            >
            <p class="mt-4 text-sm text-white/80 text-center">
              <span v-if="lightboxImage.alt">{{ lightboxImage.alt }}</span>
              <span v-if="lightboxImages.length > 1" class="font-mono ml-3 text-white/50">
                {{ lightboxIndex! + 1 }} / {{ lightboxImages.length }}
              </span>
            </p>

            <button
              class="absolute top-4 right-4 flex items-center justify-center size-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Bild schließen"
              @click="closeLightbox"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <template v-if="lightboxImages.length > 1">
              <button
                class="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 flex items-center justify-center size-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Vorheriges Bild"
                @click="stepLightbox(-1)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                class="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 flex items-center justify-center size-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Nächstes Bild"
                @click="stepLightbox(1)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </template>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* --- Formatierung des Markdown-Inhalts (passt sich über die CSS-Variablen jedem Theme an) --- */
.project-content {
  line-height: 1.7;
}

.project-content :deep(> * + *) {
  margin-top: 1rem;
}

.project-content :deep(h2) {
  font-family: 'Bebas Neue', serif;
  font-size: 2rem;
  line-height: 1.1;
  margin-top: 2rem;
}

.project-content :deep(h3) {
  font-weight: 700;
  font-size: 1.25rem;
  margin-top: 1.5rem;
}

.project-content :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
}

.project-content :deep(ol) {
  list-style: decimal;
  padding-left: 1.5rem;
}

.project-content :deep(li + li) {
  margin-top: 0.35rem;
}

.project-content :deep(li::marker) {
  color: var(--color-accent);
}

.project-content :deep(a) {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.project-content :deep(strong) {
  font-weight: 700;
}

.project-content :deep(code) {
  font-family: ui-monospace, monospace;
  font-size: 0.9em;
  padding: 0.1em 0.4em;
  border-radius: 0.375rem;
  background: var(--color-surface);
}

/* Code-Blöcke: lange Zeilen scrollen innerhalb des Blocks, statt das Fenster zu sprengen */
.project-content :deep(pre) {
  overflow-x: auto;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  background: var(--color-surface);
  font-size: 0.85rem;
  line-height: 1.6;
}

.project-content :deep(pre code) {
  padding: 0;
  background: none;
  font-size: inherit;
}

.project-content :deep(blockquote) {
  border-left: 3px solid var(--color-accent);
  padding-left: 1rem;
  color: var(--color-text-muted);
  font-style: italic;
}

.project-content :deep(hr) {
  border-color: var(--color-surface);
  margin: 2rem 0;
}

.project-content :deep(img),
.project-content :deep(video),
.project-content :deep(iframe) {
  display: block;
  width: 100%;
  border-radius: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.project-content :deep(iframe) {
  aspect-ratio: 16 / 9;
  height: auto;
  border: 0;
}

.project-content :deep(img) {
  cursor: zoom-in;
}

/* Galerie (::: gallery): kompaktes Raster aus quadratischen Vorschaubildern,
   2 Spalten auf dem Handy, 3 im Fenster auf dem Desktop */
.project-content :deep(.gallery) {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.project-content :deep(.gallery p) {
  display: contents;
}

.project-content :deep(.gallery img) {
  aspect-ratio: 1 / 1;
  object-fit: cover;
  margin: 0;
  border-radius: 0.75rem;
  transition: transform 300ms ease, filter 300ms ease;
}

.project-content :deep(.gallery img:hover) {
  transform: scale(1.03);
  filter: brightness(1.08);
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 250ms ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

/* --- Ein- und Ausblenden --- */
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
