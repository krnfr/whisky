<script setup lang="ts">
import { useUserStore } from "~/stores/user";
import { CollectionItem } from "~/types"

const router = useRouter()
const user = useUserStore()

defineProps<{
  items: Array<CollectionItem>
}>()
</script>

<template>
  <n-space vertical>
    <n-grid cols="1 m:3 xl:6" :x-gap="10" :y-gap="10" responsive="screen">
      <template v-for="i in items">
        <n-gi v-if="user.loggedIn || i.public">
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
      </template>
    </n-grid>
  </n-space>
</template>
