<script setup lang="ts">
import { useMessage } from "naive-ui"
import { useSupabaseStore } from "~/stores/supabase"
import { useUserStore } from "~/stores/user"
import { CollectionItem } from "~/types"

const router = useRouter()
const user = useUserStore()
const api = useSupabaseStore()
const message = useMessage()

const selectedCategory = ref(null)
const selectedLabel = ref(null)
const onlySell = ref(false)

const props = defineProps<{
  items: Array<CollectionItem>,
  noFilter: boolean,
}>()


const list = computed(() => {
  let r = props.items
  if (onlySell.value) r = r.filter(i => i.sell)
  if (selectedCategory.value) r = r.filter(i => i.liquor?.category?.id == selectedCategory.value)
  if (selectedLabel.value) r = r.filter(i => i.liquor?.category?.id == selectedLabel.value)
  return r
})

function handleWishlist(item: CollectionItem) {
  message.info(`${api.getItemName(item.id)} hinzugefügt`)
}
</script>

<template class="m-5 p-3">
  <n-space vertical>
    <n-page-header title="Sammlung" @back="() => null">
      <n-grid v-if="!noFilter" cols="3" class="p-3">
        <n-form-item-gi label="Kategory" class="w-50">
          <n-select
            v-model:value="selectedCategory"
            :options="api.selectCategories()"
            filterable
            clearable
          />
        </n-form-item-gi>
        <n-form-item-gi label="Label" class="w-50">
          <n-select
            v-model:value="selectedLabel"
            :options="api.selectLabels()"
            filterable
            clearable
          />
        </n-form-item-gi>
        <n-form-item-gi label="Nur Verkaufbar">
          <n-switch v-model:value="onlySell" />
        </n-form-item-gi>
      </n-grid>
    </n-page-header>
    <n-grid cols="1 m:3 xl:6" :x-gap="10" :y-gap="10" responsive="screen">
      <template v-for="i in list">
        <n-gi v-if="user.loggedIn || i.public">
          <n-card class="h-full" @click="router.push('/items/' + i.id)">
            <n-thing :key="i.id">
              <template #header>
                <n-space>
                  <n-text
                    strong
                    depth="2"
                  >{{ (i.liquor.name ? i.liquor.name : i.liquor.label.name) + (i.version ? ' - ' + i.version : '') + (i.year ? (' (' + i.year + ')') : '') }}</n-text>
                  <n-tag v-if="i.sell" type="primary" size="small">zu verkaufen</n-tag>
                </n-space>
              </template>
              <template #avatar>
                <item-avatar size="large" :item="i.id" :image="i.cover" />
              </template>
              <template #header-extra>
                <n-space justify="end">
                  <n-button text @click="handleWishlist(i)">
                    <n-icon size="24" color="orange">
                      <mdi-star />
                    </n-icon>
                    <n-icon size="24" color="gray">
                      <mdi-star-outline />
                    </n-icon>
                  </n-button>
                </n-space>
              </template>
              <template #description v-if="i.liquor.label">
                <n-space justify="space-between">
                  <n-text>
                    {{
                      i.liquor.label.name
                    }}
                  </n-text>

                  <category-tag :category="i.liquor.category" />
                </n-space>
              </template>
              <!-- {{ i.id }} -->
            </n-thing>
          </n-card>
        </n-gi>
      </template>
    </n-grid>
  </n-space>
</template>
