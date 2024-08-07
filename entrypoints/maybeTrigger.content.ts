import {getDevProxy} from "@/proxyServices/DevRepo";

export default defineContentScript({
    matches: ['<all_urls>'],
    async main(ctx) {
        const devProxy = getDevProxy();
        devProxy.triggerDevOnActiveTab();
    },
});