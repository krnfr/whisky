<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <n-result status="404" title="404" description="Der Inhalt wurde nicht gefunden.">
    <template #footer>
      <n-button @click="router.back()">zurück</n-button>
    </template>
  </n-result>
</template>
