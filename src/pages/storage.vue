<script setup lang="ts">
import log from 'loglevel';
import { useMessage } from 'naive-ui';
import { useSupabaseStore } from '~/stores/supabase';
import { useUserStore } from '~/stores/user';
import { supabase } from '~/supabase';
import { Storage } from '~/types';

const user = useUserStore()
const router = useRouter()
if (!user.loggedIn) router.push('/items')

const message = useMessage();
const api = useSupabaseStore()
const list = computed(() => api.storage)
const working = ref(false)

async function changeStatus(id: string) {
  const status = list.value.find(i => i.id == id)?.full_recorded
  const { error } = await supabase.from<Storage>('storage')
    .update({ full_recorded: !status })
    .match({ id: id })
    .single()
  if (error) {
    log.error(error)
    message.error(error.message)
  }
  await api.getStorage()
}

async function changeLocation(id: string, evt: string) {
  const { error } = await supabase.from<Storage>('storage')
    .update({ location: evt })
    .match({ id: id })
  if (error) {
    log.error(error)
    message.error(error.message)
  }
  await api.getStorage()
}

const newItem = ref({ name: '', location: null })

async function addItem() {
  const { error } = await supabase.from('storage')
    .insert(newItem.value)
  if (error) {
    log.error(error)
    message.error(error.message)
  } else {
    newItem.value = { name: '', location: null }
  }
  await api.getStorage()
}

async function deleteItem(id: string) {
  const { error } = await supabase.from<Storage>('storage')
    .delete()
    .eq('id', id)
  if (error) {
    log.error(error)
    message.error(error.message)
  }
  await api.getStorage()
}

</script>

<template>
  <n-list>
    <n-list-item v-for="i in list">
      <n-thing :title="i.name">
        <template #header-extra>
          <n-tag
            v-if="i.full_recorded"
            type="primary"
            @click="changeStatus(i.id)"
          >fertig katalogisiert</n-tag>
          <n-tag v-else type="warning" @click="changeStatus(i.id)">nicht katalogisiert</n-tag>
        </template>
        <n-space justify="space-between">
          <n-select
            @update:value="(ctx) => changeLocation(i.id, ctx)"
            :value="i.location?.id"
            :options="api.selectStorage()"
            clearable
            filterable
          />
          <n-popconfirm @positive-click="deleteItem(i.id)">
            <template #trigger>
              <n-button type="error">Löschen</n-button>
            </template>
            Sicher?
          </n-popconfirm>
        </n-space>
      </n-thing>
    </n-list-item>
    <n-list-item>
      <n-form :disabled="working">
        <n-form-item label="Name" required>
          <n-input v-model:value="newItem.name" />
        </n-form-item>
        <n-form-item label="Ort">
          <n-select v-model:value="newItem.location" :options="api.selectStorage()" />
        </n-form-item>
      </n-form>
      <template #suffix>
        <n-button
          :loading="working"
          type="primary"
          @click="addItem"
          :disabled="!newItem.name"
        >Hinzufügen</n-button>
      </template>
    </n-list-item>
  </n-list>
</template>
