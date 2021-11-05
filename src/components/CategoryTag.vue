<script lang="ts" setup>
import { Category } from "~/types";

defineProps<{
    category: Category
}>()

</script>

<template>
    <n-tag :style="{ color: category.color ? category.color : 'grey' }">{{ category.name }}</n-tag>
</template>