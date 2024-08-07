import {defineStore} from "pinia";

export interface DatasetType { space: string, type: string, id: string }
export interface NodesMapType { cbEnter: (event: MouseEvent) => void,cbLeave: (event: MouseEvent) => void, id: string, node: HTMLElement, set: DatasetType }

export const useDataSetsStore = defineStore('dataSets', {
    state: () => ({
        nodesMap: {} as Record<string, NodesMapType>,
        parsedTotal: 0,
        hoveringId: null as null|string,
        selectedId: null  as null|string,
    }),
    getters: {
        hoveringNodeMap(): null|NodesMapType {
            return this.hoveringId === null || typeof this.nodesMap[this.hoveringId] === 'undefined' ? null : this.nodesMap[this.hoveringId]
        },
        selectedNodeMap(): null|NodesMapType {
            return this.selectedId === null || typeof this.nodesMap[this.selectedId] === 'undefined' ? null : this.nodesMap[this.selectedId]
        }
    },
    actions: {
        clearNodes(){
            Object.keys(this.nodesMap).forEach(key => {
                const el: NodesMapType  = this.nodesMap[key];
                el.node.removeAttribute('data-ctf-managed-id')
                el.node.removeEventListener('mouseenter',el.cbEnter);
                el.node.removeEventListener('mouseleave',el.cbLeave);
                delete this.nodesMap[key]
            })
        },
        updateValidNodes(){
            // Remove elements which have been removed from the dom in the meantime
            Object.keys(this.nodesMap).forEach(key => {
                const el: NodesMapType  = this.nodesMap[key];
                if(el.node.parentNode === null)
                {
                    el.node.removeAttribute('data-ctf-managed-id')
                    el.node.removeEventListener('mouseenter',el.cbEnter);
                    el.node.removeEventListener('mouseleave',el.cbLeave);
                    delete this.nodesMap[key]
                }
            })

            document.querySelectorAll('[data-ctf-set-id]').forEach(node => {
                if(node.hasAttribute('data-ctf-managed-id'))
                    return;

                const space = node.getAttribute('data-ctf-set-space');
                const type = node.getAttribute('data-ctf-set-type');
                const id = node.getAttribute('data-ctf-set-id');

                if(space === null || type === null || id === null)
                    return;

                const nodeId = 'dataset-node-id-'+this.parsedTotal
                this.parsedTotal++;
                const el: NodesMapType = {
                    id:nodeId,
                    node: node as HTMLElement,
                    cbEnter: (event) => {
                        event.stopPropagation();
                        if (this.hoveringId === null || typeof this.nodesMap[this.hoveringId] === 'undefined' || this.nodesMap[this.hoveringId].node.contains(el.node)) {
                            this.hoveringId = el.id;
                        }
                    },
                    cbLeave: (event) => {
                        event.stopPropagation();
                        let parentNode: HTMLElement | null = el.node.parentElement;
                        let foundNewDeepestNode = false;

                        while (parentNode) {
                            const parsedId = parentNode.getAttribute('data-ctf-managed-id')
                            if (parsedId) {
                                this.hoveringId = parsedId;
                                foundNewDeepestNode = true;
                                break;
                            }
                            parentNode = parentNode.parentElement;
                        }

                        if (!foundNewDeepestNode) {
                            this.hoveringId = null;
                        }
                    },
                    set: {
                        space,
                        type,
                        id
                    }
                };

                el.node.addEventListener('mouseenter',el.cbEnter)
                el.node.addEventListener('mouseleave',el.cbLeave)

                el.node.setAttribute('data-ctf-managed-id',nodeId)
                this.nodesMap[nodeId] = el;
            })
        }
    }
});

export type DataSetsStoreType = ReturnType<typeof useDataSetsStore>;
