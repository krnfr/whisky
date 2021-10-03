<script setup lang="ts">
import log from 'loglevel'
import { useMessage } from 'naive-ui';
import { useUserStore } from "~/stores/user";
import { supabase } from '~/supabase';

const user = useUserStore()
const router = useRouter()
const message = useMessage()

const email = ref('')
const password = ref('')
const disabled = ref(false)

function resetData() {
  // email.value = ''
  password.value = ''
  disabled.value = false
}

async function reset() {
  disabled.value = true
  const { data, error } = await supabase.auth.api.resetPasswordForEmail(
    user.loggedIn ? user.session?.email : email.value,
    { redirectTo: user.url + '/reset' })
  if (error) {
    message.error(error.message)
    resetData()
    return
  }
  user.setSession(data)
  router.push('/user/email')
}

async function magic() {
  if (!email.value) return
  disabled.value = true
  const { data, error } = await supabase.auth.signIn(
    {
      email: email.value
    },
    {
      redirectTo: user.url
    }
  )
  if (error) {
    disabled.value = false
    log.error(error.message)
  } else {
    user.setSession(data)
    router.push('/user/email')
  }
}

async function login() {
  if (!email.value) return
  log.debug(`logging ${email.value}${password.value ? ':' + password.value + ' ' : ''}`)
  disabled.value = true
  const { data, error } = await supabase.auth.signIn({
    email: email.value,
    password: password.value ? password.value : undefined
  }, {
    redirectTo: user.url
  })
  if (error) {
    message.error(error.message)
    resetData()
    return
  }
  user.setSession(data)
  if (user.loggedIn) router.push('/user')
  else router.push('/user/email')
}
</script>


<template>
  <n-space vertical>
    <n-input v-if="user.loggedIn" disabled :placeholder="user.session?.email" />
    <n-input v-else placeholder="email" v-model:value="email" type="text" />
    <n-input placeholder="password" type="password" v-model:value="password" />
    <n-space justify="end">
      <n-button type="warning" :disabled="disabled" @click="reset">reset password</n-button>
      <n-button type="info" :disabled="disabled" @click="magic">magic link</n-button>
      <n-button type="success" :disabled="disabled" @click="login">login</n-button>
    </n-space>
  </n-space>
</template>
