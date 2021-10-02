import { defineStore } from 'pinia'
import log from 'loglevel'
import { supabase, selects } from '../supabase' // eslint-disable-line
import { CollectionItem, Currency } from '~/types'

export const useSupabaseStore = defineStore('supabase', () => {
  const collection = ref(new Array<CollectionItem>())
  const selectedItem = ref(null)
  const currencies = ref(new Array<Currency>())

  async function getCollection() {
    const { data, error } = await supabase.from<CollectionItem>('collection').select(selects.item)
    if (error) log.error(error.message)
    else {
      collection.value = data
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
    if (error) log.error(error.message)
    return selectedItem.value = data
  }

  async function getCurrencies() {
    const { data, error } = await supabase.from<Currency>('currency').select()
    if (error) log.error(error.message)
    return currencies.value = data
  }

  function getCurrencyById(id: number) {
    return currencies.value.find(c => c.id == id)
  }

  getCollection()
  getCurrencies()

  return {
    collection,
    selectedItem,
    currencies,
    getCurrencyById,
    getCollection,
    getCollectionItem,
  }
})
