import {observable} from 'mobx';

import {DataState} from 'client/consts';

interface ClientConfig {}

export class ClientDataModel {
    @observable public clientConfig: ClientConfig | null = null;

    @observable public state: DataState = DataState.READY;

    constructor() {
    	// eslint-disable-next-line no-undef
    	const node = window.document.getElementsByClassName('config-view')[0];
    	if (node) {
    		this.clientConfig = node.textContent ? JSON.parse(node.textContent) : null;
    	}
    }
}
