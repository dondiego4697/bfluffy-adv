import * as React from 'react';
import * as Yup from 'yup';
import {observer, inject} from 'mobx-react';
import {withRouter, RouteComponentProps} from 'react-router';

import bevis from 'common/lib/bevis';
import {GeneralDataModel} from 'common/models/general-data';
import {UIModel} from 'common/models/ui';
import {Modal} from 'common/components/base/modal';
import {GlobalSpinner} from 'common/components/base/spinner/global-spinner';
import {LOGO_SVG} from 'common/svg/icons';
import {YupLocaleObject} from 'common/consts';
import {Navbar} from 'touch/components/navbar';

import './index.scss';

interface Props extends RouteComponentProps {
    children: React.ReactNode;
    generalDataModel?: GeneralDataModel;
    uiModel?: UIModel;
}

Yup.setLocale(YupLocaleObject);

const b = bevis('root');

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

    private renderGlobalSpinner() {
        const {uiModel} = this.props;
        return <GlobalSpinner spinning={uiModel?.spinning} />;
    }

    private renderGlobalModal() {
        const {uiModel} = this.props;
        return (
            <Modal
                visible={uiModel?.modal.visible}
                title={uiModel?.modal.title}
                onCloseHandler={() => uiModel?.destroyModal()}
            >
                {uiModel?.modal.children}
            </Modal>
        );
    }

    public render(): React.ReactNode {
        if (!this.props.generalDataModel?.isInitReady) {
            return (
                <div className={b('init-preloader')}>
                    {LOGO_SVG}
                </div>
            );
        }

        return (
            <div className={b()}>
                {this.renderSVGdef()}
                {this.renderGlobalSpinner()}
                {this.renderGlobalModal()}
                <div className={b('container')}>
                    <Navbar />
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default withRouter(App);
