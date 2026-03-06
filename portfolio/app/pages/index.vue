<template>
    <div class="flex flex-col justify-center items-center px-4 mt-16">
        <div class="md:mt-3">
            <h1 class="text-6xl md:text-7xl lg:text-9xl font-bold mb-2 text-center">JOEL STARKOV</h1>
        </div>
        <div class="-mt-5">
            <NewGameStickHero />
        </div>
        <div>
            <h1 class="text-6xl md:text-7xl lg:text-9xl font-bold mb-4 text-center text-secondaryLight dark:text-secondaryDark">COMPUTER SCIENCE STUDENT</h1>

        </div>
        <div class="mt-4">
            <p>Currently working at: Mercedes-Benz AG</p>
        </div>
    </div>
</template>
<script setup>
import ProjectGrid from '~/components/projects/ProjectGrid.vue';

</script>