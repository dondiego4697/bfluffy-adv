import * as React from 'react';
import {inject} from 'mobx-react';
import {RouteComponentProps} from 'react-router-dom';
import {toast} from 'react-toastify';

import {GeneralDataModel} from 'common/models/general-data';
import {UIModel} from 'common/models/ui';
import bevis from 'common/lib/bevis';

import './index.scss';

import {TimeoutButton} from 'common/components/timeout-button';

interface Props extends RouteComponentProps {
    generalDataModel?: GeneralDataModel;
    uiModel?: UIModel;
}

const b = bevis('main-page');

@inject('generalDataModel', 'uiModel')
export class MainPage extends React.Component<Props> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <TimeoutButton text="Отправить код еще раз" seconds={9} onClickHandler={() => toast('нах иди')} />
                </div>
            </div>
        );
    }
}
