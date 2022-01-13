<script setup>
import { resolveComponent } from '@vue/runtime-core'

const router = useRouter()

const menuOptions = [
  {
    key: '/items',
    label: 'Collection'
  },
  {
    key: '/category',
    label: 'Categories'
  },
  {
    key: '/label',
    label: 'Labels'
  },
  // {
  //   key: '/user',
  //   label: 'User'
  // },
  // {
  //   key: '/items/add',
  //   label: 'Add'
  // },
  // {
  //   key: '/storage',
  //   label: 'Storage'
  // }
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
    inverted
    :default-value="$route.path"
  />
</template>
