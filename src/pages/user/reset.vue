<script setup lang="ts">
import log from 'loglevel'
import { useMessage } from 'naive-ui';
import { useUserStore } from '~/stores/user';
import { supabase } from "~/supabase";

const user = useUserStore()
const router = useRouter()
const route = useRoute()
const message = useMessage()

if (!route.hash) router.push('/user')

const passwd = ref('')
const passwd2 = ref('')

const hashValues = new Map<string, string>()
const hash = route.hash.substring(1)
const values = hash.split('&')
values.forEach((i) => {
  const value = i.split('=')
  hashValues.set(value[0], value[1])
})

if (!hashValues.has('access_token')) {
  message.error("Fehlender access_token")
  router.push('/user')
}

async function reset() {
  if (!passwd.value) return
  const { error, data } = await supabase.auth.api.updateUser(
    hashValues.get('access_token'), {
    password: passwd.value
  })
  if (error) {
    message.error(error.message)
    return
  }
  user.setSession(data)
  router.push('/user')
}
</script>

<template>
  <n-space vertical>
    <n-input type="password" v-model:value="passwd" />
    <n-input type="password" v-model:value="passwd" />
    <n-button @click="reset()">reset</n-button>
  </n-space>
</template>
