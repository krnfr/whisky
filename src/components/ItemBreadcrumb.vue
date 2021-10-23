<script setup lang="ts">
import { set } from '@vueuse/core'
import log from 'loglevel'
import { mitt } from '~/mitt'
import { useSupabaseStore } from '~/stores/supabase'

const props = defineProps<{
  value: number
}>()

const s = useSupabaseStore()

const category = ref({ name: 'Unbekannt', id: 0 })
const label = ref({ name: 'Unbekannt', id: 0 })
const liquor = ref({ name: 'Unbekannt', id: 0 })

function update() {
  log.debug('breadcrumb: loading ' + props.value)

  const li = s.liquors.find(l => l.id == props.value)
  if (li) set(liquor, li)

  const la = s.labels.find(l => l.id == li?.label?.id)
  if (la) set(label, la)

  const ca = s.categories.find(c => c.id == li?.category?.id)
  if (ca) set(category, ca)
}

mitt.on('finished', update)
watch(
  () => [props.value],
  () => { update() }
)
update()
</script>

<template>
  <n-breadcrumb>
    <n-breadcrumb-item>
      <router-link :to="'/category/' + (category.id > 0 ? category.id : '')">{{ category?.name }}</router-link>
    </n-breadcrumb-item>
    <n-breadcrumb-item>
      <router-link :to="'/label/' + (label.id > 0 ? label.id : '')">{{ label?.name }}</router-link>
    </n-breadcrumb-item>
    <n-breadcrumb-item>
      <router-link
        :to="'/liqour/' + (liquor.id > 0 ? liquor.id : '')"
      >{{ liquor.name ? liquor.name : label.name }}</router-link>
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>
