<script setup lang="ts">

const emit = defineEmits(['update:value'])
const props = defineProps<{
  value: number,
  noReset?: boolean
}>()

const controlledValue = ref(props.value)

watch(
  () => [controlledValue.value],
  () => emit('update:value', controlledValue.value)
)

</script>

<template>
  <n-space size="small" align="center">
    <n-rate v-model:value="controlledValue" :count="5" />
    <n-button
      v-if="!props.noReset"
      circle
      :disabled="controlledValue < 1"
      @click="controlledValue = 0"
    >
      <n-icon>
        <mdi-undo />
      </n-icon>
    </n-button>
  </n-space>
</template>
