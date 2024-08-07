import {getDevProxy, registerDevProxy} from "@/proxyServices/DevRepo";

export default defineBackground(() => {
    registerDevProxy();

    storage.watch<boolean>(
        'local:ctf_show_dev',
        () => {
            const devProxy = getDevProxy()
            devProxy.triggerDevOnAllTabs()
        },
    );

    browser.tabs.onUpdated.addListener((tabId,event,tab) => {
        if(event.status === 'complete')
        {
            const devProxy = getDevProxy()
            devProxy.triggerDevOnTabId(tabId)
        }
    })

    browser.tabs.onRemoved.addListener((tabId) => {
        const devProxy = getDevProxy()
        devProxy.cleanTab(tabId)
    })
});
