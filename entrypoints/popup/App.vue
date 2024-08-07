<template>
    <div class="dark:bg-[#0f172a] bg-white w-[400px]">
        <div class="flex items-center pt-8 mb-4 px-7">
            <ContentfulIcon class="w-10 mr-4" />
            <h2 class="text-2xl">Contentful helper</h2>
        </div>
        <div v-if="!sysStore.hasPrepared" class="flex h-[200px] justify-center items-center">
            <ProgressSpinner  />
        </div>
        <div v-else class="px-7 py-4">
            <div class="flex items-center">
                <ToggleSwitch v-model="sysStore.showDev" inputId="showDev" />
                <label class="ml-2" for="showDev">Show dev tools</label>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import ProgressSpinner from 'primevue/progressspinner';
import {useSysStore} from "@/entrypoints/popup/stores/sys";
import {getDevProxy} from "@/proxyServices/DevRepo";
import ToggleSwitch from "primevue/toggleswitch";
import ContentfulIcon from "@/components/ContentfulIcon.vue";

const sysStore = useSysStore();
const dev = getDevProxy();

onMounted(async () => {
    sysStore.showDev = await dev.getShowDevSetting();
    sysStore.hasPrepared = true;
})

watch(() => sysStore.showDev,() => {
    if(sysStore.hasPrepared){
        dev.setShowDevSetting(sysStore.showDev)
    }
})

</script>
