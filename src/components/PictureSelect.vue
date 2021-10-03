<script setup lang="ts">

const props = defineProps<{
  list: Array<{
    id: string,
    src: string
  }>
}>()
const emit = defineEmits(['selected'])
</script>

<template>
  <n-grid cols="3">
    <n-gi v-for="pic in list">
      <img :src="pic.src" @click="emit('selected', pic.id)" style="width: 100%;" />
    </n-gi>
  </n-grid>
</template>
