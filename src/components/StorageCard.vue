<script setup lang="ts">
import { useSupabaseStore } from "~/stores/supabase";
import { Storage } from "~/types";

const s = useSupabaseStore()
const props = defineProps<{
  value: Storage
}>()

</script>



<template>
  <n-card :title="'Lager' + (value.name ? ' - ' + value.name : '')">
    <n-thing v-if="value" :title="value.location?.name">
      <template #header-extra>
        <n-tag v-if="value.full_recorded" type="success" size="small">katalogisiert</n-tag>
        <n-tag v-else type="warning" size="small">angefangen</n-tag>
      </template>
      <n-statistic label="Notizen" />
    </n-thing>
    <n-empty v-else description="Kein Lager" />
  </n-card>
</template>
