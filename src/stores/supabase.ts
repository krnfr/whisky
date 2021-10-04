import { defineStore } from 'pinia'
import log from 'loglevel'
import { supabase, selects } from '../supabase' // eslint-disable-line
import { Category, CollectionItem, Currency, Label } from '~/types'
import { mitt } from '~/mitt'
import { useMessage } from 'naive-ui'

const message = useMessage()

export const useSupabaseStore = defineStore('supabase', () => {
  /* #region collection */
  const collection = ref(new Array<CollectionItem>())
  const selectedItem = ref<CollectionItem>()

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

  async function getCollectionItem(id: string) {
    const { data, error } = await supabase.from<CollectionItem>('collection').select(selects.item).eq('id', id).single()
    if (error) message.error(error.message)
    if (!data) return
    log.debug(`loading item:${data.id}`)
    return selectedItem.value = data
  }
  /* #endregion */

  /* #region currency */
  const currencies = ref(new Array<Currency>())

  async function getCurrencies() {
    const { data, error } = await supabase.from<Currency>('currency').select()
    if (error) message.error(error.message)
    return currencies.value = data ? data : currencies.value
  }

  function getCurrencyById(id: number) {
    return currencies.value.find(c => c.id == id)
  }
  /* #endregion */

  /* #region category */
  const categories = ref(new Array<Category>())

  function selectCategories() {
    const list = new Array<{ value: number, label: string | undefined }>()
    categories.value.forEach(c => {
      list.push({ label: c.name, value: c.id })
    })
    return list
  }

  async function getCategories() {
    const { data, error } = await supabase
      .from<Category>('category')
      .select()
      .order('name')
    if (error) {
      log.error(error.message)
      return categories
    }
    categories.value = data ? data : categories.value
    return categories
  }

  async function addCategory(name: string) {
    const { data, error } = await supabase
      .from<Category>('category')
      .insert({ name: name })
      .single()
    if (error) {
      console.error(error.message)
      message.error(error.message)
      return
    }
    await getCategories()
    return data
  }
  /* #endregion */

  /* #region label */
  const labels = ref(new Array<Label>())

  function selectLabels() {
    const list = new Array<{ value: number, label: string | undefined }>()
    labels.value.forEach(c => {
      list.push({ label: c.name, value: c.id })
    })
    return list
  }

  async function getLabels() {
    const { data, error } = await supabase
      .from<Label>('label')
      .select()
      .order('name')
    if (error) {
      log.error(error.message)
      return labels
    }
    labels.value = data ? data : labels.value
    return labels
  }

  async function addLabel(name: string) {
    const { data, error } = await supabase
      .from<Label>('label')
      .insert({ name: name })
      .single()
    if (error) {
      console.error(error.message)
      message.error(error.message)
      return
    }
    await getLabels()
    return data
  }
  /* #endregion */

  async function refresh() {
    if (selectedItem.value?.id) {
      await getCollectionItem(selectedItem.value.id)
    }

    await getCollection()
    await getCurrencies()
    await getCategories()
    await getLabels()
  }

  refresh()
  mitt.on('update', refresh)

  return {
    collection,
    getCollection,
    getCollectionItem,
    selectedItem,
    currencies,
    getCurrencyById,
    categories,
    selectCategories,
    getCategories,
    addCategory,
    labels,
    selectLabels,
    getLabels,
    addLabel
  }
})
