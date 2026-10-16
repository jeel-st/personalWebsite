<template>
  <div class="relative max-w-3xl mx-auto px-4 py-16 md:py-24">
    <!-- Weicher Farbschein im Hintergrund, wie bei den anderen Abschnitten -->
    <div class="absolute inset-0 flex items-start justify-center pointer-events-none -z-10">
      <div
        class="mt-24 w-72 h-72 md:w-[30rem] md:h-[30rem] rounded-full blur-3xl opacity-15"
        style="background: var(--color-accent)"
      />
    </div>

    <div class="text-center mb-12 md:mb-16">
      <p class="text-xs md:text-sm font-semibold tracking-[0.3em] text-secondary uppercase mb-3">
        Get in touch
      </p>
      <h1 class="font-serif text-5xl md:text-7xl font-bold text-bodyText mb-5">
        KONTAKT
      </h1>
      <p class="text-mutedText text-base md:text-lg max-w-md mx-auto">
        Fragen, Projektideen oder einfach Hallo sagen? Am schnellsten erreichst du mich per Mail.
      </p>
    </div>

    <!-- E-Mail -->
    <div class="rounded-3xl bg-surface/60 backdrop-blur-md border border-secondary/10 shadow-xl p-6 md:p-10 text-center mb-4">
      <p class="text-xs font-semibold tracking-[0.25em] text-mutedText uppercase mb-3">E-Mail</p>
      <a
        :href="`mailto:${email}`"
        class="block font-serif text-[clamp(1.1rem,6.2vw,3rem)] leading-tight font-bold text-bodyText hover:text-secondary transition-colors [overflow-wrap:anywhere]"
      >
        {{ email }}
      </a>

      <div class="flex flex-wrap justify-center gap-3 mt-8">
        <a
          :href="`mailto:${email}`"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-white font-bold tracking-wide shadow-lg hover:scale-105 transition-transform duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          Mail schreiben
        </a>
        <button
          class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary border border-secondary/25 text-bodyText font-bold tracking-wide hover:scale-105 hover:border-secondary/50 transition-all duration-300"
          @click="copyEmail"
        >
          <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-secondary">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span aria-live="polite">{{ copied ? 'Kopiert!' : 'Adresse kopieren' }}</span>
        </button>
      </div>
    </div>

    <!-- Profile -->
    <div class="grid sm:grid-cols-2 gap-4">
      <a
        v-for="profile in profiles"
        :key="profile.name"
        :href="profile.url"
        target="_blank"
        rel="noopener noreferrer"
        data-cursor-label="Open"
        class="group flex items-center gap-4 rounded-3xl bg-surface/60 backdrop-blur-md border border-secondary/10 p-5 md:p-6 hover:-translate-y-1 hover:border-secondary/30 transition-all duration-300"
      >
        <span class="flex items-center justify-center size-12 shrink-0 rounded-2xl bg-primary text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path v-for="(d, i) in profile.icon" :key="i" :d="d" />
          </svg>
        </span>
        <span class="flex-1 min-w-0">
          <span class="block font-bold text-bodyText">{{ profile.name }}</span>
          <span class="block text-sm text-mutedText truncate">{{ profile.handle }}</span>
        </span>
        <span class="text-mutedText group-hover:text-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">↗</span>
      </a>
    </div>

    <p class="flex items-center justify-center gap-2 text-mutedText text-sm mt-12">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      Stuttgart, Deutschland
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = 'joel.starkov@gmail.com';

const profiles = [
  {
    name: 'LinkedIn',
    handle: 'in/joel-starkov',
    url: 'https://www.linkedin.com/in/joel-starkov/',
    icon: [
      'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z',
      'M2 9h4v12H2z',
      'M4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
    ],
  },
  {
    name: 'GitHub',
    handle: '@jeel-st',
    url: 'https://github.com/jeel-st',
    icon: [
      'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4',
      'M9 18c-4.51 2-5-2-7-2',
    ],
  },
];

const copied = ref(false);
let copiedTimer: ReturnType<typeof setTimeout> | undefined;

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(email);
  } catch {
    // Ohne Zwischenablage-Zugriff (z. B. ältere Browser): Adresse wenigstens im Mail-Programm öffnen
    window.location.href = `mailto:${email}`;
    return;
  }
  copied.value = true;
  clearTimeout(copiedTimer);
  copiedTimer = setTimeout(() => { copied.value = false; }, 2000);
}

useSeoMeta({
  title: 'Kontakt — Joel Starkov',
  description: 'Kontaktiere Joel Starkov per Mail, LinkedIn oder GitHub.',
});
</script>
