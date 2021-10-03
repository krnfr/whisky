import { acceptHMRUpdate, defineStore } from 'pinia'
import log from 'loglevel'
import { supabase } from '~/supabase'

export const useUserStore = defineStore('user', () => {
  const session = ref(supabase.auth.user())
  const loggedIn = ref(false)
  const url = ref(import.meta.env.PROD ? 'https://whisky.anetz.net/user' : 'http://localhost:4000/user')

  if (session.value?.email) loggedIn.value = true
  log.debug(loggedIn.value ? 'user is logged in' : 'user isnt logged in')

  function setSession(newSession: any) {
    session.value = newSession
    loggedIn.value = session.value?.email ? true : false
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
