<script setup lang="ts">
import { useSupabaseStore } from "~/stores/supabase";

const api = useSupabaseStore()
</script>

<template>
  <collection-list :items="api.collection" />
</template>
