import * as React from 'react';
import {inject} from 'mobx-react';
import {RouteComponentProps} from 'react-router-dom';
import {toast} from 'react-toastify';

import {GeneralDataModel} from 'common/models/general-data';
import {UIModel} from 'common/models/ui';
import bevis from 'common/lib/bevis';

import './index.scss';

import {CheckBox} from 'common/components/checkbox';
import {SEX_FEMALE_SVG, SEX_MALE_SVG} from 'common/svg/icons';

interface Props extends RouteComponentProps {
    generalDataModel?: GeneralDataModel;
    uiModel?: UIModel;
}

const b = bevis('main-page');

@inject('generalDataModel', 'uiModel')
export class MainPage extends React.Component<Props> {
    state = {items: ['male']};
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <CheckBox
                        items={[
                            {
                                key: 'female',
                                value: 'Девочка',
                                img: SEX_FEMALE_SVG
                            },
                            {
                                key: 'male',
                                value: 'Девочка',
                                img: SEX_MALE_SVG
                            }
                        ]}
                        checkedKeys={this.state.items}
                        onChange={(items) => this.setState({items})}
                    />
                </div>
            </div>
        );
    }
}
