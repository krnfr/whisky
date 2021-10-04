<script setup lang="ts">

const emit = defineEmits(['save', 'skip'])
const props = defineProps<{
  title?: string,
  skip?: boolean,
  working?: boolean,
}>()

</script>

<template>
  <n-spin :show="props.working">
    <n-card>
      <template #action>
        <n-space justify="end">
          <n-button v-if="skip" type="warning" :disabled="props.working" @click="emit('skip')">Skip</n-button>
          <n-button type="success" :disabled="props.working" @click="emit('save')">Weiter</n-button>
        </n-space>
      </template>
      <slot />
    </n-card>
  </n-spin>
</template>
