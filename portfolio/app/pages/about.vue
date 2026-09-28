<template>
  <div class="max-w-3xl mx-auto px-4 py-12 md:py-20">
    <div class="text-center mb-14 md:mb-20">
      <p class="text-xs md:text-sm font-semibold tracking-[0.3em] text-secondary uppercase mb-3">
        Über mich
      </p>
      <h1 class="font-serif text-5xl md:text-7xl font-bold text-bodyText">
        ABOUT
      </h1>
    </div>

    <!-- TODO: echten Bio-Text eintragen -->
    <p class="text-bodyText text-base md:text-lg leading-relaxed mb-16">
      Ich bin Joel, Computer-Science-Student aus Stuttgart. Mich interessiert vor allem [hier kurz
      beschreiben, was dich antreibt — z. B. Webentwicklung, Machine Learning, o. Ä.]. Wenn ich nicht gerade
      code, [hier ein, zwei persönliche Sätze ergänzen].
    </p>

    <section class="mb-16">
      <h2 class="text-xs font-semibold tracking-[0.3em] text-secondary uppercase mb-5">
        Skills
      </h2>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="skill in skills"
          :key="skill"
          class="px-4 py-2 rounded-full bg-surface text-bodyText text-sm font-medium"
        >
          {{ skill }}
        </span>
      </div>
    </section>

    <section>
      <h2 class="text-xs font-semibold tracking-[0.3em] text-secondary uppercase mb-8">
        Werdegang
      </h2>
      <ol class="relative border-l border-secondary/20 pl-6 space-y-8">
        <li v-for="item in timeline" :key="item.title" class="relative">
          <span class="absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full bg-secondary" />
          <p class="text-xs font-mono text-mutedText mb-1">{{ item.period }}</p>
          <p class="font-bold text-bodyText">{{ item.title }}</p>
          <p class="text-mutedText text-sm">{{ item.subtitle }}</p>
        </li>
      </ol>
    </section>
  </div>
</template>

<script setup lang="ts">
// TODO: an echten Tech-Stack anpassen
const skills = ['Vue', 'Nuxt', 'TypeScript', 'Tailwind CSS', 'Java', 'Python', 'Git'];

// TODO: mit echten Stationen (Studiengang, Uni, Jahr) füllen
const timeline = [
  { period: 'aktuell', title: 'Mercedes-Benz AG', subtitle: 'Werkstudent / Praktikum' },
  { period: '20XX – heute', title: 'Computer Science, [Hochschule]', subtitle: 'Bachelor' },
];

useSeoMeta({
  title: 'About — Joel Starkov',
  description: 'Über Joel Starkov — Computer-Science-Student aus Stuttgart.',
});
</script>
