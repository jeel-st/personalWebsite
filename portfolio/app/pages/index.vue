<template>
    <div class="flex flex-col justify-center items-center px-4 mt-8 md:mt-12 lg:mt-12 gap-y-6 md:gap-y-10 lg:gap-y-10">
      <!--  <div class="md:mt-3"> -->
      <!--      <h1 class="text-6xl md:text-6xl lg:text-8xl font-bold mb-2 text-center">JOEL STARKOV</h1>-->
      <!--  </div> --> 
        <div>
            <h1 class="text-5xl md:text-6xl lg:text-8xl font-bold mb-4 text-center text-secondaryLight dark:text-secondaryDark">COMPUTER SCIENCE STUDENT</h1> 
        </div>
        <div class="mt-5 lg:mt-1 md:mt-1">
            <NewGameStickHero />
        </div>
        
        <div class="mt-12 lg:mt-4 md:mt-4">
            <p>Currently working at: Mercedes-Benz AG</p>
        </div>
    </div>
</template>
<script setup>
import ProjectGrid from '~/components/projects/ProjectGrid.vue';

</script>