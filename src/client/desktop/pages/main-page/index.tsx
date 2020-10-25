import * as React from 'react';
import {inject} from 'mobx-react';
import {RouteComponentProps} from 'react-router-dom';

import {GeneralDataModel} from 'common/models/general-data';
import {UIModel} from 'common/models/ui';
import bevis from 'common/lib/bevis';

import './index.scss';

import {Select} from 'common/components/select';

interface Props extends RouteComponentProps {
    generalDataModel?: GeneralDataModel;
    uiModel?: UIModel;
}

const b = bevis('main-page');

@inject('generalDataModel', 'uiModel')
export class MainPage extends React.Component<Props> {
    state: any = {key: undefined};

    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <Select
                        label="foo"
                        selectedKey={this.state.key}
                        required={true}
                        options={new Array(20).fill(true).map((_, i) => ({key: String(i), value: String(i)}))}
                        onKeyChange={(key) => {
                            this.setState({key});
                        }}
                        error="erro"
                    />
                </div>
            </div>
        );
    }
}
