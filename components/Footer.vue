<script setup lang="ts">
const currentYear = new Date().getFullYear()

const iconData = computed(() => {
  return [
    {
      link: 'https://www.facebook.com/ManabuOfficial/',
      class: 'i-fa-brands:facebook-f',
      name: 'Facebook',
    },
    {
      link: 'https://twitter.com/lessonsmanabu',
      class: 'i-fa-brands:twitter',
      name: 'Twitter',
    },
    {
      link: 'https://www.instagram.com/nihongo_manabu_/',
      class: 'i-fa-brands:instagram',
      name: 'Instagram',
    },
    {
      link: 'https://www.youtube.com/channel/UCwtTZCZ9apsj7zNn7n1eS5w',
      class: 'i-fa-brands:youtube',
      name: 'Youtube',
    },
    {
      link: 'https://line.me/R/ti/p/%40743ilrvx',
      class: 'i-fa-brands:line',
      name: 'LINE',
    },
    {
      link: 'https://discord.com/invite/zHpyvN2TVA',
      class: 'i-fa-brands:discord',
      name: 'Discord',
    },
    {
      link: 'https://api.whatsapp.com/message/RJYZPGP6LNXNF1',
      class: 'i-fa-brands:whatsapp',
      name: 'WhatsApp',
    },
  ]
})

const usefulLinkData = computed(() => {
  return [
    {
      link: '/apply',
      title: 'test',
    },
    {
      link: '/teachers',
      title: 'test',
    },
  ]
})
</script>

<template>
  <div class="u-border-t-2 u-border-gray-200 dark:u-border-transparent">
    <footer class="u-relative u-pt-6 lg:u-pt-5 u-pb-6 u-mx-auto u-w-11/12">
      <div
        class="u-bottom-auto u-top-0 u-left-0 u-right-0 u-w-full u-absolute u-pointer-events-none u-overflow-hidden"
        style="height: 80px"
      />
      <div class="u-container u-mx-auto u-px-4 u-pt-4">
        <div class="u-grid u-grid-cols-12">
          <div class="u-col-span-12 lg:u-col-span-6">
            <h4 class="u-text-xl u-font-semibold dark:u-dark-title">
              questions
            </h4>
            <h5 class="u-my-2">
              question text
            </h5>
            <div class="u-flex u-justify-start u-flex-wrap u-gap-x-8 -u-mx-1">
              <div v-for="icon in iconData" :key="icon.name">
                <a :href="icon.link" :title="icon.name" target="_blank">
                  <div class="u-my-3 u-text-lg md:u-text-xl" :class="icon.class" />
                </a>
              </div>
            </div>
          </div>
          <div class="u-col-span-12 lg:u-col-span-3 u-my-2">
            <span class="u-block u-uppercase u-font-semibold dark:u-dark-title">Useful links</span>
            <ul v-for="usefulLink in usefulLinkData" :key="usefulLink.title">
              <li class="u-my-2">
                <router-link :to="usefulLink.link" class="u-nav-link">
                  {{ usefulLink.title }}
                </router-link>
              </li>
            </ul>
          </div>
          <div class="u-col-span-12 lg:u-col-span-3 u-my-2 lg:u-mt-0">
            <div class="u-flex u-mt-0 u-mt-4 u-justify-end u-w-full">
              <DarkToggle />
            </div>
          </div>
        </div>
        <div class="u-flex u-flex-wrap u-items-center lg:u-justify-between u-justify-center u-mt-20">
          <div class="u-w-full lg:u-w-4/12 u-px-4 u-mx-auto u-text-center">
            <div class="u-text-sm u-text-gray-600 dark:u-dark-title u-font-semibold u-py-1">
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
