<script setup lang="ts">
import { supabase } from "~/supabase";
import { CollectionItem } from "~/types";

const router = useRouter()

defineProps<{
  items: Array<CollectionItem>
}>()
</script>

<template>
  <n-space vertical>
    <n-thing
      v-for="i in items"
      :key="i.id"
      :title="i.liquor.name + (i.version ? ' - ' + i.version : '')"
      @click="router.push('/items/' + i.id)"
    >
      <template #avatar>
        <item-avatar :item="i.id" :image="i.cover" />
      </template>
      <template #header-extra>
        <n-space justify="end">
          <n-tag v-if="i.liquor.category.name" size="small">
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
  </n-space>
</template>
