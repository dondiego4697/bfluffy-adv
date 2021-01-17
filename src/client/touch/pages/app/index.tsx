import * as React from 'react';
import * as Yup from 'yup';
import {observer, inject} from 'mobx-react';
import {withRouter, RouteComponentProps} from 'react-router';

import bevis from 'common/lib/bevis';
import {GeneralDataModel} from 'common/models/general-data';
import {UIModel} from 'common/models/ui';
import {YupLocaleObject} from 'common/consts';

import './index.scss';

interface Props extends RouteComponentProps {
    children: React.ReactNode;
    generalDataModel?: GeneralDataModel;
    uiModel?: UIModel;
}

Yup.setLocale(YupLocaleObject);

const b = bevis('root-touch');

@inject('generalDataModel', 'uiModel')
@observer
class App extends React.Component<Props> {
    public render(): React.ReactNode {
        if (!this.props.generalDataModel?.isInitReady) {
            // TODO preloader
        }

        return (
            <div className={b()}>
                <div className={b('container')}>{this.props.children}</div>
            </div>
        );
    }
}

export default withRouter(App);
