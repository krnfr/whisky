<script setup lang="ts">
import log from 'loglevel'
import { useSupabaseStore } from '~/stores/supabase'

const props = defineProps<{
  value: string
}>()

const s = useSupabaseStore()

const category = ref('')
const label = ref('')
const liquor = ref('')

function update() {
  log.debug('breadcrumb: loading ' + props.value)

  const ci = s.collection.find(i => i.id == props.value)

  const li = s.liquors.find(l => l.id == ci?.liquor?.id)
  liquor.value = li?.name ?? ''

  const la = s.labels.find(l => l.id == li?.label?.id)
  label.value = la?.name ?? ''

  const ca = s.categories.find(c => c.id == li?.category?.id)
  category.value = ca?.name ?? ''
}

watch(
  () => [props.value],
  () => { update() }
)

update() // TODO: why is it not loading
</script>

<template>
  <n-breadcrumb>
    <n-breadcrumb-item>{{ category }}</n-breadcrumb-item>
    <n-breadcrumb-item>{{ label }}</n-breadcrumb-item>
    <n-breadcrumb-item>{{ liquor ? liquor : label }}</n-breadcrumb-item>
  </n-breadcrumb>
</template>
