<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <div>
    <div>
      <n-icon :size="48">
        <carbon-warning />
      </n-icon>
    </div>
    <h1>gibts nicht</h1>
    <div>
      <n-button @click="router.back()">Zurück</n-button>
    </div>
  </div>
</template>
