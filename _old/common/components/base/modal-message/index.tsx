import * as React from 'react';

import {uiModel} from 'common/models';
import {Button} from 'common/components/base/button';
import bevis from 'common/lib/bevis';

import './index.scss';

interface ShowSuccessParams {
    title: string;
    message: string;
}

const b = bevis('bfluffy-modal-message');

const UI = (message: string) => (
    <div className={b()}>
        <div className={b('message')}>{message}</div>
        <Button type="primary" text="ОК" className={b('ok-button')} onClickHandler={() => uiModel.destroyModal()} />
    </div>
);

function showError(message: string) {
    uiModel.showModal({
        title: 'Ошибка',
        children: UI(message)
    });
}

function showSuccess(params: ShowSuccessParams) {
    const {title, message} = params;

    uiModel.showModal({
        title,
        children: UI(message)
    });
}

export const ModalMessage = {
    showError,
    showSuccess
};
