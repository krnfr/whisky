<script setup lang="ts">
import { useSupabaseStore } from "~/stores/supabase";

const api = useSupabaseStore()
const props = defineProps<{
  value: number,
  currency: number,
  convert: boolean
}>()
const c = computed(() => api.getCurrencyById(props.currency))

function valueFormatted() {
  return props.value / 100
}
function valueConverted() {
  return ((props.value * (c?.value?.to_eur ? c.value.to_eur : 1)) / 100).toFixed(2)
}
</script>

<template>
  <div v-if="props.value">
    <span v-html="valueFormatted()" />
    <span v-if="currency" v-html="' ' + (c?.symbol ? c.symbol : '')" />
    <n-text depth="3" v-if="props.convert && currency > 1">
      <span>&nbsp;/&nbsp;</span>
      <span v-html="valueConverted()" />
      <span>&nbsp;€</span>
    </n-text>
  </div>
</template>
