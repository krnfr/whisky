<script setup lang="ts">

const emit = defineEmits(['update:value', 'on-update:value', 'add', 'save', 'skip'])
const props = defineProps<{
  value: number | string,
  options: Array<{ label: string | undefined, value: string | number }>
  add?: boolean,
  simple?: boolean,
  skip?: boolean,
  working?: boolean,
  noUnknown?: boolean,
  unknown?: string,
}>()

const unknownLabel = props.unknown ? props.unknown : 'Unbekannt'
const newItem = ref('')

const unknownSelected = computed(() => {
  if (!props.value) return true
  if (props.value == 0 || props.value == '') return true
  return false
})

function updateValue(value: number | string = 0) {
  emit('on-update:value', (value ? value : null))
  emit('update:value', (value ? value : null))
}

function add() {
  emit('add', newItem.value)
  newItem.value = ''
}
</script>

<template>
  <n-space vertical>
    <n-card hoverable v-if="!noUnknown" size="small" @click="updateValue">
      <n-space justify="space-between" align="center">
        <div>
          <n-text strong>{{ unknownLabel }}</n-text>
        </div>
        <n-icon v-if="unknownSelected" size="20" color="#0e7a0d">
          <mdi-check-circle />
        </n-icon>
      </n-space>
    </n-card>

    <n-card
      hoverable
      v-for="i in props.options"
      :key="i.value"
      size="small"
      @click="updateValue(i.value)"
    >
      <n-space justify="space-between" align="center">
        <div>
          <n-text strong>{{ i.label }}</n-text>
        </div>
        <n-icon v-if="value == i.value" size="20" color="#0e7a0d">
          <mdi-check-circle />
        </n-icon>
      </n-space>
    </n-card>

    <n-spin :show="working" v-if="props.add">
      <n-card size="small">
        <template v-if="!simple" #header>
          <n-space size="small" align="stretch">
            <n-icon size="25">
              <mdi-add />
            </n-icon>
            <n-text>Neu</n-text>
          </n-space>
        </template>
        <template v-if="!simple" #action>
          <slot name="action">
            <n-space size="small" justify="end">
              <n-button v-if="skip" type="warning" @click="emit('skip')">Skip</n-button>
              <n-button :disabled="working" type="success" @click="emit('save')">Speichern</n-button>
            </n-space>
          </slot>
        </template>
        <n-grid v-if="simple" cols="2">
          <n-gi>
            <n-input v-model:value="newItem" style="width: 100%;" />
          </n-gi>
          <n-gi>
            <n-space justify="end">
              <n-button v-if="skip" @click="emit('skip')" type="warning">Skip</n-button>
              <n-button :disabled="working || !newItem" type="success" @click="add">Speichern</n-button>
            </n-space>
          </n-gi>
        </n-grid>
        <slot v-else />
      </n-card>
    </n-spin>
  </n-space>
</template>

