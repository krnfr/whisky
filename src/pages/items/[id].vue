<script setup lang="ts">
import { mitt } from '~/mitt'
import { useUserStore } from '~/stores/user'
import { useSupabaseStore } from '~/stores/supabase'
import InflationStatistic from '~/components/InflationStatistic.vue'
import ItemBreadcrumb from '~/components/ItemBreadcrumb.vue'
import PriceList from '~/components/PriceList.vue'

const props = defineProps<{ id: string }>()
const user = useUserStore()
const api = useSupabaseStore()
const router = useRouter()

const loading = ref(true)
const price = ref(0)

async function refresh() {
  loading.value = true
  await api.getCollectionItem(props.id)
  await updatePrice()
  loading.value = false
}

async function updatePrice() {
  price.value = await api.getAvgPrice(api.selectedItem?.liquor.id)
}

onMounted(async () => {
  await refresh()
})

mitt.on('update', refresh)
</script>

<template>
  <div v-if="!loading && api.selectedItem">
    <n-page-header
      :title="(api.selectedItem.liquor.name ? api.selectedItem.liquor.name : api.selectedItem.liquor.label.name) + (api.selectedItem.version ? ' - ' + api.selectedItem.version : '')"
      @back="router.back()"
    >
      <template #subtitle v-if="api.selectedItem.liquor.label && api.selectedItem.liquor.name">
        {{
          api.selectedItem.liquor.label.name
        }}
      </template>
      <template #header>
        <item-breadcrumb :value="api.selectedItem.liquor.id" />
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
        <owner-tag :owner-id="api.selectedItem.owner.id" />
      </n-space>
    </n-page-header>
    <n-space vertical>
      <n-grid cols="2 m:4">
        <n-gi v-if="api.selectedItem.purchase_date">
          <n-statistic label="Kaufdatum" :value="api.selectedItem.purchase_date" />
        </n-gi>
        <n-gi v-if="api.selectedItem.purchase_location">
          <n-statistic label="Kaufort" :value="api.selectedItem.purchase_location" />
        </n-gi>
        <n-gi v-if="api.selectedItem.purchase_price">
          <n-statistic label="Kaufpreis">
            <price-info
              convert
              :value="api.selectedItem.purchase_price"
              :currency="api.selectedItem.purchase_currency"
            />
          </n-statistic>
        </n-gi>
        <n-gi v-if="api.selectedItem.purchase_price && api.selectedItem.purchase_date">
          <inflation-statistic
            :value="api.selectedItem.purchase_price"
            :date="api.selectedItem.purchase_date"
            :currency="api.selectedItem.purchase_currency"
          />
        </n-gi>
        <n-gi>
          <n-statistic label="avg Preis">
            <n-text v-if="price">{{ price.toFixed(2) }} €</n-text>
            <n-text v-else depth="3">na</n-text>
          </n-statistic>
        </n-gi>
      </n-grid>
      <picture-group upload :item-id="api.selectedItem.id" :cover="api.selectedItem.cover" />
      <n-grid cols="2 m:3" :y-gap="10" :x-gap="10">
        <n-gi>
          <item-info-card :condition="api.selectedItem.condition" :notes="api.selectedItem.notes" />
        </n-gi>
        <n-gi>
          <package-card
            :package="api.selectedItem.package"
            :condition="api.selectedItem.package_rating"
            :notes="api.selectedItem.pack"
          />
        </n-gi>
        <n-gi>
          <storage-card :value="api.selectedItem.storage" />
        </n-gi>
      </n-grid>
      <n-card title="Preise">
        <template #header-extra v-if="price > 0">~ {{ price.toFixed(2) }} €</template>
        <price-list
          :value="api.selectedItem.liquor.id"
          :add="user.loggedIn"
          @on-update="updatePrice"
        />
      </n-card>
    </n-space>
  </div>
  <div v-else>
    <n-skeleton text :repeat="2" />
    <n-skeleton text style="width: 60%;" />
  </div>
</template>
