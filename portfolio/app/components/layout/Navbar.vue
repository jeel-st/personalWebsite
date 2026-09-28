<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';

const route = useRoute();
const isOpen = ref(false);

const links = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to);
}

function close() {
  isOpen.value = false;
}

// Verhindert Scrollen im Hintergrund, solange das Vollbild-Menü offen ist
watch(isOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : '';
});

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});
</script>

<template>
  <nav class="sticky top-0 z-40 bg-surface/70 backdrop-blur-md border-b border-secondary/10">
    <div class="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
      <NuxtLink
        to="/"
        class="font-serif text-2xl font-bold text-bodyText tracking-tight"
        @click="close"
      >
        JS
      </NuxtLink>

      <div class="hidden md:flex items-center gap-8">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="group relative text-sm font-semibold uppercase tracking-wide transition-colors duration-200"
          :class="isActive(link.to) ? 'text-secondary' : 'text-mutedText hover:text-bodyText'"
        >
          {{ link.label }}
          <span
            class="absolute -bottom-1.5 left-0 h-px bg-secondary transition-all duration-300"
            :class="isActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full'"
          />
        </NuxtLink>
      </div>

      <button
        class="md:hidden relative z-50 flex flex-col justify-center items-center size-10 gap-1.5"
        :aria-expanded="isOpen"
        aria-label="Menü öffnen/schließen"
        @click="isOpen = !isOpen"
      >
        <span
          class="w-6 h-0.5 bg-bodyText rounded-full transition-all duration-300 origin-center"
          :class="isOpen ? 'translate-y-[8px] rotate-45' : ''"
        />
        <span
          class="w-6 h-0.5 bg-bodyText rounded-full transition-opacity duration-200"
          :class="isOpen ? 'opacity-0' : 'opacity-100'"
        />
        <span
          class="w-6 h-0.5 bg-bodyText rounded-full transition-all duration-300 origin-center"
          :class="isOpen ? '-translate-y-[8px] -rotate-45' : ''"
        />
      </button>
    </div>

  </nav>

  <!-- Per Teleport aus der Navbar raus, da deren backdrop-blur sonst einen eigenen
       Containing Block bildet und "fixed" innerhalb davon nur relativ zur Navbar-Box
       (statt zum ganzen Viewport) positionieren würde. -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="md:hidden fixed inset-0 z-30 bg-primary flex flex-col">
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden">
          <div
            class="w-72 h-72 rounded-full blur-3xl opacity-15"
            style="background: var(--color-accent)"
          />
        </div>

        <div class="h-16 shrink-0" />

        <div class="flex-1 flex flex-col justify-center px-8 gap-1">
          <NuxtLink
            v-for="(link, index) in links"
            :key="link.to"
            :to="link.to"
            class="nav-link-in group flex items-baseline gap-4 py-3 border-b border-secondary/10"
            :style="{ animationDelay: `${index * 70}ms` }"
            @click="close"
          >
            <span class="font-mono text-sm text-secondary">{{ String(index + 1).padStart(2, '0') }}</span>
            <span
              class="font-serif text-4xl font-bold tracking-tight transition-colors"
              :class="isActive(link.to) ? 'text-secondary' : 'text-bodyText group-hover:text-secondary'"
            >
              {{ link.label }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.nav-link-in {
  opacity: 0;
  animation: nav-link-in 450ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes nav-link-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
