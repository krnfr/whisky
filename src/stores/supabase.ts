import { defineStore } from 'pinia'
import log, { debug } from 'loglevel'
import { supabase, selects } from '../supabase' // eslint-disable-line
import { Category, CollectionItem, Currency, Label, Liquor, Owner, Package, Price, Storage } from '~/types'
import { mitt } from '~/mitt'
import { useMessage } from 'naive-ui'

const message = useMessage()

export const useSupabaseStore = defineStore('supabase', () => {
  /* #region collection */
  const collection = ref(new Array<CollectionItem>())
  const selectedItem = ref<CollectionItem>()

  async function getCollection() {
    const { data, error } = await supabase.from<CollectionItem>('collection').select(selects.item)
    if (error) {
      log.error(error)
      message.error(error.message)
      return collection
    }
    else {
      collection.value = data ? data : collection.value
      return collection.value.sort((a, b) => {
        const labelA = a.label?.name.toUpperCase()
        const liquorA = a.liquor?.name.toUpperCase()
        const labelB = b.label?.name.toUpperCase()
        const liquorB = b.liquor?.name.toUpperCase()

        // sort by name
        if (liquorA && liquorB) {
          if (liquorA < liquorB) return -1
          if (liquorA > liquorB) return 1
        }
        // sort by liquor name
        if (labelA && labelB) {
          if (labelA < labelB) return -1
          if (labelA > labelB) return 1
        }

        // TODO: more sorting
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

  const getCategoryName = (id: number) => categories.value.find(c => c.id == id)?.name ?? 'Unbekannt'
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

  const getLabelName = (id: number) => labels.value.find(l => l.id == id)?.name ?? 'Unbekannt'
  /* #endregion */

  /* #region liquor */
  const liquors = ref(new Array<Liquor>())

  async function getLiquors() {
    const { data, error } = await supabase
      .from<Liquor>('liquor')
      .select(selects.liquor)
      .order('name') // TODO: better ordering
    if (error) {
      console.error(error)
      message.error(error.message)
      return liquors
    }
    liquors.value = data ? data : liquors.value
    return liquors
  }

  function filterLiqours(categoryId: number = 0, labelId: number = 0) {
    log.debug(`supabase: filter liquors category: ${categoryId}, label: ${labelId}`)
    const list = liquors.value.filter(l => {
      if (categoryId && l.category?.id != categoryId) return
      if (labelId && l.label?.id != labelId) return
      return l
    })
    return list
  }

  function selectLiquors(categoryId: number = 0, labelId: number = 0) {
    const list = new Array<{ value: number, label: string | undefined }>()
    filterLiqours(categoryId = categoryId, labelId = labelId).forEach(l => {
      list.push({
        value: l.id,
        label: (l.name ? l.name : (l.label?.name ?? 'Unbekannt'))
      })
    })
    return list
  }

  async function addLiquor(name: string = '', category: number = 0, label: number = 0, notes: string = '') {
    const { data, error } = await supabase
      .from('liquor')
      .insert({
        name: name ?? null,
        category: category ?? null,
        label: label ?? null,
        notes: notes ?? null
      }).single()
    if (error) {
      log.error(error)
      message.error(error.message)
      return null
    }
    await getLiquors()
    return data
  }

  const getLiquorName = (id: number) => liquors.value.find(l => l.id == id)?.name ?? 'ERROR'
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

  /* #region owner */
  const owners = ref(new Array<Owner>())

  async function getOwners() {
    const { data, error } = await supabase
      .from<Owner>('owner')
      .select()
      .order('name')
    if (error) {
      log.error(error.message)
      message.error(error.message)
      return owners
    }
    owners.value = data ? data : owners.value
    return owners
  }

  function selectOwner() {
    const list = new Array<{ value: string, label: string }>()
    owners.value.forEach(p => {
      list.push({
        value: p.id,
        label: p.name
      })
    })
    return list
  }

  async function addOwner(name: string) {
    const { data, error } = await supabase
      .from<Owner>('owner')
      .insert({ name: name })
      .single()
    if (error) {
      log.error(error)
      message.error(error.message)
      return null
    }
    await getOwners()
    return data
  }
  /* #endregion */

  /* #region storage */
  const storage = ref(new Array<Storage>())

  async function getStorage() {
    const { data, error } = await supabase
      .from<Storage>('storage')
      .select(selects.storage)
      .order('name')
    if (error) {
      log.error(error.message)
      message.error(error.message)
      return storage
    }
    storage.value = data ? data : storage.value
    return storage
  }

  function selectStorage() {
    const list = new Array<{ value: string, label: string, sublabel?: string | null }>()
    storage.value.forEach(s => {
      list.push({
        value: s.id,
        label: s.name,
        sublabel: s.location ? s.location.name : null
      })
    })
    return list
  }

  async function addStorage({ name, location, notes, owner }: { name: string; location: string; notes: string; owner: string }) {
    const { data, error } = await supabase
      .from<Storage>('storage')
      .insert({
        name: name,
        notes: notes ? notes : null,
        location: location ? location : null,
        owner: owner ? owner : null,
      })
      .single()
    log.debug(error)
    log.debug(data)
    if (error) {
      log.error(error)
      message.error(error.message)
      return null
    }
    await getStorage()
    return data
  }
  /* #endregion */

  /* #region prices */
  async function getPrices(id: string) {
    const { data, error } = await supabase
      .from<Price>('price')
      .select()
      .eq('liquor', id)
    if (error) {
      log.error(error)
      message.error(error.message)
    } else return data
  }

  async function getAvgPrice(id: string) {
    var price = 0
    const prices = await getPrices(id)
    if (!prices || prices.length < 1) return null

    prices.forEach(p => { price += p.price })
    return price = price / prices.length
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
    await getOwners()
    await getStorage()
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
    getCategoryName,
    addCategory,
    labels,
    selectLabels,
    getLabels,
    getLabelName,
    addLabel,
    liquors,
    getLiquors,
    getLiquorName,
    filterLiqours,
    selectLiquors,
    addLiquor,
    packages,
    getPackages,
    selectPackages,
    owners,
    getOwners,
    selectOwner,
    addOwner,
    storage,
    getStorage,
    selectStorage,
    addStorage,
    getPrices,
    getAvgPrice,
  }
})
