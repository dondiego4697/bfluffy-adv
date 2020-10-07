import * as React from 'react';
import {observable, action} from 'mobx';

interface Modal {
    visible?: boolean;
    title?: string;
    children?: React.ReactNode;
}

export class UIModel {
    @observable public spinning: boolean = false;

    @observable public modal: Modal = {};

    @action public showSpinner() {
        this.spinning = true;
    }

    @action public destroySpinner() {
        this.spinning = false;
    }

    @action public showModal(modal: Modal) {
        this.modal = {
            ...modal,
            visible: true
        };
    }

    @action public destroyModal() {
        this.modal = {};
    }
}
