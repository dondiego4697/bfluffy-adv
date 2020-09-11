import * as classnames from 'classnames';
import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';
import {AsYouType} from 'libphonenumber-js';

import {UserRequestBookV1} from 'client/lib/request-book/v1/user';
import {ClientDataModel} from 'client/models/client-data';
import {Paper} from 'client/components/base/paper';
import {Label} from 'client/components/base/label';
import {AvatarUpload} from 'client/components/base/avatar-upload';
import bevis from 'client/lib/bevis';
import {UIGlobal} from 'client/models/ui-global';
import {Button} from 'client/components/base/button';
import {ModalMessage} from 'client/components/base/modal-message';
import {Spinner} from 'client/components/base/spinner/spinner';

import './index.scss';

interface Props extends RouteComponentProps {
    clientDataModel?: ClientDataModel;
    uiGlobal?: UIGlobal;
}

enum MenuItemSelected {
    MY_ADS = 'my_ads',
    SETTINGS = 'settings'
}

interface State {
    menuItemSelected: MenuItemSelected;
    phone: string | null;
}

const b = bevis('user-cabinet');

@inject('clientDataModel', 'uiGlobal')
@observer
export class UserCabinetPage extends React.Component<Props, State> {
    state: State = {
        menuItemSelected: MenuItemSelected.MY_ADS,
        phone: null
    };

    private onSaveSettingsHandler = (values: any) => {
        const {uiGlobal} = this.props;

        uiGlobal?.showSpinner();

        return UserRequestBookV1.updateInfo({
            name: values.name || null,
            contacts: {
                phone: values.phone || null
            }
        })
            .then(() => this.props.clientDataModel?.initClientDataModel())
            .catch((error) => ModalMessage.showError(error.response.data.message))
            .finally(() => uiGlobal?.destroySpinner());
    };

    private renderControlPanel(): React.ReactNode {
        const {clientDataModel} = this.props;

        return (
            <div className={b('control-panel')}>
                <AvatarUpload url={clientDataModel?.user?.avatar} />
                <h2 className="display-name">{clientDataModel?.user?.name}</h2>
                {/* <Menu
                    className={b('menu')}
                    selectedKeys={[this.state.menuItemSelected]}
                    onSelect={({key}) =>
                        this.setState({
                            menuItemSelected: key as MenuItemSelected
                        })
                    }
                >
                    <Menu.Item key={MenuItemSelected.MY_ADS}>Мои объявления</Menu.Item>
                    <Menu.Item key={MenuItemSelected.SETTINGS}>Настройки</Menu.Item>
                </Menu> */}
            </div>
        );
    }

    private renderMyAdsPanel(): React.ReactNode {
        return <div className={b('my-ads-panel')} />;
    }

    private renderSettingsPanel(): React.ReactNode {
        return (
            <div className={b('settings-panel')}>
                {/* <Form
                    className={b('form')}
                    layout="vertical"
                    onFinish={this.onSaveSettingsHandler}
                    validateMessages={FORM_VALIDATE_MESSAGES}
                    fields={[
                        {
                            name: 'name',
                            value: this.props.clientDataModel?.user?.name
                        },
                        {
                            name: 'phone',
                            value:
                                this.state.phone === null
                                    ? this.props.clientDataModel?.user?.contacts.phone
                                    : this.state.phone
                        }
                    ]}
                >
                    <Form.Item className={'EDIT_TEXT_FORM_ITEM_CLASS_NAME'} name="name">
                        <Input
                            className={classnames('EDIT_TEXT_ROOT_CLASS_NAME', b('input-name'))}
                            placeholder="Ваше имя"
                            maxLength={100}
                        />
                    </Form.Item>
                    <Form.Item className={'EDIT_TEXT_FORM_ITEM_CLASS_NAME'} name="phone">
                        <Input
                            className={classnames('EDIT_TEXT_ROOT_CLASS_NAME', b('input-phone'))}
                            placeholder="Ваш контактный телефон"
                            onChange={(event) => {
                                const {value} = event.target;

                                const phone = value.length < 7 ? value : new AsYouType('RU').input(value);

                                this.setState({
                                    phone
                                });
                            }}
                        />
                    </Form.Item>
                    <Form.Item className={b('submit-button')}>
                        <Button type="primary" text="Изменить" htmlType="submit" />
                    </Form.Item>
                </Form> */}
            </div>
        );
    }

    private renderMainPanel(): React.ReactNode {
        return (
            <div className={b('main-panel')}>
                <Label
                    className="title"
                    size="large"
                    text={this.state.menuItemSelected === MenuItemSelected.SETTINGS ? 'Настройки' : 'Мои объявления'}
                />
                {this.state.menuItemSelected === MenuItemSelected.SETTINGS
                    ? this.renderSettingsPanel()
                    : this.renderMyAdsPanel()}
            </div>
        );
    }

    public render(): React.ReactNode {
        const {clientDataModel} = this.props;

        if (!clientDataModel?.isReady) {
            return <Spinner />;
        }

        return (
            <div className={b()}>
                <Paper>
                    {clientDataModel?.user ? (
                        <div className={b('container')}>
                            {this.renderControlPanel()}
                            {this.renderMainPanel()}
                        </div>
                    ) : clientDataModel?.isReady ? (
                        <Label className={b('not-authorized')} text="Вы не авторизованы" />
                    ) : (
                        <div className={b('container')} />
                    )}
                </Paper>
            </div>
        );
    }
}
