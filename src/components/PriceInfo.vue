<script setup lang="ts">
import { useSupabaseStore } from "~/stores/supabase";
import { Currency } from "~/types";

const api = useSupabaseStore()
const props = defineProps<{
  value: number,
  currency?: Currency,
  convert?: boolean
}>()
function valueFormatted() {
  return (props.value / 100).toFixed(2)
}
function valueConverted() {
  return ((props.value * (props.currency?.to_eur ? props.currency?.to_eur : 1)) / 100).toFixed(2)
}
</script>

<template>
  <div v-if="props.value">
    <span v-html="valueFormatted()" />
    <span v-if="currency" v-html="' ' + (currency?.symbol ? currency.symbol : '')" />
    <n-text depth="3" v-if="convert && currency?.id > 1">
      <span>&nbsp;/&nbsp;</span>
      <span v-html="valueConverted()" />
      <span>&nbsp;€</span>
    </n-text>
  </div>
</template>
