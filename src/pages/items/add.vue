<script setup lang="ts">
import { useMessage } from 'naive-ui'
import log from 'loglevel'
import { DateTime } from 'luxon'
import { useSupabaseStore } from '~/stores/supabase'
import { useUserStore } from '~/stores/user'
import { supabase } from '~/supabase'
import { CollectionItem } from '~/types'
import { useVueScrollTo } from '~/use'

const user = useUserStore()
const router = useRouter()
if (!user.loggedIn) router.push('/items')

const api = useSupabaseStore()
const message = useMessage()
const scroll = useVueScrollTo()

const current = ref(1) //! set 1
const previous = ref(0)
const currentStatus = ref('')
const working = ref(false) //! set false
const startWorking = () => working.value = true
function haveItoStartToWork(ding: any = true): boolean {
  if (ding) {
    startWorking()
    return true
  }
  messageMissing()
  return false
}

function reportError(error: any) {
  if (!error) return
  log.error(error)
  message.error(error.message)
}

function next() {
  // const temp = previos.value
  // previos.value = current.value

  current.value += 1
  working.value = false
}

const categoryId = ref(0)
async function handleCategoryAdd(name: string) {
  if (!haveItoStartToWork(name)) return
  const c = await api.addCategory(name)
  if (!c?.id) return
  categoryId.value = c.id
  next()
}

const labelId = ref(0)
async function handleLabelAdd(name: string) {
  if (!haveItoStartToWork(name)) return
  const l = await api.addLabel(name)
  if (!l?.id) return
  labelId.value = l.id
  next()
}

const liquorId = ref(0)
const liquorName = ref('')
const liquorNotes = ref('')
async function handleLiquorAdd() {
  haveItoStartToWork()
  const l = await api.addLiquor(liquorName.value, categoryId.value, labelId.value, liquorNotes.value)
  if (!l?.id) return
  liquorId.value = l.id
  next()
}

const itemId = ref('') //! to ''
const itemNotes = ref('')
const itemVersion = ref('')
const opened = ref(false)
const condition = ref(0)
const year = ref(null)
const lot = ref('')
async function handleItemAdd() {
  haveItoStartToWork()
  const { data, error } = await supabase
    .from<CollectionItem>('collection')
    .insert({
      liquor: liquorId.value ?? null,
      open: opened.value,
      condition: condition.value ?? null,
      notes: itemNotes.value ?? null,
      version: itemVersion.value ?? null,
      year: year.value ?? null,
      lot: lot.value ?? null
    })
    .single()
  if (error) {
    log.error(error)
    message.error(error.message)
    return
  }
  itemId.value = data?.id ?? ''
  api.getCollectionItem(itemId.value)
  api.getCollection()
  next()
}

const packagingId = ref(null)
const packagingCondition = ref(0)
async function handlePackagingAdd() {
  haveItoStartToWork()
  const { error } = await supabase
    .from<CollectionItem>('collection')
    .update({
      package: packagingId.value ?? null,
      package_rating: packagingCondition.value ?? null
    }).match({ id: itemId.value })
    .single()
  if (error) return reportError(error)
  next()
}

const purchaseLocation = ref('')
const purchaseMillis = ref(null)
const purchasePrice = ref(null)
const purchaseCurrency = ref(null)
const purchaseNotes = ref('')
async function handleAddInfo() {
  haveItoStartToWork()
  const { error } = await supabase
    .from<CollectionItem>('collection')
    .update({
      purchase_location: purchaseLocation.value ?? null,
      purchase_date: purchaseMillis.value ? DateTime.fromMillis(purchaseMillis.value).toISO() : null,
      purchase_price: purchasePrice.value ?? null,
      purchase_currency: purchaseCurrency.value ?? null,
      purchase_notes: purchaseNotes.value ?? null
    }).match({ id: itemId.value })
    .single()
  if (error) return reportError(error)
  next()
}

const ownerId = ref('')
async function handleOwnerAdd(name: string) {
  if (!haveItoStartToWork(name)) return
  const o = await api.addOwner(name)
  if (!o?.id) return
  ownerId.value = o.id
  await handleOwnerSelected()
}
async function handleOwnerSelected(id: string = ownerId.value) {
  haveItoStartToWork()
  const { error } = await supabase
    .from<CollectionItem>('collection')
    .update({
      owner: id ?? null
    }).match({ id: itemId.value })
    .single()
  if (error) return reportError(error)
  next()
}

const storageId = ref('')
const storageLocation = ref('')
const storageName = ref('')
const storageNotes = ref('')
function resetStorage() {
  storageLocation.value = ''
  storageName.value = ''
  storageNotes.value = ''

  working.value = false
}
async function handleStorageAdd() {
  if (!haveItoStartToWork(storageName.value)) return
  const s = await api.addStorage({
    name: storageName.value,
    location: storageLocation.value,
    notes: storageNotes.value
  })
  if (!s?.id) return
  storageId.value = s.id
  resetStorage()
}
async function handleStorageSelected() {
  if (!haveItoStartToWork(storageId.value)) return
  const { error } = await supabase
    .from<CollectionItem>('collection')
    .update({ storage: storageId.value })
    .match({ id: itemId.value })
  if (error) return reportError(error)
  next()
}

const messageMissing = () => message.warning("Bitte alle erforderlichen Felder ausfüllen!")

watch(
  () => [current.value],
  () => (i: number) => { if (i) scroll(`#step-${i}`) }
)

</script>

<template>
  <n-page-header title="Hinzufügen" @back="router.back()" :subtitle="itemId"></n-page-header>
  <n-space vertical size="large">
    <n-steps :current="current" vertical id="steps">
      <n-step title="Kategorie" id="step-1">
        <card-select
          v-if="current == 1"
          class="step-item"
          v-model:value="categoryId"
          :options="api.selectCategories()"
          :working="working"
          add
          simple
          skip
          @skip="next"
          @add="handleCategoryAdd"
          @on-update:value="next"
        />
        <n-space v-else-if="current > 1">{{ api.getCategoryName(categoryId) }}</n-space>
      </n-step>

      <n-step title="Label" id="step-2">
        <card-select
          v-if="current == 2"
          class="step-item"
          v-model:value="labelId"
          :options="api.selectLabels()"
          :working="working"
          add
          simple
          skip
          @skip="next"
          @on-update:value="next"
          @add="handleLabelAdd"
        />
        <n-space v-else-if="current > 2">{{ api.getLabelName(labelId) }}</n-space>
      </n-step>

      <n-step title="Liquor" id="step-3">
        <card-select
          v-if="current == 3"
          class="step-item"
          v-model:value="liquorId"
          :options="api.selectLiquors(categoryId, labelId)"
          no-unknown
          add
          @add="handleLiquorAdd"
          @on-update:value="next"
        >
          <n-space vertical>
            <n-grid cols="2">
              <n-gi>
                <n-space>
                  <n-form-item label="Kategorie">
                    <n-tag round>{{ api.getCategoryName(categoryId) }}</n-tag>
                  </n-form-item>
                  <n-form-item label="Label">
                    <n-tag round>{{ api.getLabelName(labelId) }}</n-tag>
                  </n-form-item>
                </n-space>
              </n-gi>
              <n-form-item-gi label="Name">
                <n-input v-model:value="liquorName" />
              </n-form-item-gi>
              <n-form-item-gi label="Notizen" :span="2">
                <n-input type="textarea" v-model:value="liquorNotes" />
              </n-form-item-gi>
            </n-grid>
          </n-space>
        </card-select>
        <n-space v-else-if="liquorId > 3">{{ liquorName }}</n-space>
      </n-step>

      <n-step title="Neues Item" id="step-4">
        <step-card v-if="current == 4" class="step-item" :working="working" @save="handleItemAdd">
          <n-grid cols="2" :x-gap="20">
            <n-form-item-gi label="Offen">
              <n-switch v-model:value="opened" />
            </n-form-item-gi>
            <n-form-item-gi label="Bewertung Zustand">
              <condition-rating v-model:value="condition" />
            </n-form-item-gi>
            <n-form-item-gi label="Version">
              <n-input v-model:value="itemVersion" placeholder="V.S.O.P, *** ..." />
            </n-form-item-gi>
            <n-form-item-gi label="Jahr">
              <n-input-number v-model:value="year" :show-button="false" />
            </n-form-item-gi>
            <n-form-item-gi label="Lot">
              <n-input v-model:value="lot" placeholder="lot" />
            </n-form-item-gi>
            <n-form-item-gi label="Notizen">
              <n-input v-model:value="itemNotes" type="textarea" />
            </n-form-item-gi>
          </n-grid>
        </step-card>
        <div v-else-if="current > 4">
          <span v-if="opened">Offen</span>
          <span v-if="opened && condition > 0">&nbsp;-&nbsp;</span>
          <span v-if="condition > 0">
            {{ condition }}
            <mdi-star style="font-size: 1em; margin-bottom: -3;" />
          </span>
        </div>
      </n-step>

      <n-step title="Verpackung" id="step-5">
        <step-card
          v-if="current == 5"
          skip
          class="step-item"
          :working="working"
          @skip="next"
          @save="handlePackagingAdd"
        >
          <n-grid cols="2" :x-gap="20">
            <n-form-item-gi label="Packungsart">
              <n-select v-model:value="packagingId" :options="api.selectPackages()" clearable />
            </n-form-item-gi>
            <n-form-item-gi label="Packungszustand">
              <condition-rating v-model:value="packagingCondition" />
            </n-form-item-gi>
          </n-grid>
        </step-card>
      </n-step>

      <n-step title="Info" id="step-6">
        <step-card
          v-if="current == 6"
          class="step-item"
          skip
          @skip="next"
          :working="working"
          @save="handleAddInfo"
        >
          <n-grid cols="2" :x-gap="20">
            <n-form-item-gi label="Kaufort">
              <n-input v-model:value="purchaseLocation" />
            </n-form-item-gi>
            <n-form-item-gi label="Kaudatum">
              <n-date-picker v-model:value="purchaseMillis" date clearable />
            </n-form-item-gi>
            <n-form-item-gi label="Kaufpreis (in ct, pf etc)">
              <n-input-group>
                <n-input-number
                  v-model:value="purchasePrice"
                  :show-button="false"
                  min="0"
                  placeholder="in cent oder pfenning"
                />
                <n-select
                  v-model:value="purchaseCurrency"
                  style="width: 100px;"
                  :options="api.selectCurrency()"
                  clearable
                  placeholder="€ , DM ..."
                />
              </n-input-group>
            </n-form-item-gi>
            <n-form-item-gi label="Notizen">
              <n-input v-model:value="purchaseNotes" type="textarea" />
            </n-form-item-gi>
          </n-grid>
        </step-card>
      </n-step>

      <n-step title="Besitzer" id="step-7">
        <card-select
          v-if="current == 7"
          class="step-item"
          v-model:value="ownerId"
          :options="api.selectOwner()"
          :working="working"
          add
          simple
          skip
          @skip="next"
          @add="handleOwnerAdd"
          @on-update:value="handleOwnerSelected"
        />
      </n-step>

      <n-step title="Lagerort" id="step-8">
        <card-select
          v-if="current == 8"
          class="step-item"
          v-model:value="storageId"
          :options="api.selectStorage()"
          :working="working"
          add
          next
          skip
          @skip="next"
          @add="handleStorageAdd"
          @continue="handleStorageSelected"
        >
          <n-grid cols="2" :x-gap="20">
            <n-form-item-gi label="Name" required>
              <n-input v-model:value="storageName" />
            </n-form-item-gi>
            <n-form-item-gi label="Ort">
              <n-select
                v-model:value="storageLocation"
                :options="api.selectStorage()"
                clearable
                filterable
              />
            </n-form-item-gi>
            <n-form-item-gi label="Notizen" span="2">
              <n-input v-model:value="storageNotes" type="textarea" />
            </n-form-item-gi>
          </n-grid>
        </card-select>
      </n-step>

      <n-step title="Bilder" id="step-9">
        <picture-group :item-id="itemId" v-if="current == 9" upload />
      </n-step>
    </n-steps>

    <n-space size="large" justify="center">
      <n-button type="warning" size="large" @click="router.go(0)">Neu</n-button>
      <n-button
        type="primary"
        size="large"
        @click="router.push('/items/' + itemId)"
        :disabled="!itemId"
      >Fertig & Weiter</n-button>
    </n-space>
  </n-space>
</template>

<style>
#steps {
  margin: 5px;
  padding-right: 10px;
}

.select,
.step-item {
  margin-right: 10px;
}
</style>
