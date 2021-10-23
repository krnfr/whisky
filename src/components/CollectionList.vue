<script setup lang="ts">
import { CollectionItem } from "~/types"

const router = useRouter()

defineProps<{
  items: Array<CollectionItem>
}>()
</script>

<template>
  <n-space vertical>
    <n-grid cols="1 m:3 xl:6" :x-gap="10" :y-gap="10" responsive="screen">
      <n-gi v-for="i in items">
        <n-card class="h-full" @click="router.push('/items/' + i.id)">
          <n-thing
            :key="i.id"
            :title="(i.liquor.name ? i.liquor.name : i.liquor.label.name) + (i.version ? ' - ' + i.version : '') + (i.year ? (' (' + i.year + ')') : '')"
          >
            <template #avatar>
              <item-avatar :item="i.id" :image="i.cover" />
            </template>
            <template #header-extra>
              <n-space justify="end">
                <n-tag v-if="i.liquor.category?.name" size="small">
                  {{
                    i.liquor.category.name
                  }}
                </n-tag>
              </n-space>
            </template>
            <template #description v-if="i.liquor.label">
              {{
                i.liquor.label.name
              }}
            </template>
            <!-- {{ i.id }} -->
          </n-thing>
        </n-card>
      </n-gi>
    </n-grid>
  </n-space>
</template>
