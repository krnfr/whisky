<script setup lang="ts">
import log from 'loglevel';
import { useMessage } from 'naive-ui';
import { useSupabaseStore } from '~/stores/supabase';
import { supabase } from '~/supabase';
import { Price } from '~/types';

const emit = defineEmits(['on-update'])
const props = defineProps<{
  value: string,
  add?: boolean
}>()

const message = useMessage()
const s = useSupabaseStore()

const list = ref(new Array<Price>())
const working = ref(false)

const price = ref(null)
const notes = ref('')
const url = ref('')

async function addPrice() {
  const { data, error } = await supabase
    .from<Price>('price')
    .insert({
      liquor: props.value,
      price: price.value,
      notes: notes.value ? notes.value : null,
      link: url.value ? url.value : null
    }).single()
  if (error) {
    log.error(error)
    message.error(error.message)
    return
  }
  list.value.push(data)
  emit('on-update')
}

async function deletePrice(id: number) {
  const { error } = await supabase
    .from('price')
    .delete()
    .eq('id', id)
  if (error) {
    log.error(error)
    message.error(error.message)
    return
  }
  emit('on-update')
  list.value = list.value.filter(p => p.id != id)
}

onMounted(async () => {
  list.value = await s.getPrices(props.value)
})

</script>

<template>
  <n-space vertical>
    <n-card v-for="p in list" :key="p.id" size="small" class="w-full">
      <n-space class="max-w-full">
        <n-space vertical>
          <n-p class="whitespace-nowrap max-w-2/3">
            <n-text strong>{{ p.price }} €</n-text>
            <n-text v-if="p.link">
              <n-text depth="3">&nbsp;@&nbsp;</n-text>
              <n-ellipsis>
                <template #tooltip>{{ p.link }}</template>
                <n-a :href="p.link" target="_blank">{{ p.link }}</n-a>
              </n-ellipsis>
            </n-text>
          </n-p>
          <n-text v-if="p.notes">{{ p.notes }}</n-text>
        </n-space>
        <n-space justify="end">
          <n-button text type="error" @click="deletePrice(p.id)">
            <n-icon>
              <mdi-delete />
            </n-icon>
          </n-button>
        </n-space>
      </n-space>
    </n-card>
    <n-empty v-if="list.length < 1" description="Keine Preise">
      <template #icon>
        <n-icon>
          <mdi-cash-multiple />
        </n-icon>
      </template>
    </n-empty>
    <n-card v-if="add" title="Neuer Preis" size="small">
      <n-spin :show="working">
        <n-grid cols="2" :x-gap="10" :y-gap="10">
          <n-gi>
            <n-form-item label="Preis" required>
              <n-input-number v-model:value="price" :min="1" :show-button="false" class="w-full">
                <template #suffix>€</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="Url">
              <n-input v-model:value="url" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="Notizen">
              <n-input type="textarea" v-model:value="notes" />
            </n-form-item>

            <n-space justify="end">
              <n-button :disabled="!price || working" type="success" @click="addPrice">Speichern</n-button>
            </n-space>
          </n-gi>
        </n-grid>
      </n-spin>
    </n-card>
  </n-space>
</template>
