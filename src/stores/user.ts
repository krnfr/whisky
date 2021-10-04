import { acceptHMRUpdate, defineStore } from 'pinia'
import log from 'loglevel'
import { supabase } from '~/supabase'

export const useUserStore = defineStore('user', () => {
  const session = ref(supabase.auth.user())
  const loggedIn = ref(false)
  const url = ref(import.meta.env.PROD ? 'https://whisky.anetz.net/user' : 'http://localhost:4000/user')

  if (session.value?.email) loggedIn.value = true
  log.debug(loggedIn.value ? 'user is logged in' : 'user isnt logged in')
  log.debug(`user has role ${session.value?.role}`)

  function setSession(newSession: any) {
    session.value = newSession
    loggedIn.value = session.value?.email ? true : false
  }

  dev_login: if (import.meta.env.DEV && !loggedIn.value) {
    const email = import.meta.env.VITE_EMAIL
    const passwd = import.meta.env.VITE_PASSWORD
    if (!email || !passwd) break dev_login
    log.debug(`logging ${email} in`)
    supabase.auth.signIn({ email: email, password: passwd })
      .then((ctx) => {
        if (ctx.error) return log.error(ctx.error.message)
      })
  }

  return {
    session,
    setSession,
    loggedIn,
    url
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
