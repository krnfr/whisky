import { defineStore } from 'pinia'
import log from 'loglevel'
import { definitions } from 'types/supabase'
import { supabase, selects } from '../supabase' // eslint-disable-line
import { CollectionItem } from '~/types'

export const useSupabaseStore = defineStore('supabase', () => {
  const collection = ref(new Array<definitions['collection']>())

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

  getCollection()

  return {
    collection,
    getCollection,
  }
})
