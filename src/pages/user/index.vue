<script setup lang="ts">
import log from 'loglevel'
import { useUserStore } from '~/stores/user'
import { supabase } from '~/supabase'

const user = useUserStore()
const router = useRouter()

if (!user.loggedIn) router.push('/user/login')

async function logout() {
  const { data, error } = await supabase.auth.signOut()
  if (error) log.error(error.message)
  user.setSession(data)
  router.push('/')
}
</script>

<template>
  <n-space vertical>
    <h1>Hi {{ user.session?.email }}</h1>
    <n-space>
      <n-button type="warning" @click="logout">Logout</n-button>
    </n-space>
  </n-space>
</template>
