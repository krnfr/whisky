<script setup lang="ts">
import { mitt } from '~/mitt'
import { useSupabaseStore } from '~/stores/supabase'

const props = defineProps<{ id: string }>()
const api = useSupabaseStore()
const router = useRouter()

const loading = ref(true)

async function refresh() {
  loading.value = true
  await api.getCollectionItem(props.id)
  loading.value = false
}

onMounted(async () => {
  await refresh()
})

mitt.on('update', refresh)
</script>

<template>
  <div v-if="!loading && api.selectedItem">
    <n-page-header :title="api.selectedItem.liquor.name" @back="router.back()">
      <template #subtitle v-if="api.selectedItem.liquor.label">
        {{
          api.selectedItem.liquor.label.name
        }}
      </template>
      <template #avatar>
        <item-avatar :item="api.selectedItem.id" :image="api.selectedItem.cover" />
      </template>
      <n-space>
        <n-tag
          v-if="api.selectedItem.liquor.category.name"
          size="small"
        >{{ api.selectedItem.liquor.category.name }}</n-tag>
        <public-tag :value="api.selectedItem.public" />
        <!-- <owner-tag v-if="item.owner" :value="item.owner.id" /> -->
      </n-space>
    </n-page-header>
    <n-space vertical>
      <n-space>
        <n-statistic
          v-if="api.selectedItem.purchase_date"
          label="Kaufdatum"
          :value="api.selectedItem.purchase_date"
        />
        <n-statistic
          v-if="api.selectedItem.purchase_location"
          label="Kaufort"
          :value="api.selectedItem.purchase_location"
        />
        <n-statistic v-if="api.selectedItem.purchase_price" label="Kaufpreis">
          <price-info
            convert
            :value="api.selectedItem.purchase_price"
            :currency="api.selectedItem.purchase_currency"
          />
        </n-statistic>
      </n-space>
      <picture-group upload :item-id="api.selectedItem.id" :cover="api.selectedItem.cover" />
    </n-space>
  </div>
  <div v-else>
    <n-skeleton text :repeat="2" />
    <n-skeleton text style="width: 60%;" />
  </div>
</template>
