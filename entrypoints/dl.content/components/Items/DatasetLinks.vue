<template>
    <a v-if="dataset.id !== DATASET_SYSTEM_ID_COLLECTION" :href="link" target="_blank" class="flex items-center justify-center bg-white h-[32px] w-[32px] rounded shadow-[0_3px_15px_rgba(0,0,0,0.15)]">
        <ContentfulIcon class="w-5" />
    </a>
</template>

<script setup lang="ts">
import {NodesMapType, useDataSetsStore} from "@/entrypoints/dl.content/stores/dataSets";
import {DATASET_SYSTEM_ID_COLLECTION} from "@/datasets/dataset";
import ContentfulIcon from "@/components/ContentfulIcon.vue";

const props = defineProps<{
    nodeMap: NodesMapType
}>()

const store = useDataSetsStore()
const dataset = computed(() => props.nodeMap.set)

const link = computed(() => {

    let parentIds: string[] = [];
    let parentNode: HTMLElement | null = props.nodeMap.node.parentElement;

    while (parentNode) {
        const parsedId = parentNode.getAttribute('data-ctf-managed-id')
        if (parsedId && typeof store.nodesMap[parsedId] !== 'undefined') {
            parentIds.push(store.nodesMap[parsedId].set.id)
        }
        parentNode = parentNode.parentElement;
    }

    let previousPart = '';
    if(parentIds.length > 0){
        parentIds.reverse();
        previousPart = '?previousEntries='+parentIds.join(',');
    }

    let environmentPart = '';
    if(dataset.value.environment !== null)
        environmentPart = '/environments/'+dataset.value.environment

    return 'https://app.contentful.com/spaces/'+dataset.value.space+environmentPart+'/entries/'+dataset.value.id+previousPart;
})

</script>
