<script setup lang="ts">
import { supabase } from "~/supabase";
import { CollectionItem } from "~/types";

defineProps<{
  items: Array<CollectionItem>
}>()
</script>

<template>
  <n-space vertical>
    <n-thing v-for="i in items" :key="i.id" :title="i.liquor.name">
      <template #avatar>
        <n-avatar
          v-if="i.cover"
          :src="supabase.storage.from('pictures').getPublicUrl(`${i.id}/${i.cover}.jpg`).publicURL?.toString()"
        />
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
      {{ i.id }}
    </n-thing>
  </n-space>
</template>
