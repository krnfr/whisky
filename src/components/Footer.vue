<script setup>
import { resolveComponent } from '@vue/runtime-core'

const router = useRouter()

const menuOptions = [
  {
    key: '/',
    label: 'Home'
  },
  {
    key: '/items',
    label: 'Collection'
  },
  {
    key: '/user',
    label: 'User'
  },
  {
    key: '/items/add',
    label: 'Add'
  }
]

function handleUpdateValue(key, item) {
  router.push(key)
}
</script>

<template>
  <n-menu
    :options="menuOptions"
    @update-value="handleUpdateValue"
    mode="horizontal"
    :default-value="$route.path"
  />
</template>
