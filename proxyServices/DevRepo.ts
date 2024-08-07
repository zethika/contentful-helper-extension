import {defineProxyService} from "@webext-core/proxy-service";
import {ACTION_HIDE_DEV, ACTION_SHOW_DEV, MESSAGE_TYPE} from "@/datasets/messages";

class DevRepoProxy {
    private tabDevStatus: Record<number, { hasInit: boolean, promise?: Promise<void>}> = {}
    constructor() {}

    async cleanTab(tabId: number) {
        delete this.tabDevStatus[tabId]
    }

    async triggerDevOnAllTabs(){
        browser.tabs.query({status:'complete'})
            .then(async (tabs) => {
                tabs.forEach(tab => {
                    if(typeof tab.id !== 'undefined')
                        this.triggerDevOnTabId(tab.id)
                })
            });
    }

    async triggerDevOnActiveTab(){
        browser.tabs.query({active: true, lastFocusedWindow: true})
            .then(async (tabs) => {
                tabs.forEach(tab => {
                    if(typeof tab.id !== 'undefined')
                    {
                        if(typeof this.tabDevStatus[tab.id] !== 'undefined')
                            this.tabDevStatus[tab.id].hasInit = false;

                        this.triggerDevOnTabId(tab.id)
                    }
                })
            });
    }

    async triggerDevOnTabId(tabId: number){
        const tab = await browser.tabs.get(tabId);

        if(typeof tab.url === 'undefined' || !tab.url.startsWith('http'))
            return;

        const show = await this.getShowDevSetting()

        if(show)
        {
            // Either an unknown tab or one which needs to be re initialized
            if(typeof this.tabDevStatus[tabId] === 'undefined' || !this.tabDevStatus[tabId].hasInit)
            {
                // The tab id is new, initialize with not init
                if(typeof this.tabDevStatus[tabId] === 'undefined')
                    this.tabDevStatus[tabId] = {hasInit: false};

                // There is no running boot promise, start it
                if(typeof this.tabDevStatus[tabId].promise === 'undefined')
                {
                    this.tabDevStatus[tabId].promise = new Promise(async (resolve) => {
                        await browser.scripting.insertCSS({target: { tabId: tabId }, files: ['/content-scripts/dl.css']});
                        await browser.scripting.executeScript({target: { tabId: tabId}, files: ['/content-scripts/dl.js']});
                        this.tabDevStatus[tabId].hasInit = true;
                        resolve();
                    })

                    // The one responsible for initializing the promise also needs to remove it after it has finished
                    await this.tabDevStatus[tabId].promise;
                    delete this.tabDevStatus[tabId].promise;

                }
                // Wait for the currently running boot
                else
                {
                    await this.tabDevStatus[tabId].promise
                }
            }

            await browser.tabs.sendMessage(tabId, {type: MESSAGE_TYPE, action: ACTION_SHOW_DEV})
        }
        else
        {
            if(typeof this.tabDevStatus[tabId] === 'undefined')
                return;

            await browser.tabs.sendMessage(tabId, {type: MESSAGE_TYPE, action: ACTION_HIDE_DEV})
        }
    }

    /**
     *
     */
    async getShowDevSetting(){
        const current = await storage.getItem<boolean>('local:ctf_show_dev');
        return current === null ? false : current;
    }

    /**
     *
     * @param showDev
     */
    async setShowDevSetting(showDev: boolean){
        await storage.setItem('local:ctf_show_dev',showDev);
    }

}

export const [registerDevProxy, getDevProxy] = defineProxyService(
    'DevProxy',
    () => {
        return new DevRepoProxy()
    },
);