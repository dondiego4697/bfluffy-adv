import * as React from 'react';
import {inject} from 'mobx-react';
import {RouteComponentProps} from 'react-router-dom';
import {toast} from 'react-toastify';

import {GeneralDataModel} from 'common/models/general-data';
import {UIModel} from 'common/models/ui';
import bevis from 'common/lib/bevis';

import './index.scss';

import {ToggleSwitch} from 'common/components/toggle-switch';

interface Props extends RouteComponentProps {
    generalDataModel?: GeneralDataModel;
    uiModel?: UIModel;
}

const b = bevis('main-page');

@inject('generalDataModel', 'uiModel')
export class MainPage extends React.Component<Props> {
    state = {value: true};
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <ToggleSwitch value={this.state.value} onChange={(value) => this.setState({value})} />
                </div>
            </div>
        );
    }
}
