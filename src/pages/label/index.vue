<template>
  <n-list>
    <n-list-item v-for="i in list" @click="$router.push('/label/' + i.id)">{{ i.name }}</n-list-item>
  </n-list>
</template>

<script setup lang="ts">
import { useSupabaseStore } from '~/stores/supabase';

const api = useSupabaseStore()

const list = computed(() => api.labels)

</script>
