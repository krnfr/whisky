<script setup lang="ts">
import { useSupabaseStore } from '~/stores/supabase';
import { useUserStore } from '~/stores/user';

const user = useUserStore()
const api = useSupabaseStore()
const router = useRouter()
if (!user.loggedIn) router.push('/items')

const current = ref(1)
const previos = ref(0)
const currentStatus = ref('')

function next() {
  // const temp = previos.value
  // previos.value = current.value

  current.value += 1
}

const categoryId = ref(0)
const categoryName = computed(() => {
  const c = api.categories.find(i => i.id == categoryId.value)
  if (!c) return 'Unbekannt'
  return c.name
})
function handleCategorySelected(value: number = 0) {
  categoryId.value = value
  next()
}
async function handleCategoryAdd(name: string) {
  const c = await api.addCategory(name)
  if (c) {
    handleCategorySelected(c.id)
  }
}

const labelId = ref(0)
const labelName = computed(() => {
  const l = api.labels.find(i => i.id == labelId.value)
  if (!l) return 'Unbekannt'
  return l.name
})
function handleLabelSelected(value: number = 0) {
  labelId.value = value
  next()
}
async function handleLabelAdd(name: string) {
  const l = await api.addLabel(name)
  if (l) {
    handleCategorySelected(l.id)
  }
}
</script>

<template>
  <n-page-header title="Hinzufügen" @back="router.back()"></n-page-header>

  <n-steps :current="current" :status="currentStatus" vertical id="steps">
    <n-step title="Kategorie">
      <n-space v-if="current == 1" vertical class="select">
        <card-select
          :list="api.selectCategories()"
          skip
          add
          @add="handleCategoryAdd"
          @selected="handleCategorySelected"
          :selected="categoryId"
        />
      </n-space>
      <n-space v-else>{{ categoryName }}</n-space>
    </n-step>
    <n-step title="Label">
      <n-space v-if="current == 2" vertical class="select">
        <card-select
          :list="api.selectLabels()"
          skip
          add
          @add="handleLabelAdd"
          @selected="handleLabelSelected"
          :selected="labelId"
        />
      </n-space>
      <n-space v-else>{{ labelName }}</n-space>
    </n-step>
    <n-step title="Liquor"></n-step>
    <n-step title="Zustand"></n-step>
    <n-step title="Verpackung"></n-step>
    <n-step title="Info"></n-step>
    <n-step title="Besitzer"></n-step>
    <n-step title="Lager"></n-step>
    <n-step title="Bilder"></n-step>
  </n-steps>
</template>

<style>
#steps {
  margin: 5px;
}

.select {
  margin-right: 10px;
}
</style>
