<script setup lang="ts">
import { useSupabaseStore } from '~/stores/supabase';
import { Picture } from '~/types';
import { supabase } from '~/supabase';
import { useMessage } from 'naive-ui';

const api = useSupabaseStore()
const message = useMessage()

const list = ref(new Array<Picture>())

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

loadList()

function getSrc(id: string) {
  return supabase.storage.from('pictures').getPublicUrl(`${props.itemId}/${id}.jpg`).publicURL
}

watch(
  () => [props.itemId],
  async () => { await loadList() }
)
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
      <!-- <n-button>cover</n-button> -->
      <n-button v-if="props.upload">upload</n-button>
    </n-space>
  </n-space>
</template>

<style>
.image-tags {
  position: relative;
  top: -150px;
  left: 5px;
}
</style>
