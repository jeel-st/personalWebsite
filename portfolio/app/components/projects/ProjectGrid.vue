<template>
  <div class="flex justify-center items-center -space-x-10 md:-space-x-30 p-10 w-full max-w-5xl mx-auto mt-10">

    <div 
      v-for="project in projects" 
      :key="project.id"
      :class="[
        'relative w-28 h-28 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-2xl cursor-pointer',,
        'transition-all duration-500 ease-out',
        project.rotation, 
        'hover:z-50 hover:-translate-y-8 hover:scale-110 hover:rotate-0' // Beim Hovern: Gerade rücken (rotate-0) und nach oben springen
      ]"
    >
      
      <img 
        :src="project.image" 
        :alt="project.title"
        class="w-full h-full object-cover"
      />

      <div class="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <h3 class="text-white text-sm md:text-2xl font-bold text-center px-2 font-oswald">
          {{ project.title }}
        </h3>
      </div>

    </div>

  </div>
</template>
<script setup lang="ts">
const projects = [
  { id: 1, title: 'Projekt 1', image: '/bild1.jpg', rotation: '-rotate-3' }, 
  { id: 2, title: 'Projekt 2', image: '/bild2.png', rotation: 'rotate-6' },
  { id: 3, title: 'Projekt 3', image: '/bild3.jpg', rotation: '-rotate-12' },
  { id: 4, title: 'Projekt 4', image: '/bild4.png', rotation: 'rotate-6' },
]
</script>