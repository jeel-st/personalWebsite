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

    <div class="space-y-4 text-bodyText text-base md:text-lg leading-relaxed mb-20">
      <p>
        Ich bin Joel, Medieninformatik-Student an der Hochschule der Medien Stuttgart und schreibe gerade meine
        Bachelorarbeit bei der Mercedes-Benz AG.
      </p>
      <p>
        Am liebsten arbeite ich im Backend, also an APIs, Datenbanken und der Architektur dahinter. Das reicht von
        einer Microservice-Plattform mit Keycloak über inkrementelle Datenbank-Backups bis zum Multiplayer-Code eines
        VR-Spiels. Daneben begeistern mich Cloud-Infrastruktur und Webentwicklung, wie diese Seite hier zeigt.
      </p>
    </div>

    <section v-for="section in sections" :key="section.title" class="mb-20">
      <h2 class="text-xs font-semibold tracking-[0.3em] text-secondary uppercase mb-8">
        {{ section.title }}
      </h2>
      <ol class="relative border-l border-secondary/40 pl-6 space-y-10">
        <li v-for="station in section.stations" :key="station.org">
          <div class="relative mb-1">
            <!-- Punkt exakt auf der Linie: 24px Einrückung (pl-6) + halbe Linienbreite, vertikal mittig zur Zeile -->
            <span class="absolute left-[-24.5px] top-1/2 -translate-x-1/2 -translate-y-1/2 size-2.5 rounded-full bg-secondary" />
            <p class="text-xs font-mono text-mutedText">{{ station.period }}</p>
          </div>
          <p class="font-bold text-lg text-bodyText">{{ station.org }}</p>
          <p v-if="station.title" class="text-bodyText">{{ station.title }}</p>
          <p v-if="station.meta" class="text-mutedText text-sm">{{ station.meta }}</p>

          <!-- Mehrere Rollen bei derselben Firma -->
          <ol v-if="station.roles" class="mt-4 space-y-4">
            <li v-for="role in station.roles" :key="role.title" class="pl-5">
              <p class="relative font-semibold text-bodyText">
                <span class="absolute left-[-20px] top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-mutedText" />
                {{ role.title }}
              </p>
              <p class="text-mutedText text-sm">{{ role.period }}<template v-if="role.meta"> · {{ role.meta }}</template></p>
            </li>
          </ol>
        </li>
      </ol>
    </section>

    <section class="mb-20">
      <h2 class="text-xs font-semibold tracking-[0.3em] text-secondary uppercase mb-8">
        Skills
      </h2>
      <div class="grid sm:grid-cols-2 gap-x-8 gap-y-8">
        <div v-for="group in skillGroups" :key="group.name">
          <h3 class="font-bold text-bodyText mb-3">{{ group.name }}</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in group.skills"
              :key="skill"
              class="px-3 py-1.5 rounded-full bg-surface text-bodyText text-sm font-medium"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <div class="flex flex-wrap justify-center gap-3">
      <NuxtLink
        to="/projects"
        class="px-6 py-3 rounded-full bg-secondary text-white font-bold tracking-wide shadow-lg hover:scale-105 transition-transform duration-300"
      >
        Meine Projekte
      </NuxtLink>
      <NuxtLink
        to="/contact"
        class="px-6 py-3 rounded-full bg-surface text-bodyText font-bold tracking-wide hover:scale-105 transition-transform duration-300"
      >
        Kontakt
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Role {
  title: string;
  period: string;
  meta?: string;
}

interface Station {
  org: string;
  period: string;
  title?: string;
  meta?: string;
  /** Für mehrere Rollen bei derselben Firma */
  roles?: Role[];
}

// Jeweils neueste Station zuerst
const work: Station[] = [
  {
    org: 'Mercedes-Benz AG',
    period: 'März 2025 – heute',
    meta: 'Böblingen',
    roles: [
      { title: 'Bachelorand', period: 'Okt. 2026 – heute', meta: 'Vollzeit' },
      { title: 'Werkstudent', period: 'Sep. 2025 – Okt. 2026' },
      { title: 'IT Business Analyst', period: 'März 2025 – Aug. 2025', meta: 'Praktikum' },
    ],
  },
  {
    org: 'Arianim',
    title: 'Software Developer',
    period: 'Juli 2024 – Nov. 2025',
    meta: 'Teilzeit · Remote',
  },
  {
    org: 'Heim GmbH',
    title: 'Helfer in der Produktion',
    period: 'Oktober 2022 – Februar 2023',
    meta: 'Vollzeit, zwischen Abitur und Studium',
  },
  {
    org: 'Viamedici DACH',
    title: 'IT Support Specialist',
    period: 'März 2022 – Aug. 2023',
    meta: 'Teilzeit',
  },
];

const education: Station[] = [
  {
    org: 'Hochschule der Medien Stuttgart',
    title: 'Bachelor of Science, Medieninformatik',
    period: 'März 2023 – vsl. März 2027',
  },
  {
    org: 'Rolf-Benz-Schule Nagold',
    title: 'Abitur, Technisches Gymnasium für Technik und Management',
    period: 'Sep. 2019 – Juni 2022',
  },
];

const sections = [
  { title: 'Berufserfahrung', stations: work },
  { title: 'Ausbildung', stations: education },
];

// Skills nach Kategorien, abgeleitet aus den eigenen Beiträgen in den Projekten
const skillGroups = [
  { name: 'Sprachen', skills: ['TypeScript', 'JavaScript', 'Java', 'C#', 'Python', 'Kotlin'] },
  { name: 'Backend', skills: ['Node.js', 'Express', 'Tsoa', 'Keycloak'] },
  { name: 'Datenbanken', skills: ['PostgreSQL', 'MongoDB'] },
  { name: 'Frontend', skills: ['Vue', 'Nuxt'] },
  { name: 'Cloud & DevOps', skills: ['Docker', 'Kubernetes', 'Terraform', 'Git', 'Databricks'] },
  { name: 'KI & Daten', skills: ['PyTorch', 'pandas', 'n8n', 'LangGraph'] },
  { name: 'Game Development', skills: ['Unity', 'Multiplayer', 'VR'] },
];

useSeoMeta({
  title: 'About — Joel Starkov',
  description: 'Über Joel Starkov: Medieninformatik-Student an der Hochschule der Medien Stuttgart, Bachelorand bei der Mercedes-Benz AG.',
});
</script>
