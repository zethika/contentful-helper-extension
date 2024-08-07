<template>
    <div class="absolute pointer-events-none z-[99998] transition-all" :style="position">
        <div class="absolute inset-y-2 inset-x-1" :class="wrapperClasses">
            <slot/>
        </div>
    </div>
</template>

<script setup lang="ts">
import {NodesMapType} from "@/entrypoints/dl.content/stores/dataSets";

const props = defineProps<{
    nodeMap: NodesMapType,
    wrapperClasses?: string,
    cb?: (e: MouseEvent) => void
}>()

const updateBounding = () => {
    boxTrigger.value++;
}

const boxTrigger = ref(0)

const position = computed(() => {
    boxTrigger.value;
    const box = props.nodeMap.node.getBoundingClientRect();
    return 'top:'+(box.top+window.scrollY)+'px;left:'+(box.left+window.scrollX)+'px;width:'+box.width+'px;height:'+box.height+'px;'
})

onMounted(() => {
    window.addEventListener('resize',updateBounding)
    if(typeof props.cb === 'function'){
        document.body.classList.add('cursor-pointer');
        document.addEventListener('click',props.cb,true)
    }
})

onBeforeUnmount(() => {
    window.removeEventListener('resize',updateBounding)
    if(typeof props.cb === 'function'){
        document.body.classList.remove('cursor-pointer');
        document.removeEventListener('click',props.cb,true)
    }
})



</script>
