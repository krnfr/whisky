<script setup lang="ts">
import { Package } from '~/types';

const props = defineProps<{
  condition?: number,
  notes?: string,
  package?: Package
}>()

</script>

<template>
  <n-card title="Packung">
    <n-space v-if="props.package" vertical justify="center" align="center">
      <n-h1>
        <n-text type="primary">{{ props.package?.name }}</n-text>
      </n-h1>
      <n-rate readonly size="large" :value="props.condition" />
    </n-space>
    <n-empty v-else description="Keine Packung">
      <template #icon>
        <n-icon>
          <mdi-archive-remove />
        </n-icon>
      </template>
    </n-empty>
  </n-card>
</template>
