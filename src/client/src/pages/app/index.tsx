import * as React from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter, RouteComponentProps} from 'react-router';

import {ClientDataModel} from 'client/models/client-data';
import bevis from 'client/lib/bevis';
import {Navbar} from 'client/components/navbar';
import {UIGlobal} from 'client/models/ui-global';
import {GlobalSpinner} from 'client/components/base/spinner/global-spinner';
import {Modal} from 'client/components/base/modal';

import './index.scss';

interface Props extends RouteComponentProps {
    children: React.ReactNode;
    clientDataModel?: ClientDataModel;
    uiGlobal?: UIGlobal;
}

const b = bevis('root');

@inject('clientDataModel', 'uiGlobal')
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
