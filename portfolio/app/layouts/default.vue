<template>
  <!-- overflow-x-clip: Elemente, die seitlich überstehen (z. B. die Karussell-Karten), werden am
       Bildschirmrand abgeschnitten, statt die Seite zu verbreitern. Sonst zoomen Mobile-Browser die
       ganze Seite heraus, besonders beim Drehen. "clip" statt "hidden", damit die sticky Navbar funktioniert. -->
  <div class="overflow-x-clip">
    <CustomCursor />
    <ProjectsProjectModal />

    <LayoutNavbar />

    <header>
      <Info />
    </header>

    <main class="p-8">
      <NuxtPage />
    </main>

    <footer class="p-8 text-sm text-mutedText flex flex-col justify-center items-center">
      <ButtonsThemeSwitcher />
      <p>© 2026 Joel Jeremy Starkov. All rights reserved.</p>
    </footer>

  </div>
</template>
<script setup>
import Info from '~/components/header/Info.vue';


</script>