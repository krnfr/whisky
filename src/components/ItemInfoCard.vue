<script setup lang="ts">

const props = defineProps<{
  condition?: number,
  notes?: string
}>()

</script>


<template>
  <n-card title="Info">
    <n-statistic label="Zustand">
      <n-rate readonly size="large" :value="condition" />
    </n-statistic>
    <n-statistic label="Notizen">
      <n-p>{{ props.notes }}</n-p>
    </n-statistic>
  </n-card>
</template>
