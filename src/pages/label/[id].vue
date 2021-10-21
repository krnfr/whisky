<template>
  <div v-if="item">
    {{ item.name }}
    <n-list>
      <n-list-item v-for="i in list">{{ i.name }}</n-list-item>
    </n-list>
  </div>
  <div v-else>
    <n-skeleton text :repeat="2" />
    <n-skeleton text style="width: 60%;" />
  </div>
</template>

<script setup lang="ts">
import { mitt } from '~/mitt';
import { useSupabaseStore } from '~/stores/supabase';

const props = defineProps<{ id: number }>()

const api = useSupabaseStore()

const item = computed(() => api.labels.find(i => i.id == props.id))
const list = ref(api.filterLiqours(0, props.id))

function loadList() {
  list.value = api.filterLiqours(0, props.id)
}

watch(() => [props.id], () => {
  loadList()
})

mitt.on('finished', () => {
  loadList()
})

</script>
