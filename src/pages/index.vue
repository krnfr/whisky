<script setup lang="ts">
import log from 'loglevel';
import { useSupabaseStore } from '~/stores/supabase';
import { selects, supabase } from '~/supabase';
import { CollectionItem, Price } from '~/types';

const api = useSupabaseStore()
const s = supabase

const carousel = ref(new Set<CollectionItem>())

async function loadExpensive() {
  let { data } = await s.from<Price>('price')
    .select()
    .order('price', { ascending: false })
    .limit(10)
  log.debug(data)
  const liquors = new Set<number>()
  let id = 0
  while (liquors.size <= 3) {
    liquors.add(data[id].liquor)
    id++
  }
  log.debug(liquors)
  for (let i of liquors) {
    let { data } = await s.from<CollectionItem>('collection')
      .select(selects.item)
      .eq('liquor', i)
    data?.forEach(c => carousel.value.add(c))
  }
}

onBeforeMount(async () => await loadExpensive())

</script>

<template>
  <div class="h-full">
    <n-h1>Hallo (;</n-h1>
    <n-carousel autoplay class="h-2/3">
      <n-grid cols="2" v-for="i in carousel">
        <n-gi>
          <img
            class="object-cover w-full w-full"
            :src="s.storage.from('pictures').getPublicUrl(`${i.id}/${i.cover}.jpg`).publicURL"
          />
        </n-gi>
        <n-gi>
          <n-card size="small" class="h-full">
            <n-space vertical class="p-2">
              <n-h1 prefix="bar">
                <n-text type="primary">{{ i.liquor?.name ? i.liquor.name : i.label?.name }}</n-text>
              </n-h1>
              <n-h2>
                <n-text type="info">{{ i.liquor.label?.name }}</n-text>
              </n-h2>
            </n-space>
          </n-card>
        </n-gi>
      </n-grid>
    </n-carousel>
    <n-h2>die Open-Source Platform zum Verwalten und Verkaufen von Whisky's (+ alles andere zum trinken)</n-h2>
  </div>
</template>
