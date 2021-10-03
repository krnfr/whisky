import { defineStore } from 'pinia'
import log from 'loglevel'
import { supabase, selects } from '../supabase' // eslint-disable-line
import { CollectionItem, Currency } from '~/types'
import { mitt } from '~/mitt'
import { useMessage } from 'naive-ui'

const message = useMessage()

export const useSupabaseStore = defineStore('supabase', () => {
  const collection = ref(new Array<CollectionItem>())
  const selectedItem = ref<CollectionItem>()
  const currencies = ref(new Array<Currency>())

  async function getCollection() {
    const { data, error } = await supabase.from<CollectionItem>('collection').select(selects.item)
    if (error) message.error(error.message)
    else {
      collection.value = data ? data : collection.value
      return collection.value.sort((a, b) => {
      var nameA = a.liquor.name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.liquor.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    }
      )
    }
  }

  async function getCollectionItem(id:string) {
    const { data, error } = await supabase.from<CollectionItem>('collection').select(selects.item).eq('id', id).single()
    if (error) message.error(error.message)
    if(!data) return
    log.debug(`loading item:${data.id}`)
    return selectedItem.value = data
  }

  async function getCurrencies() {
    const { data, error } = await supabase.from<Currency>('currency').select()
    if (error) message.error(error.message)
    return currencies.value = data ? data : currencies.value
  }

  function getCurrencyById(id: number) {
    return currencies.value.find(c => c.id == id)
  }

  async function refresh() {
    await getCollection()
    await getCurrencies()
  }

  refresh()
  mitt.on('update', refresh)

  return {
    collection,
    selectedItem,
    currencies,
    getCurrencyById,
    getCollection,
    getCollectionItem,
  }
})
