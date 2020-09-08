import {observable, action} from 'mobx';

export type Type = 'error' | 'info';

interface Params {
    header: string;
    type: Type;
    message?: string;
}

export class UIModalMessage {
    @observable public visible: boolean = false;

    @observable public header: string = '';

    @observable public type: Type = 'info';

    @observable public message?: string = '';

	@action public show(params: Params) {
    	this.visible = true;

    	this.header = params.header;
    	this.type = params.type;
    	this.message = params.message;
    }

    @action public destroy() {
		this.visible = false;

		this.header = '';
		this.message = undefined;
	}
}
