<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <div>
    <div>
      <el-icon :size="48">
        <carbon-warning />
      </el-icon>
    </div>
    <h1>gibts nicht</h1>
    <div>
      <el-button @click="router.back()">Zurück</el-button>
    </div>
  </div>
</template>
