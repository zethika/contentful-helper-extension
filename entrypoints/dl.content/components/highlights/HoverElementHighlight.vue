<template>
    <ElementHighlightDisplay v-if="sysStore.isSelectingNode && dataSetsStore.hoveringNodeMap !== null" :node-map="dataSetsStore.hoveringNodeMap" :cb="callback" wrapper-classes="border-2 border-dashed border-blue-400 bg-blue-400/10" />
</template>

<script setup lang="ts">
import ElementHighlightDisplay from "@/entrypoints/dl.content/components/highlights/ElementHighlightDisplay.vue";
import {useSysStore} from "@/entrypoints/dl.content/stores/sys";
import {useDataSetsStore} from "@/entrypoints/dl.content/stores/dataSets";

const sysStore = useSysStore();
const dataSetsStore = useDataSetsStore();

const callback = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation();
    e.stopImmediatePropagation();

    dataSetsStore.selectedId = dataSetsStore.hoveringId;
    dataSetsStore.hoveringId = null;
    sysStore.detailsOpen = true;
    sysStore.isSelectingNode = false;
}
</script>
