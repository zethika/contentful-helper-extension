import {createApp} from 'vue';
import './style.css';
import App from './App.vue';
import {createPinia} from "pinia";
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

const pinia = createPinia()

const app = createApp(App);
app.use(pinia)
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.mount('#app')