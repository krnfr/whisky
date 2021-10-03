<script setup lang="ts">
import { useSupabaseStore } from '~/stores/supabase';
import { CollectionItem, Picture } from '~/types';
import { supabase } from '~/supabase';
import { mitt } from '~/mitt'
import { useMessage } from 'naive-ui';

const api = useSupabaseStore()
const message = useMessage()

const list = ref(new Array<Picture>())
const selectList = computed(() => {
  const data = new Array<{ id: string, src: string }>()
  list.value.forEach((pic) => {
    data.push({
      id: pic.id,
      src: getSrc(pic.id)
    })
  })
  return data
})
const showSelectCover = ref(false)

const props = defineProps<{
  itemId: string,
  upload: boolean,
  cover: string,
}>()

async function loadList() {
  if (!props.itemId) return
  const { data, error } = await supabase.from<Array<Picture>>('picture').select().eq('collection', props.itemId)
  if (error) {
    message.error(error.message)
    return
  }
  if (data) list.value = data
}

async function deleteCover() {
  const { error } = await supabase.from<CollectionItem>('collection')
    .update({ cover: null })
    .match({ id: props.itemId })
  if (error) message.error(error.message)
  else {
    mitt.emit('update')
    showSelectCover.value = false
  }
}

async function setCover(id: string) {
  const { error } = await supabase.from<CollectionItem>('collection')
    .update({ cover: id })
    .match({ id: props.itemId })
  if (error) message.error(error.message)
  else {
    mitt.emit('update')
    showSelectCover.value = false
  }
}

loadList()

function getSrc(id: string) {
  return supabase.storage.from('pictures').getPublicUrl(`${props.itemId}/${id}.jpg`).publicURL
}

watch(
  () => [props.itemId],
  async () => { await loadList() }
)
mitt.on('update', loadList)
</script>

<template>
  <n-space vertical>
    <n-image-group>
      <n-space>
        <div v-for="pic in list" :key="pic.id">
          <n-image :src="getSrc(pic.id)" object-fit="cover" width="200" height="150" />
          <n-space class="image-tags" size="small">
            <n-tag v-if="pic.id == cover" size="small" round style="color: blue;">cover</n-tag>
            <n-tag v-if="pic.candid" size="small" round style="color: green;">candid</n-tag>
          </n-space>
        </div>
      </n-space>
    </n-image-group>
    <n-space justify="end">
      <n-button @click="showSelectCover = true">cover</n-button>
      <n-button v-if="props.upload">upload</n-button>
    </n-space>
    <n-modal v-model:show="showSelectCover">
      <n-card style="width: 85%; height: 65%;" title="Cover auswählen" :bordered="true" size="huge">
        <picture-select :list="selectList" @selected="(ctx) => setCover(ctx)" />
        <template #action>
          <n-space justify="end">
            <n-button @click="deleteCover" type="error">Löschen</n-button>
            <n-button @click="showSelectCover = false">Abbrechen</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </n-space>
</template>

<style>
.image-tags {
  position: relative;
  top: -150px;
  left: 5px;
}
</style>
