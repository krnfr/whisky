<script setup lang="ts">
import log from 'loglevel'
import { useMessage } from 'naive-ui'
import Compressor from 'compressorjs'
import { useSupabaseStore } from '~/stores/supabase'
import { CollectionItem, Picture } from '~/types'
import { supabase } from '~/supabase'
import { mitt } from '~/mitt'
import { useUserStore } from '~/stores/user'

const api = useSupabaseStore()
const user = useUserStore()
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
const uploadDisabled = ref(false)

const props = defineProps<{
  itemId: string,
  upload?: boolean,
  cover?: string,
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

async function handleImages({ file }) {
  uploadDisabled.value = true
  let pic: File | Blob = file.file
  let thumb: File | Blob
  async function upload(pic: File | Blob, thumb: File | Blob) {
    const { data: dbData, error: dbError } = await supabase
      .from<Picture>('picture')
      .insert({ collection: props.itemId })
      .single()
    if (dbError) {
      uploadDisabled.value = false
      return message.error(dbError.message)
    }
    const id = dbData.id
    const options = { cacheControl: '3600', upsert: false }

    var { error } = await supabase.storage
      .from('pictures')
      .upload(`${props.itemId}/${id}.jpg`, pic, options)
    if (error) {
      uploadDisabled.value = false
      return message.error(error.message)
    }

    var { error } = await supabase.storage
      .from('pictures')
      .upload(`${props.itemId}/${id}-thumb.jpg`, thumb, options)
    if (error) {
      uploadDisabled.value = false
      return message.error(error.message)
    }
    await loadList()
    uploadDisabled.value = false
  }

  new Compressor(pic, {
    maxHeight: 1500,
    maxWidth: 1500,
    mimeType: 'image/jpeg',
    success(result) {
      log.debug('pic generated')
      pic = result

      new Compressor(pic, {
        maxHeight: 250,
        maxWidth: 250,
        // quality: 0.6,
        async success(result) {
          log.debug('thumb generated')
          thumb = result
          await upload(pic, thumb)
        },
        error(error) {
          message.error(error.message)
          uploadDisabled.value = false
        }
      })
    },
    error(error) {
      message.error(error.message)
      uploadDisabled.value = false
    }
  })
  return false
}

async function handleDelete(id: string) {
  log.debug('deleting ' + id)
  const { error: storageError } = await supabase.storage
    .from('pictures')
    .remove([`${props.itemId}/${id}.jpg`, `${props.itemId}/${id}-thumb.jpg`])
  if (storageError) {
    message.warning(storageError.message)
    return
  }
  const { error } = await supabase
    .from('picture')
    .delete()
    .match({ id: id })
  if (error) message.error(error.message)

  await loadList()
}

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
      <n-grid cols="2 s:3 m:4 l:5 xl:6 2xl:7" :x-gap="10" :y-gap="10">
        <n-gi v-if="user.loggedIn && !cover" class="gi">
          <n-button
            dashed
            type="warning"
            class="w-full h-full"
            @click="showSelectCover = true"
          >Set Cover</n-button>
        </n-gi>
        <n-gi v-for="pic in list" :key="pic.id" class="gi">
          <n-image :src="getSrc(pic.id)" object-fit="cover" />
          <n-space align="center" class="image-tags" size="small">
            <n-button v-if="user.loggedIn" @click="handleDelete(pic.id)" size="small" type="error">
              <n-icon>
                <mdi-delete />
              </n-icon>
            </n-button>
            <n-tag v-if="pic.id == cover" size="small" round style="color: blue;">cover</n-tag>
            <n-tag v-if="pic.candid" size="small" round style="color: green;">candid</n-tag>
          </n-space>
        </n-gi>
        <n-gi v-if="props.upload && user.loggedIn" class="gi">
          <n-upload
            abstract
            :show-file-list="false"
            accept="image/jpeg, image/png;capture=camera"
            @before-upload="handleImages"
            :disabled="uploadDisabled"
          >
            <n-upload-trigger #="{ handleClick }" abstract>
              <n-button
                @click="handleClick"
                :disabled="uploadDisabled"
                dashed
                size="large"
                class="w-full h-2/3"
              >
                <n-space vertical justify="center">
                  <n-spin v-if="uploadDisabled" />
                  <span v-else>
                    <n-icon size="25" :depth="2">
                      <mdi-image-search />
                    </n-icon>
                    <n-icon :depth="3" size="25">
                      <mdi-plus />
                    </n-icon>
                    <n-icon size="25" :depth="2">
                      <mdi-camera-outline />
                    </n-icon>
                  </span>
                  <n-text :depth="2">Bild hochladen</n-text>
                </n-space>
              </n-button>
            </n-upload-trigger>
          </n-upload>
          <div class="h-1/3 pt-2">
            <n-button
              type="info"
              size="large"
              class="w-full h-full"
              @click="showSelectCover = true"
            >Cover</n-button>
          </div>
        </n-gi>
      </n-grid>
    </n-image-group>

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

.gi {
  height: 150px;
  width: 100%;
}
</style>
