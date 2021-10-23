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
import { useSupabaseStore } from '~/stores/supabase';

const api = useSupabaseStore()

const props = defineProps<{
  id: number
}>()

const item = computed(() => api.categories.find(i => i.id == props.id))
const list = computed(() => api.liquors.filter(i => i.category?.id == props.id))

</script>

<style scoped>
</style>
