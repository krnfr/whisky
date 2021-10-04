<script setup lang="ts">

const emit = defineEmits(['selected', 'add', 'save'])
const props = defineProps<{
  add?: boolean,
  addTemplate?: boolean,
  skip?: boolean,
  working?: boolean,
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
      <n-space justify="space-between" align="stretch">
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
      <n-space justify="space-between" align="stretch">
        <div>
          <n-text strong>{{ i.label }}</n-text>
        </div>
        <n-icon v-if="selected == i.value" size="20" color="#0e7a0d">
          <mdi-check-circle />
        </n-icon>
      </n-space>
    </n-card>
    <n-spin :show="working" v-if="props.addTemplate">
      <n-card size="small">
        <template #header>
          <n-space size="small" align="stretch">
            <n-icon size="25">
              <mdi-add />
            </n-icon>
            <n-text>Neu</n-text>
          </n-space>
        </template>
        <template #action>
          <n-space size="small" justify="end">
            <n-button :disabled="working" type="success" @click="emit('save')">Speichern</n-button>
          </n-space>
        </template>
        <slot name="add" />
      </n-card>
    </n-spin>

    <n-space v-if="!props.addTemplate" justify="end">
      <n-input v-if="props.add" v-model:value="value" />
      <n-button :disabled="working" v-if="props.add" @click="add" type="primary">
        <n-spin v-if="working" stroke="white" size="20" />
        <span v-else>Hinzufügen</span>
      </n-button>
      <n-button v-if="props.skip" @click="emit('selected')" type="warning">Skip</n-button>
    </n-space>
  </n-space>
</template>

