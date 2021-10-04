<script setup lang="ts">

const emit = defineEmits(['selected', 'add'])
const props = defineProps<{
  add?: boolean,
  noUnknown?: boolean,
  selected?: string | number,
  list: Array<{ label: string | undefined, value: string | number }>
}>()

const value = ref('')

const unknownSelected = computed(() => {
  if (!props.selected) return true
  if (props.selected == 0 || props.selected == '') return true
  return false
})

function add() {
  emit('add', value.value)
  value.value = ''
}

</script>

<template>
  <n-space vertical>
    <n-card hoverable v-if="!noUnknown" size="small" @click="emit('selected')">
      <n-space justify="space-between">
        <div>
          <n-text strong>Unbekannt</n-text>
        </div>
        <n-icon v-if="unknownSelected" size="20" color="#0e7a0d">
          <mdi-check-circle />
        </n-icon>
      </n-space>
    </n-card>
    <n-card
      hoverable
      v-for="i in props.list"
      :key="i.value"
      size="small"
      @click="emit('selected', i.value)"
    >
      <n-space justify="space-between">
        <div>
          <n-text strong>{{ i.label }}</n-text>
        </div>
        <n-icon v-if="selected == i.value" size="20" color="#0e7a0d">
          <mdi-check-circle />
        </n-icon>
      </n-space>
    </n-card>
    <n-space v-if="props.add" justify="end">
      <n-input v-model:value="value" />
      <n-button @click="add" type="primary">Hinzufügen</n-button>
    </n-space>
  </n-space>
</template>

