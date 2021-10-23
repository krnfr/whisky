<script setup lang="ts">
import { mitt } from '~/mitt'
import { useUserStore } from '~/stores/user'
import { useSupabaseStore } from '~/stores/supabase'
import InflationStatistic from '~/components/InflationStatistic.vue'
import ItemBreadcrumb from '~/components/ItemBreadcrumb.vue'
import PriceList from '~/components/PriceList.vue'
import { CollectionItem } from '~/types'
import log from 'loglevel'
import { useMessage } from 'naive-ui'
import { supabase } from '~/supabase'

const props = defineProps<{ id: string }>()
const user = useUserStore()
const api = useSupabaseStore()
const router = useRouter()
const message = useMessage()
const s = supabase

const loading = ref(true)
const price = ref(0)

const item = computed(() => api.selectedItem)

async function refresh() {
  loading.value = true
  await api.getCollectionItem(props.id)
  await updatePrice()
  loading.value = false
}

async function updatePrice() {
  price.value = await api.getAvgPrice(api.selectedItem?.liquor.id)
}

async function setPublic() {
  const { error } = await s.from<CollectionItem>('collection')
    .update({ public: !item.value?.public })
    .eq('id', item.value?.id)
  if (error) {
    log.error(error)
    message.error(error.message)
  } else {
    api.getCollectionItem(item.value?.id)
  }
}

async function setSell() {
  const { error } = await s.from<CollectionItem>('collection')
    .update({ sell: !item.value?.sell })
    .eq('id', item.value?.id)
  if (error) {
    log.error(error)
    message.error(error.message)
  } else {
    api.getCollectionItem(item.value?.id)
  }
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
      <template #extra>
        <n-space justify="end">
          <n-button
            type="error"
            @click="setSell"
            v-if="user.loggedIn"
          >{{ item?.sell ? 'Nicht Verkaufen' : 'Verkaufen' }}</n-button>
          <!-- <n-button type="info" @click="setPublic">{{ item?.public ? 'private' : 'Öffentlich' }}</n-button> -->
        </n-space>
      </template>
      <n-space>
        <n-tag
          v-if="api.selectedItem.liquor.category.name"
          size="small"
        >{{ api.selectedItem.liquor.category.name }}</n-tag>
        <owner-tag :owner-id="api.selectedItem.owner.id" />
        <public-tag v-if="user.loggedIn" @click="setPublic" :value="api.selectedItem.public" />
        <sell-tag :value="item?.sell" />
      </n-space>
    </n-page-header>
    <n-space vertical>
      <n-grid cols="2 m:4 xl:6" responsive="screen">
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
        <!-- <n-gi v-if="api.selectedItem.purchase_price && api.selectedItem.purchase_date">
          <inflation-statistic
            :value="api.selectedItem.purchase_price"
            :date="api.selectedItem.purchase_date"
            :currency="api.selectedItem.purchase_currency"
          />
        </n-gi>-->
        <n-gi>
          <n-statistic label="avg Preis">
            <n-text v-if="price">{{ price.toFixed(2) }} €</n-text>
            <n-text v-else depth="3">na</n-text>
          </n-statistic>
        </n-gi>
      </n-grid>
      <picture-group upload :item-id="api.selectedItem.id" :cover="api.selectedItem.cover" />
      <n-grid cols="2 m:3" :y-gap="10" :x-gap="10" responsive="screen">
        <n-gi>
          <item-info-card class="h-full" :value="api.selectedItem" />
        </n-gi>
        <n-gi>
          <package-card
            class="h-full"
            :package="api.selectedItem.package"
            :condition="api.selectedItem.package_rating"
            :notes="api.selectedItem.pack"
          />
        </n-gi>
        <n-gi>
          <storage-card class="h-full" :value="api.selectedItem.storage" />
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
