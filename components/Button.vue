<template>
    <button type="button" class="focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 px-2.5 py-1.5 shadow-sm text-white dark:text-gray-900 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-500 dark:bg-sky-400 dark:hover:bg-sky-500 dark:disabled:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:focus-visible:outline-sky-400 inline-flex items-center">
        <Icons v-if="loading" icon="cog" class="flex-shrink-0 h-5 w-5 animate-spin" aria-hidden="true" />
        <span v-else class=""><slot/></span>
    </button>
</template>

<script setup lang="ts">
import Icons from "@/components/Icons.vue";
const props = defineProps<{
    loading?: boolean
}>()
</script>
