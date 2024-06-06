<script setup lang="ts">
defineProps({
  thumbnail: {
    type: Object,
    default: null,
  },
});

const runtimeConfig = useRuntimeConfig();
const directusUrl = runtimeConfig.public.directus.url;
</script>

<template>
  <li
    v-if="$router.currentRoute.value.params.slug"
    class="text-black inline-block relative"
    :class="{
      'z-50': thumbnail.id === $router.currentRoute.value.params.slug[0],
    }"
  >
    <NuxtLink :to="`/detail/${thumbnail.id}`">
      <img
        v-if="thumbnail"
        width="83"
        height="51"
        :src="`${directusUrl}/assets/${thumbnail.id}`"
        :alt="thumbnail.key"
        class="object-cover rounded-md transition-all duration-500 hover:brightness-100 w-[83px] h-[51px]"
        :class="
          thumbnail.id === $router.currentRoute.value.params.slug[0]
            ? 'active brightness-100'
            : 'opacity-75 brightness-50'
        "
      />
    </NuxtLink>
  </li>
</template>
