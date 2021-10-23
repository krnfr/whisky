<template>
  <n-tag size="small" v-if="value" type="error">zu Verkaufen</n-tag>
  <n-tag size="small" v-else type="success">nicht Verkaufbar</n-tag>
</template>

<script setup lang="ts">
defineProps<{ value: boolean }>()
</script>

<style scoped>
</style>
