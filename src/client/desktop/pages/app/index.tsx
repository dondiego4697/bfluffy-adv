import * as React from 'react';
import * as Yup from 'yup';
import {observer, inject} from 'mobx-react';
import {withRouter, RouteComponentProps} from 'react-router';

import bevis from 'common/lib/bevis';
import {GeneralDataModel} from 'common/models/general-data';
import {UIModel} from 'common/models/ui';
import {YupLocaleObject} from 'common/consts';
import {Popup} from 'common/components/popup';

import './index.scss';

import {UserRequestBookV1} from 'common/lib/request-book/v1/user';

interface Props extends RouteComponentProps {
    children: React.ReactNode;
    generalDataModel?: GeneralDataModel;
    uiModel?: UIModel;
}

Yup.setLocale(YupLocaleObject);

const b = bevis('root-desktop');

@inject('generalDataModel', 'uiModel')
@observer
class App extends React.Component<Props> {
    private renderSVGdef() {
        return (
            <svg width="0" height="0">
                <defs>
                    <linearGradient x1="100%" y1="0" x2="0" y2="100%" id="spinnerGradient">
                        <stop stopColor="#477DFF" offset="30%" />
                        <stop stopColor="#1294FF" offset="80%" />
                    </linearGradient>
                </defs>
            </svg>
        );
    }

    private renderGlobalPopup() {
        const {uiModel} = this.props;
        return (
            <Popup
                visible={uiModel?.popup.visible}
                title={uiModel?.popup.title}
                description={uiModel?.popup.description}
                onCloseHandler={() => uiModel?.destroyPopup()}
            />
        );
    }

    public render(): React.ReactNode {
        // TODO удалить
        UserRequestBookV1.checkVerifiedCode('dondiego4697@mail.ru', '1960');

        if (!this.props.generalDataModel?.isInitReady) {
            // TODO preloader
        }

        return (
            <div className={b()}>
                {this.renderSVGdef()}
                {this.renderGlobalPopup()}
                <div className={b('container')}>{this.props.children}</div>
            </div>
        );
    }
}

export default withRouter(App);
