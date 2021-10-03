<script setup lang="ts">
import { useSupabaseStore } from "~/stores/supabase";

const props = defineProps<{ id: string }>()
const api = useSupabaseStore()
const router = useRouter()

api.getCollectionItem(props.id)
const item = ref(null)

onMounted(async () => {
  item.value = await api.getCollectionItem(props.id)
})

</script>

<template>
  <div v-if="item">
    <n-page-header :title="item.liquor.name" @back="router.go(-1)">
      <template #subtitle v-if="item.liquor.label">
        {{
          item.liquor.label.name
        }}
      </template>
      <template #avatar>
        <item-avatar :item="item.id" :image="item.cover" />
      </template>
      <n-space>
        <n-tag v-if="item.liquor.category.name" size="small">{{ item.liquor.category.name }}</n-tag>
        <public-tag :value="item.public" />
        <!-- <owner-tag v-if="item.owner" :value="item.owner.id" /> -->
      </n-space>
    </n-page-header>
    <n-space>
      <n-statistic v-if="item.purchase_date" label="Kaufdatum" :value="item.purchase_date" />
      <n-statistic v-if="item.purchase_location" label="Kaufort" :value="item.purchase_location" />
      <n-statistic v-if="item.purchase_price" label="Kaufpreis">
        <price-info convert :value="item.purchase_price" :currency="item.purchase_currency" />
      </n-statistic>
    </n-space>
  </div>
  <div v-else>
    <n-skeleton text :repeat="2" />
    <n-skeleton text style="width: 60%;" />
  </div>
</template>
