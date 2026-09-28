<template>
  <div class="max-w-6xl mx-auto px-4 py-12 md:py-20">
    <div class="text-center mb-14 md:mb-20">
      <p class="text-xs md:text-sm font-semibold tracking-[0.3em] text-secondary uppercase mb-3">
        All works
      </p>
      <h1 class="font-serif text-5xl md:text-7xl font-bold text-bodyText">
        PROJECTS
      </h1>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      <div
        v-for="project in projects"
        :key="project.id"
        data-cursor
        class="group relative aspect-square rounded-3xl overflow-hidden shadow-xl cursor-pointer transition-transform duration-500 hover:-translate-y-2"
      >
        <img :src="project.image" :alt="project.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent" />
        <div class="absolute bottom-0 left-0 right-0 p-5">
          <p class="text-white font-bold text-xl tracking-wide drop-shadow">
            {{ project.title }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Projekte — Joel Starkov',
  description: 'Eine Übersicht aller Projekte von Joel Starkov.',
});
</script>
