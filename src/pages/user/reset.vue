<script setup lang="ts">
import log from 'loglevel'
import { useMessage } from 'naive-ui';
import { useUserStore } from '~/stores/user';
import { supabase } from "~/supabase";

const user = useUserStore()
const router = useRouter()
const route = useRoute()
const message = useMessage()

if (route.query.type != 'recovery' && !route.query.access_token) router.push('/user')

const passwd = ref('')
const passwd2 = ref('')

async function reset() {
  if (!passwd.value) return
  log.debug(`access token: ${route.query.access_token}`)
  const { error, data } = await supabase.auth.api.updateUser(
    route.query.access_token?.toString(), {
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
