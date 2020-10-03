import * as React from 'react';

import {uiGlobal} from 'client/models';
import {Button} from 'client/components/base/button';
import bevis from 'client/lib/bevis';

import './index.scss';

interface ShowSuccessParams {
    title: string;
    message: string;
}

const b = bevis('bfluffy-modal-message');

const UI = (message: string) => (
    <div className={b()}>
        <div className={b('message')}>{message}</div>
        <Button type="primary" text="ОК" className={b('ok-button')} onClickHandler={() => uiGlobal.destroyModal()} />
    </div>
);

function showError(message: string) {
    uiGlobal.showModal({
        title: 'Ошибка',
        children: UI(message)
    });
}

function showSuccess(params: ShowSuccessParams) {
    const {title, message} = params;

    uiGlobal.showModal({
        title,
        children: UI(message)
    });
}

export const ModalMessage = {
    showError,
    showSuccess
};
