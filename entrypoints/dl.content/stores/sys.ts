import {defineStore} from "pinia";

export const useSysStore = defineStore('sys', {
	state: () => ({
		hasPrepared: false,
		showDev: false,
		showHighlight: false,
		detailsOpen: false,
		isSelectingNode: false
	}),
	getters: {

	},
	actions: {

	}
});

export type SysStoreType = ReturnType<typeof useSysStore>;
