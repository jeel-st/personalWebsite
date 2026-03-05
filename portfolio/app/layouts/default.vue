<template>
  <div>
    
    <header>
      <Info />
    </header>

    <main class="p-8">
      <NuxtPage />
    </main>

    <footer class="p-8 text-sm text-gray-500 dark:text-gray-400 flex flex-col justify-center items-center">
      <ButtonsToggleButton />
      <p>© 2026 Joel Jeremy Starkov. All rights reserved.</p>
    </footer>

  </div>
</template>
<script setup>
import Info from '~/components/header/Info.vue';


</script>