<template>
    <n-page-header title="Kategorien"></n-page-header>
    <n-grid cols="2" responsive="screen" :y-gap="10" :x-gap="10">
        <n-gi v-for="c in list">
            <n-card size="small">
                <n-grid cols="2">
                    <n-gi>
                        <n-space vertical>
                            <n-text strong depth="2">{{ c.name }}</n-text>
                            <n-space>
                                <n-button text type="error">
                                    <n-icon size="20">
                                        <mdi-delete />
                                    </n-icon>
                                </n-button>
                                <n-button text>
                                    <n-icon size="20">
                                        <mdi-edit />
                                    </n-icon>
                                </n-button>
                            </n-space>
                        </n-space>
                    </n-gi>
                    <n-gi>
                        <n-color-picker
                            size="large"
                            :default-value="c.color"
                            :show-alpha="false"
                            :modes="['hex']"
                            @on-complete="(color: string) => handleColor(color)"
                        />
                    </n-gi>
                </n-grid>
            </n-card>
        </n-gi>
    </n-grid>
</template>


<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { useSupabaseStore } from '~/stores/supabase';


const api = useSupabaseStore()
const message = useMessage()

const list = computed(() => api.categories)

function handleColor(value: string) {
    message.success(value)
}

</script>