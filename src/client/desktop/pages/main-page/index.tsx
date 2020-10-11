import * as React from 'react';
import {inject} from 'mobx-react';
import {RouteComponentProps} from 'react-router-dom';

import {GeneralDataModel} from 'common/models/general-data';
import bevis from 'common/lib/bevis';

import './index.scss';

import {EditText} from 'common/components/edit-text';

interface Props extends RouteComponentProps {
    generalDataModel?: GeneralDataModel;
}

const b = bevis('main-page');

@inject('generalDataModel')
export class MainPage extends React.Component<Props> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <EditText
                        type="number"
                        label="Какое-то поле"
                        measure="₽"
                        required={true}
                        error="тобi пiзда"
                        onChange={() => {}}
                    />
                </div>
            </div>
        );
    }
}
