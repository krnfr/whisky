<script setup lang="ts">
import { useUserStore } from '~/stores/user';

const user = useUserStore()
const router = useRouter()
if (!user.loggedIn) router.push('/items')

const current = ref(1)
const currentStatus = ref('')

</script>

<template>
  <n-page-header title="Hinzufügen" @back="router.back()"></n-page-header>

  <n-steps :current="current" :status="currentStatus" vertical id="steps">
    <n-step title="Kategorie"></n-step>
    <n-step title="Label"></n-step>
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
</style>
