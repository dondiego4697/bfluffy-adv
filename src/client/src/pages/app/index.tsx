import * as React from 'react';
import * as Yup from 'yup';
import {observer, inject} from 'mobx-react';
import {withRouter, RouteComponentProps} from 'react-router';

import {ClientDataModel} from 'client/models/client-data';
import bevis from 'client/lib/bevis';
import {Navbar} from 'client/components/navbar';
import {UIGlobal} from 'client/models/ui-global';
import {GlobalSpinner} from 'client/components/base/spinner/global-spinner';
import {Modal} from 'client/components/base/modal';
import {AnimalModel} from 'client/models/animal';
import {GeoModel} from 'client/models/geo';
import {FieldErrors} from 'client/consts';

import './index.scss';

interface Props extends RouteComponentProps {
    children: React.ReactNode;
    clientDataModel?: ClientDataModel;
    uiGlobal?: UIGlobal;
    animalModel?: AnimalModel;
    geoModel?: GeoModel;
}

const b = bevis('root');

Yup.setLocale({
    mixed: {
        required: FieldErrors.REQUIRED
    },
    number: {
        min: FieldErrors.MIN_NUMBER
    }
});

@inject('clientDataModel', 'uiGlobal', 'animalModel', 'geoModel')
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
        const {uiGlobal} = this.props;
        return <GlobalSpinner spinning={uiGlobal?.spinning} />;
    }

    private renderGlobalModal() {
        const {uiGlobal} = this.props;
        return (
            <Modal
                visible={uiGlobal?.modal.visible}
                title={uiGlobal?.modal.title}
                onCloseHandler={() => uiGlobal?.destroyModal()}
            >
                {uiGlobal?.modal.children}
            </Modal>
        );
    }

    public render(): React.ReactNode {
        if (!this.props.geoModel?.isReady || !this.props.animalModel?.isReady) {
            return (
                <div className={b('preloader')}>
                    <img src="/image/logo.svg" />
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
