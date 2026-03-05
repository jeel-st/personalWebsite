<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>  
  </div>
</template>
<script setup>
useHead({
  bodyAttrs: {
    class: 'font-sans bg-primaryLight text-gray-800 dark:bg-primaryDark dark:text-gray-100 transition-colors duration-300'
  }
})
</script>