<template>
    <div v-if="sysStore.showDev" :id="DL_CONTENT_APP_ID">
        <div class="fixed bottom-0 left-0 w-screen z-[99999]">
            <div class="m-auto bg-white dark:bg-[#0f172a] text-[#111] dark:text-white py-2 px-4 w-[130px] rounded-t border border-b-0 cursor-pointer pointer-events-auto -mb-[1px] relative z-10 grid gap-4 grid-cols-2">
                <button @click="sysStore.isSelectingNode = !sysStore.isSelectingNode" :class="{'text-blue-300':sysStore.isSelectingNode}" class="hover:bg-blue-600 hover:bg-opacity-30 p-2 rounded">
                    <Icons icon="crosshairs" />
                </button>
                <button @click="sysStore.detailsOpen = !sysStore.detailsOpen" class="hover:bg-blue-600 hover:bg-opacity-30 rounded p-2">
                    <Icons class="transition-all" :class="sysStore.detailsOpen ? 'rotate-180' : 'rotate-0'" icon="chevron-double-up"/>
                </button>
            </div>
            <Transition name="details">
                <div v-if="sysStore.detailsOpen" class="overflow-hidden max-h-[400px] pointer-events-auto">
                    <DetailsSection  />
                </div>
            </Transition>
        </div>
        <HoverElementHighlight />
        <SelectedElementHighlight />
    </div>
</template>

<script lang="ts" setup>
import {ACTION_HIDE_DEV, ACTION_SHOW_DEV, MESSAGE_TYPE} from "@/datasets/messages";
import sendWindowPostmessage from "@/entrypoints/dl.content/utilities/sendWindowPostmessage";
import {useSysStore} from "@/entrypoints/dl.content/stores/sys";
import DetailsSection from "@/entrypoints/dl.content/components/sections/DetailsSection.vue";
import Icons from "@/components/Icons.vue";
import { useMagicKeys, whenever } from '@vueuse/core'
import HoverElementHighlight from "@/entrypoints/dl.content/components/highlights/HoverElementHighlight.vue";
import SelectedElementHighlight from "@/entrypoints/dl.content/components/highlights/SelectedElementHighlight.vue";
import {DL_CONTENT_APP_ID} from "@/datasets/app";
import {useDataSetsStore} from "@/entrypoints/dl.content/stores/dataSets";
import {getDevProxy} from "@/proxyServices/DevRepo";

const sysStore = useSysStore();
const dev = getDevProxy();

onMounted(async () => {
    console.log('dl.content')
    sysStore.showDev = await dev.getShowDevSetting();
    if(sysStore.showDev)
        sendWindowPostmessage(ACTION_SHOW_DEV)
    sysStore.hasPrepared = true;
})

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(typeof message !== 'object' || message.type !== MESSAGE_TYPE || typeof message.action !== 'string')
        return;

    switch (message.action){
        case ACTION_SHOW_DEV:
            sysStore.showDev = true;
            sendWindowPostmessage(ACTION_SHOW_DEV)
            break;
        case ACTION_HIDE_DEV:
            sysStore.showDev = false;
            sendWindowPostmessage(ACTION_HIDE_DEV)
            break;
    }
});

const keys = useMagicKeys()
whenever(keys.escape, () => {
    if(sysStore.isSelectingNode )
    {
        sysStore.isSelectingNode = false;
    }
    else
    {
        sysStore.detailsOpen = false;
        dataStore.hoveringId = null;
        dataStore.selectedId = null;
    }
})
const shiftS = keys['Shift+S'];
whenever(shiftS, () => {
    sysStore.isSelectingNode = true;
})

window.navigation.addEventListener("navigate", () => {
    let attempts = 0;
    const interval = setInterval(() => {
        if(dataStore.selectedNodeMap !== null && document.querySelector('[data-ctf-managed-id="'+dataStore.selectedNodeMap.id+'"]') === null){
            dataStore.selectedId = null;
            sysStore.detailsOpen = false;
            clearInterval(interval)
        }
        else if(attempts > 10)
        {
            clearInterval(interval)
        }
        else
        {
            attempts++;
        }
    },100)
})


const dataStore = useDataSetsStore();
let promiseRemove: null|Promise<void> = null;
const attemptHideDatasets = async () => {
    if(promiseRemove === null){
        sendWindowPostmessage(ACTION_HIDE_DEV)
        promiseRemove = new Promise((resolve) => {
            let attempts = 0;
            const interval = setInterval(() => {
                sendWindowPostmessage(ACTION_HIDE_DEV)
                if(document.querySelectorAll('[data-ctf-set-id]').length === 0){
                    dataStore.clearNodes();
                    clearInterval(interval)
                    resolve();
                }else if(attempts > 100){
                    console.log('gave up hiding datasets after 100 attempts')
                    clearInterval(interval)
                    resolve();
                }

                attempts++;

            },100);
        })
        await promiseRemove;
        promiseRemove = null;
    }
    else
    {
        await promiseRemove;
    }
}

let promise: null|Promise<void> = null;
const attemptShowDatasets = async () => {

    if(promise === null){
        sendWindowPostmessage(ACTION_SHOW_DEV)
        promise = new Promise((resolve) => {
            let attempts = 0;
            const interval = setInterval(() => {
                sendWindowPostmessage(ACTION_SHOW_DEV)
                if(document.querySelectorAll('[data-ctf-set-id]').length > 0){
                    dataStore.updateValidNodes();
                    clearInterval(interval)
                    resolve();
                }else if(attempts > 100){
                    console.log('gave up initializing datasets after 100 attempts')
                    clearInterval(interval)
                    resolve();
                }

                attempts++;

            },100);
        })
        await promise;
        promise = null;
    }
    else
    {
        await promise;
    }
}

const triggerNodeRecalc = async () => {
    if(sysStore.showDev)
    {
        await attemptShowDatasets();
    }
    else
    {
        await attemptHideDatasets();
    }
}

onMounted(() => {
    triggerNodeRecalc();
})

watch([() => sysStore.isSelectingNode,() => sysStore.showDev],() => {
    triggerNodeRecalc();
})

</script>

<style>
.details-enter-active,
.details-leave-active {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

.details-enter-from,
.details-leave-to {
    max-height: 0;
}
</style>
