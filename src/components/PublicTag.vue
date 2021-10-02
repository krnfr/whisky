<template>
  <n-tag v-if="props.value" size="small" type="warning">öffentlich</n-tag>
  <n-tag v-else size="small" type="info">privat</n-tag>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: boolean,
}>()
</script>
