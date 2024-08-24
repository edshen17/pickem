<script setup lang="ts">
const currentYear = new Date().getFullYear()

const iconData = computed(() => {
  return [
    {
      link: '#',
      class: 'i-fa-brands:facebook-f',
      name: 'Facebook',
    },
    {
      link: '#',
      class: 'i-fa-brands:twitter',
      name: 'Twitter',
    },
    {
      link: '#',
      class: 'i-fa-brands:instagram',
      name: 'Instagram',
    },
    {
      link: '#',
      class: 'i-fa-brands:youtube',
      name: 'Youtube',
    },
    {
      link: '#',
      class: 'i-fa-brands:discord',
      name: 'Discord',
    },
    {
      link: '#',
      class: 'i-fa-brands:whatsapp',
      name: 'WhatsApp',
    },
  ]
})

// const usefulLinkData = computed(() => {
//   return [
//     {
//       link: '/',
//       title: 'test',
//     },
//     {
//       link: '/',
//       title: 'test',
//     },
//   ]
// })
</script>

<template>
  <div class="u-border-t-2 u-border-gray-200 dark:u-border-gray-700">
    <footer class="u-relative u-mx-auto u-w-11/12 u-pb-6 u-pt-6 lg:u-pt-5">
      <div
        class="u-pointer-events-none u-absolute u-bottom-auto u-left-0 u-right-0 u-top-0 u-w-full u-overflow-hidden"
        style="height: 80px"
      />
      <div class="u-mx-auto u-px-4 u-pt-4 u-container">
        <div class="u-grid u-grid-cols-12">
          <div class="u-col-span-12 lg:u-col-span-6">
            <h4 class="u-text-xl dark:u-dark-title u-font-semibold">
              Questions?
            </h4>
            <h5 class="u-my-2 u-text-base">
              Find us on any of these platforms! We usually respond in 1-2 business days.
            </h5>
            <div class="u-flex u-flex-wrap u-justify-start u-gap-x-8 -u-mx-1">
              <div v-for="icon in iconData" :key="icon.name">
                <a :href="icon.link" :title="icon.name" target="_blank">
                  <div class="u-my-3 u-text-lg md:u-text-xl" :class="icon.class" />
                </a>
              </div>
            </div>
          </div>
          <div class="u-col-span-12 u-my-2 lg:u-col-span-3">
            <!-- <span class="u-block dark:u-dark-title u-font-semibold u-uppercase">Useful links</span>
            <ul v-for="usefulLink in usefulLinkData" :key="usefulLink.title">
              <li class="u-my-2">
                <router-link :to="usefulLink.link" class="u-nav-link">
                  {{ usefulLink.title }}
                </router-link>
              </li>
            </ul> -->
          </div>
          <div class="u-col-span-12 u-my-2 lg:u-col-span-3 lg:u-mt-0">
            <div class="u-mt-0 u-mt-4 u-w-full u-flex u-justify-end">
              <DarkToggle />
            </div>
          </div>
        </div>
        <div class="u-mt-20 u-flex u-flex-wrap u-items-center u-justify-center lg:u-justify-between">
          <div class="u-mx-auto u-w-full u-px-4 u-text-center lg:u-w-4/12">
            <div class="u-py-1 u-text-sm dark:u-dark-title u-text-gray-600 u-font-semibold">
              Copyright © {{ currentYear }}.
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
select {
  appearance: none;
}
</style>
