<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>  
  </div>
</template>
<script setup>
const { theme } = useColorTheme()

useHead({
  htmlAttrs: {
    'data-theme': theme
  },
  bodyAttrs: {
    class: 'font-sans bg-primary text-bodyText transition-colors duration-500'
  }
})
</script>