import * as React from 'react';
import {inject} from 'mobx-react';

import {ClientDataModel} from 'client/models/client-data';
import bevis from 'client/lib/bevis';

import './index.scss';

interface Props {
    clientDataModel?: ClientDataModel;
}

const b = bevis('not-auth-page');

@inject('clientDataModel')
export class Page401 extends React.Component<Props> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <h2>401</h2>
                </div>
            </div>
        );
    }
}
