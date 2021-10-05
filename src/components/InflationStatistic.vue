<script setup lang="ts">
import log from 'loglevel'
import { DateTime } from 'luxon'
import { Currency } from '~/types'

const props = defineProps<{
  value: number,
  date: string | undefined,
  currency?: Currency,
}>()

const cleaned = ref(0)
const start = props.date ? DateTime.fromISO(props.date) : null

onMounted(async () => {
  const end = DateTime.now()
  if (!start || !end) return
  await fetch(`https://www.statbureau.org/calculate-inflation-rate-json?start=${start.toFormat('yyyy/MM/dd')}&end=${end.toFormat('yyyy/MM/dd')}&country=germany`, {
    mode: 'cors'
  })
    .then(res => res.json())
    .then(res => {
      const rate = res / 100
      cleaned.value = (props.value * rate ?? 1) / 100
    })
})

function converted() {
  if (!props.currency?.id || props.currency.id < 2) return cleaned.value.toFixed(2)
  return (cleaned.value * (props.currency?.to_eur ?? 1)).toFixed(2)
}

</script>

<template>
  <n-statistic>
    <template #label>
      <span>CPI by&nbsp;</span>
      <n-a href="https://www.statbureau.org">www.statbureau.org</n-a>
    </template>
    <n-text v-if="!date && !value" depth="3">NA</n-text>
    <n-spin v-if="!cleaned" :size="20" />
    <n-text v-else>{{ converted() }} {{ (currency?.id ? '€' : '?') }}</n-text>
  </n-statistic>
</template>
