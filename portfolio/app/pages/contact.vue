<template>
  <div class="max-w-2xl mx-auto px-4 py-20 md:py-32 text-center">
    <p class="text-xs md:text-sm font-semibold tracking-[0.3em] text-secondary uppercase mb-3">
      Get in touch
    </p>
    <h1 class="font-serif text-5xl md:text-7xl font-bold text-bodyText mb-6">
      KONTAKT
    </h1>
    <p class="text-mutedText text-base md:text-lg mb-10">
      Am schnellsten erreichst du mich per Mail — ich melde mich zeitnah zurück.
    </p>

    <a
      href="mailto:joel.starkov@gmail.com"
      class="inline-block px-8 py-4 rounded-full bg-secondary text-white font-bold text-lg tracking-wide shadow-lg hover:scale-105 transition-transform duration-300"
    >
      joel.starkov@gmail.com
    </a>

    <div class="flex items-center justify-center gap-6 mt-12">
      <!-- TODO: echte Profil-Links eintragen -->
      <a
        href="#"
        class="text-mutedText hover:text-bodyText font-semibold uppercase tracking-wide text-sm transition-colors"
      >
        GitHub
      </a>
      <span class="text-mutedText">·</span>
      <a
        href="#"
        class="text-mutedText hover:text-bodyText font-semibold uppercase tracking-wide text-sm transition-colors"
      >
        LinkedIn
      </a>
    </div>

    <p class="text-mutedText text-sm mt-12">Stuttgart (GER)</p>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Kontakt — Joel Starkov',
  description: 'Kontaktiere Joel Starkov per Mail oder Social Media.',
});
</script>
