<script setup lang="ts">

const emit = defineEmits(['update:value', 'on-update:value', 'skip', 'add', 'continue'])
const props = defineProps<{
  options: Array<{ label: string | undefined, value: string | number, sublabel?: string | undefined | null }>
  value?: number | string,
  add?: boolean,
  simple?: boolean,
  skip?: boolean,
  next?: boolean,
  working?: boolean,
  noUnknown?: boolean,
  unknown?: string,
  label?: string,
  filterEmtpyLabel?: boolean,
  // filterEmptyValue?: boolean
}>()

const unknownLabel = props.unknown ?? 'Unbekannt'
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

function addItem() {
  emit('add', newItem.value)
  newItem.value = ''
}
</script>

<template>
  <n-space vertical>
    <n-card hoverable v-if="!noUnknown" size="small" @click="updateValue()">
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
      <slot name="content">
        <n-space justify="space-between" align="center">
          <div>
            <n-text v-if="i.label" strong>{{ i.label }}</n-text>
            <n-text v-else depth="3" strong>{{ (props.label ? props.label : 'kein label') }}</n-text>
            <n-text v-if="i.sublabel" depth="2">&nbsp;- {{ i.sublabel }}</n-text>
          </div>
          <n-icon v-if="value == i.value" size="20" color="#0e7a0d">
            <mdi-check-circle />
          </n-icon>
        </n-space>
      </slot>
    </n-card>

    <n-spin :show="working" v-if="add">
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
              <n-button v-if="skip" :disabled="working" @click="emit('skip')" type="warning">Skip</n-button>
              <n-button :disabled="working" @click="addItem" type="info">Hinzufügen</n-button>
              <n-button
                v-if="next"
                :disabled="working"
                @click="emit('continue')"
                type="success"
              >Weiter</n-button>
            </n-space>
          </slot>
        </template>
        <n-grid v-if="simple" cols="2">
          <n-gi>
            <n-input v-model:value="newItem" style="width: 100%;" />
          </n-gi>
          <n-gi>
            <n-space justify="end">
              <n-button v-if="skip" :disabled="working" @click="emit('skip')" type="warning">Skip</n-button>
              <n-button :disabled="working" @click="addItem" type="info">Hinzufügen</n-button>
              <n-button
                v-if="next"
                :disabled="working"
                @click="emit('continue')"
                type="success"
              >Weiter</n-button>
            </n-space>
          </n-gi>
        </n-grid>
        <slot v-else />
      </n-card>
    </n-spin>
  </n-space>
</template>

