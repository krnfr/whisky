<script setup lang="ts">
import { useUserStore } from '~/stores/user';

const user = useUserStore()
</script>

<template>
  <n-h1>Hallo (;</n-h1>
  <n-h2>die Open-Source Platform zum Verwalten und Verkaufen von Whisky's (+ alles andere zum trinken)</n-h2>
</template>
