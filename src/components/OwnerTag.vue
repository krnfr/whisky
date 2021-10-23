<script setup lang="ts">
import { useSupabaseStore } from '~/stores/supabase';

const api = useSupabaseStore()

const props = defineProps<{
  ownerId: string,
  ownerName?: string,
  size: string,
}>()

function getOwnerName() {
  const name = api.owners.find(o => o.id == props.ownerId)?.name
  return name ?? 'Unbekannt'
}

</script>

<template>
  <n-tag v-if="ownerId" :size="props.size ?? 'small'">{{ (ownerName ?? getOwnerName()) }}</n-tag>
</template>
