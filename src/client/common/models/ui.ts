import {observable, action} from 'mobx';

interface Popup {
    type?: 'error' | 'success';
    visible?: boolean;
    title?: string;
    description?: string;
}

export class UIModel {
    @observable public spinning: boolean = false;

    @observable public popup: Popup = {};

    @action public showSpinner() {
        this.spinning = true;
    }

    @action public destroySpinner() {
        this.spinning = false;
    }

    @action public showPopup(modal: Popup) {
        this.popup = {
            ...modal,
            visible: true
        };
    }

    @action public destroyPopup() {
        this.popup = {};
    }
}
