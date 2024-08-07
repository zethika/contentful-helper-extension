<template>
    <ElementHighlightDisplay v-if="dataSetsStore.selectedNodeMap !== null" :node-map="dataSetsStore.selectedNodeMap" wrapper-classes="border-2 border-dashed border-blue-400 bg-blue-400/40" >
        <div class="absolute top-0 right-0 p-4 pointer-events-auto">
            <DatasetLinks :node-map="dataSetsStore.selectedNodeMap" />
        </div>
    </ElementHighlightDisplay>
</template>

<script setup lang="ts">
import ElementHighlightDisplay from "@/entrypoints/dl.content/components/highlights/ElementHighlightDisplay.vue";
import {useDataSetsStore} from "@/entrypoints/dl.content/stores/dataSets";
import DatasetLinks from "@/entrypoints/dl.content/components/Items/DatasetLinks.vue";
const dataSetsStore = useDataSetsStore();
</script>
