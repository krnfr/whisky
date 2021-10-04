<script setup lang="ts">
import { useSupabaseStore } from '~/stores/supabase';
import { useUserStore } from '~/stores/user';

const user = useUserStore()
const api = useSupabaseStore()
const router = useRouter()
if (!user.loggedIn) router.push('/items')

const current = ref(1) // TODO: set 1
const previous = ref(0)
const currentStatus = ref('')
const working = ref(false) // TODO: set false

function next() {
  // const temp = previos.value
  // previos.value = current.value

  current.value += 1
  working.value = false
}

const categoryId = ref(0)
const categoryName = computed(() => {
  const c = api.categories.find(i => i.id == categoryId.value)
  if (!c) return 'Unbekannt'
  return c.name
})
function handleCategorySelected(value: number = 0) {
  categoryId.value = value
  next()
}
async function handleCategoryAdd(name: string) {
  const c = await api.addCategory(name)
  if (c) {
    handleCategorySelected(c.id)
  }
}

const labelId = ref(0)
const labelName = computed(() => {
  const l = api.labels.find(i => i.id == labelId.value)
  if (!l) return 'Unbekannt'
  return l.name
})
function handleLabelSelected(value: number = 0) {
  labelId.value = value
  next()
}
async function handleLabelAdd(name: string) {
  const l = await api.addLabel(name)
  if (l) {
    handleCategorySelected(l.id)
  }
}

const liquorId = ref(0)
const liquorName = computed(() => {
  return api.liquors.find(i => i.id == liquorId.value).name
})
function handleLiquorSelected(value: number = 0) {
  liquorId.value = value
  next()
}

const opened = ref(false)
const condition = ref(0)
const packagingId = ref(null)
const packagingCondition = ref(0)

</script>

<template>
  <n-page-header title="Hinzufügen" @back="router.back()"></n-page-header>

  <n-steps :current="current" vertical id="steps">
    <n-step title="Kategorie">
      <card-select
        v-if="current == 1"
        class="step-item"
        :options="api.selectCategories()"
        :value="categoryId"
        :working="working"
        add
        simple
        skip
        @add="handleCategoryAdd"
        @skip="next"
        @on-update:value="handleCategorySelected"
      />
      <n-space v-else-if="current > 1">{{ categoryName }}</n-space>
    </n-step>
    <n-step title="Label">
      <card-select
        v-if="current == 2"
        class="step-item"
        :options="api.selectLabels()"
        :value="labelId"
        :working="working"
        add
        simple
        skip
        @skip="next"
        @add="handleLabelAdd"
        @on-update:value="handleLabelSelected"
      />
      <n-space v-else-if="current > 2">{{ labelName }}</n-space>
    </n-step>
    <n-step title="Liquor">
      <card-select
        v-if="current == 3"
        class="step-item"
        :options="api.selectLiquors(categoryId, labelId)"
        no-unknown
        add
        @save="handleLiquorAdd"
        @on-update:value="handleLiquorSelected"
      >
        <n-space vertical>
          <n-grid cols="2">
            <n-gi>
              <n-space>
                <n-form-item label="Kategorie">
                  <n-tag round>{{ categoryName }}</n-tag>
                </n-form-item>
                <n-form-item label="Label">
                  <n-tag round>{{ labelName }}</n-tag>
                </n-form-item>
              </n-space>
            </n-gi>
            <n-form-item-gi label="Name" required>
              <n-input />
            </n-form-item-gi>
            <n-form-item-gi label="Notizen" :span="2">
              <n-input type="textarea" />
            </n-form-item-gi>
          </n-grid>
        </n-space>
      </card-select>
      <n-space v-else-if="liquorId > 3">{{ liquorName }}</n-space>
    </n-step>
    <n-step title="Zustand">
      <step-card v-if="current == 4" class="step-item" skip @skip="next" :working="working">
        <n-grid cols="2">
          <n-form-item-gi label="Offen">
            <n-switch v-model:value="opened" />
          </n-form-item-gi>
          <n-form-item-gi label="Bewertung Zustand">
            <condition-rating v-model:value="condition" />
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
    <n-step title="Verpackung">
      <step-card v-if="current == 5" skip class="step-item" :working="working" @skip="next">
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
    <n-step title="Info">
      <step-card v-if="current == 6" class="step-item" skip @skip="next" :working="working">
        <n-grid cols="2" :x-gap="20">
          <n-form-item-gi label="Kaufort">
            <n-input type="text" />
          </n-form-item-gi>
          <n-form-item-gi label="Kaudatum">
            <n-date-picker date clearable />
          </n-form-item-gi>
          <n-form-item-gi label="Kaufpreis (in ct, pf etc)">
            <n-input-group>
              <n-input-number :show-button="false" min="0" placeholder="in cent oder pfenning" />
              <n-select
                style="width: 100px;"
                :options="api.selectCurrency()"
                clearable
                placeholder="€ , DM ..."
              />
            </n-input-group>
          </n-form-item-gi>
          <n-form-item-gi label="Notizen">
            <n-input type="textarea" />
          </n-form-item-gi>
        </n-grid>
      </step-card>
    </n-step>
    <n-step title="Besitzer">
      <card-select v-if="current == 7" class="step-item"></card-select>
    </n-step>
    <n-step title="Lagerort"></n-step>
    <n-step title="Bilder"></n-step>
  </n-steps>
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
