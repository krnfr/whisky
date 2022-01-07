<template>
  <n-page-header title="Kategorie" @back="$router.back()"></n-page-header>
  <n-list>
    <n-list-item v-for="i in list" @click="router.push('/category/' + i.id)">
      <n-thing :title="i.name">
        <template #header-extra>
          <n-avatar size="small" :style="{ backgroundColor: i.color ? i.color : '#DCDCDC' }">
            <n-icon>
              <mdi-bottle-tonic />
            </n-icon>
          </n-avatar>
        </template>
      </n-thing>
    </n-list-item>
  </n-list>
</template>

<script setup lang="ts">
import { useSupabaseStore } from '~/stores/supabase';


const api = useSupabaseStore()
const router = useRouter()
const list = computed(() => api.categories)

</script>
