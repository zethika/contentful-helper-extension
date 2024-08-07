import {defineStore} from "pinia";

export const useSysStore = defineStore('sys', {
	state: () => ({
		hasPrepared: false,
		showDev: false as boolean
	}),
	getters: {

	},
	actions: {

	}
});

export type SysStoreType = ReturnType<typeof useSysStore>;
