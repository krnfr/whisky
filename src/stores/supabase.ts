import { defineStore } from 'pinia'
import log from 'loglevel'
import { supabase, selects } from '../supabase' // eslint-disable-line
import { Category, CollectionItem, Currency, Label, Liquor, Package } from '~/types'
import { mitt } from '~/mitt'
import { useMessage } from 'naive-ui'
import { isTemplateNode } from '.pnpm/@vue+compiler-core@3.2.19/node_modules/@vue/compiler-core'

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

  function selectCurrency() {
    const list = new Array<{ value: number, label: string }>()
    currencies.value.forEach(c => {
      list.push({
        value: c.id,
        label: c.symbol
      })
    })
    return list
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

  /* #region liquor */
  const liquors = ref(new Array<Liquor>())

  async function getLiquors() {
    const { data, error } = await supabase
      .from<Liquor>('liquor')
      .select()
      .order('name')
    if (error) {
      console.error(error.message)
      message.error(error.message)
      return liquors
    }
    liquors.value = data ? data : liquors.value
    return liquors
  }

  function filterLiqours(categoryId: number = 0, labelId: number = 0) {
    return liquors.value.filter(l => {
      if (categoryId > 0 && l.category != categoryId) return false
      if (labelId > 0 && l.label != labelId) return false
      return true
    })
  }

  function selectLiquors(categoryId: number = 0, labelId: number = 0) {
    const list = new Array<{ value: number, label: string | undefined }>()
    filterLiqours(categoryId = categoryId, labelId = labelId).forEach(l => {
      list.push({
        value: l.id,
        label: l.name
      })
    })
    return list
  }
  /* #endregion */

  /* #region package */
  const packages = ref(new Array<Package>())

  async function getPackages() {
    const { data, error } = await supabase
      .from<Package>('package')
      .select()
      .order('name')
    if (error) {
      log.error(error.message)
      message.error(error.message)
      return packages
    }
    packages.value = data ? data : packages.value
    return packages
  }

  function selectPackages() {
    const list = new Array<{ value: number, label: string }>()
    packages.value.forEach(p => {
      list.push({
        value: p.id,
        label: p.name
      })
    })
    return list
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
    await getLiquors()
    await getPackages()
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
    selectCurrency,
    categories,
    selectCategories,
    getCategories,
    addCategory,
    labels,
    selectLabels,
    getLabels,
    addLabel,
    liquors,
    getLiquors,
    filterLiqours,
    selectLiquors,
    packages,
    getPackages,
    selectPackages,
  }
})
