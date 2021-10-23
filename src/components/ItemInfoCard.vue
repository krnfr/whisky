<script setup lang="ts">
import { CollectionItem } from '~/types';

defineProps<{
  value: CollectionItem
}>()

</script>


<template>
  <n-card title="Info">
    <n-statistic v-if="value.lot" label="Lot">
      <n-text>{{ value.lot }}</n-text>
    </n-statistic>
    <n-statistic label="Zustand">
      <n-rate readonly size="large" :value="value.condition" />
    </n-statistic>
    <n-statistic v-if="value.notes" label="Notizen">
      <n-p>{{ value.notes }}</n-p>
    </n-statistic>
  </n-card>
</template>
