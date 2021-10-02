<script setup lang="ts">
import { supabase } from "~/supabase";

const props = defineProps<{
  item: string,
  image: string
}>()

</script>

<template>
  <n-avatar
    v-if="props.item && props.image"
    :src="supabase.storage.from('pictures').getPublicUrl(`${props.item}/${props.image}.jpg`).publicURL?.toString()"
  />
</template>
