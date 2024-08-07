import {createApp} from 'vue';
import './style.css';
import App from './App.vue';
import {createPinia} from "pinia";

export default defineContentScript({
    matches: ['<all_urls>'],
    registration: 'runtime',
    cssInjectionMode: 'ui',

    async main(ctx) {
        const ui = await createShadowRootUi(ctx, {
            name: "ctf-dev",
            position: 'modal',
            onMount: (uiContainer, shadow, shadowHost) => {
                uiContainer.setAttribute('style','')
                shadowHost.setAttribute('style','position:absolute;top:0;left:0;z-index: 99999')
                shadow.querySelector('html')?.setAttribute('style','pointer-events:none;')

                const pinia = createPinia()
                const app = createApp(App);
                app.use(pinia)

                app.mount(uiContainer);
                return app;
            },
            onRemove: (app) => {
                if(app)
                    app.unmount();
            },
        });
        ui.mount();
    },
});