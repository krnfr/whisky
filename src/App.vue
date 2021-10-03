<script setup lang="ts">
import log from 'loglevel'
// https://github.com/vueuse/head
useHead({
  title: 'walter\'s whisky\'s',
})
</script>

<template>
  <n-config-provider>
    <router-view />
  </n-config-provider>
</template>

<style>
</style>
