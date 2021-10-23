<template>
  <div v-if="item">
    {{ item.name }}
    <n-list>
      <n-list-item v-for="i in list" @click="$router.push('/liquor/' + i.id)">{{ i.name }}</n-list-item>
    </n-list>
  </div>
  <div v-else>
    <n-skeleton text :repeat="2" />
    <n-skeleton text style="width: 60%;" />
  </div>
</template>

<script setup lang="ts">
import { set } from '@vueuse/core';
import { mitt } from '~/mitt';
import { useSupabaseStore } from '~/stores/supabase';

const api = useSupabaseStore()

const props = defineProps<{
  id: number
}>()

const item = computed(() => api.categories.find(i => i.id == props.id))
const list = ref(api.filterLiqours(props.id, 0))

function loadList() {
  set(list, api.filterLiqours(props.id, 0))
}

mitt.on('finished', loadList)

</script>

<style scoped>
</style>
