<script setup lang="ts">
import { useMessage } from 'naive-ui';
import { useSupabaseStore } from '~/stores/supabase';
import { useUserStore } from '~/stores/user';

const user = useUserStore()
const router = useRouter()
if (!user.loggedIn) router.push('/items')

const api = useSupabaseStore()
const message = useMessage()

const current = ref(1) // TODO: set 1
const previous = ref(0)
const currentStatus = ref('')
const working = ref(false) // TODO: set false
const startWorking = () => working.value = true
function haveItoStartToWork(ding: any): boolean {
  if (ding) {
    startWorking()
    return true
  }
  messageMissing()
  return false
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
  if (!haveItoStartToWork(liquorName.value)) return
  const l = await api.addLiquor(liquorName.value, categoryId.value, labelId.value, liquorNotes.value)
  if (!l?.id) return
  liquorId.value = l.id
  next()
}

const opened = ref(false)
const condition = ref(0)
const packagingId = ref(null)
const packagingCondition = ref(0)
const ownerId = ref('')
const storageId = ref('')

const messageMissing = () => message.warning("Bitte alle erforderlichen Felder ausfüllen!")

</script>

<template>
  <n-page-header title="Hinzufügen" @back="router.back()"></n-page-header>
  <n-space vertical size="large">
    <n-steps :current="current" vertical id="steps">
      <n-step title="Kategorie">
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

      <n-step title="Label">
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

      <n-step title="Liquor">
        <card-select
          v-if="current == 3"
          class="step-item"
          v-model:value="liquorId"
          :options="api.selectLiquors(categoryId, labelId)"
          no-unknown
          add
          @save="handleLiquorAdd"
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
              <n-form-item-gi label="Name" required>
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

      <n-step title="Zustand">
        <step-card v-if="current == 4" class="step-item" :working="working">
          <n-grid cols="2">
            <n-form-item-gi label="Offen">
              <n-switch v-model:value="opened" />
            </n-form-item-gi>
            <n-form-item-gi label="Bewertung Zustand">
              <condition-rating v-model:value="condition" />
            </n-form-item-gi>
            <n-form-item-gi label="Notizen" span="2">
              <n-input type="textarea" />
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
        <card-select
          v-if="current == 7"
          class="step-item"
          :options="api.selectOwner()"
          :value="ownerId"
          add
          simple
          skip
          @skip="next"
          @on-update:value="handleOwnerSelected"
        />
      </n-step>

      <n-step title="Lagerort">
        <card-select
          v-if="current == 8"
          class="step-item"
          :options="api.selectStorage()"
          v-model:value="storageId"
          add
          skip
          @skip="next"
        >
          <n-grid cols="2" :x-gap="20">
            <n-form-item-gi label="Name" required>
              <n-input />
            </n-form-item-gi>
            <n-form-item-gi label="Ort">
              <n-select :options="api.selectStorage()" clearable filterable />
            </n-form-item-gi>
            <n-form-item-gi label="Notizen" span="2">
              <n-input type="textarea" />
            </n-form-item-gi>
          </n-grid>
        </card-select>
      </n-step>

      <n-step title="Bilder">
        <picture-group v-if="current == 9" upload />
      </n-step>
    </n-steps>

    <n-space size="large" justify="center">
      <n-button type="warning" size="large">Neu</n-button>
      <n-button type="primary" size="large">Fertig & Weiter</n-button>
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
