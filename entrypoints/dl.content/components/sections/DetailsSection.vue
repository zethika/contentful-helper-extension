<template>
    <div class="bg-white dark:bg-[#0f172a] text-[#111] dark:text-white p-4 border-t">
        <div class="max-w-[1280px] mx-auto md:px-4">
            <div v-if="dataSetsStore.selectedNodeMap === null" class="flex justify-center">
                <p>Select something to begin</p>
            </div>
            <template v-else>
                <div class="flex justify-between w-full">
                    <div class="flex">
                        <span class="px-2 py-1 border-blue-300 rounded bg-blue-300 bg-opacity-40 mr-2">{{dataSetsStore.selectedNodeMap.set.space}}</span>
                        <span class="px-2 py-1 border-blue-300 rounded bg-blue-300 bg-opacity-40 mr-2">{{dataSetsStore.selectedNodeMap.set.type}}</span>
                        <span class="px-2 py-1 border-blue-300 rounded bg-blue-300 bg-opacity-40">{{dataSetsStore.selectedNodeMap.set.id}}</span>
                    </div>
                    <DatasetLinks :node-map="dataSetsStore.selectedNodeMap" />
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useDataSetsStore} from "@/entrypoints/dl.content/stores/dataSets";
import DatasetLinks from "@/entrypoints/dl.content/components/Items/DatasetLinks.vue";
const dataSetsStore = useDataSetsStore();
</script>
