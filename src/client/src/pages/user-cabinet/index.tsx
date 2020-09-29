import * as classnames from 'classnames';
import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';
import {AsYouType} from 'libphonenumber-js';
import {Formik, Form, Field, FieldProps} from 'formik';

import bevis from 'client/lib/bevis';
import {UserRequestBookV1} from 'client/lib/request-book/v1/user';
import {AdRequestBookV1, AdItem} from 'client/lib/request-book/v1/ad';
import {ClientDataModel} from 'client/models/client-data';
import {Paper} from 'client/components/base/paper';
import {Label} from 'client/components/base/label';
import {AvatarUpload} from 'client/components/base/avatar-upload';
import {UIGlobal} from 'client/models/ui-global';
import {Button} from 'client/components/base/button';
import {EditText} from 'client/components/base/edit-text';
import {ModalMessage} from 'client/components/base/modal-message';
import {Page401} from 'client/pages/401';

import './index.scss';

interface Props extends RouteComponentProps {
    clientDataModel?: ClientDataModel;
    uiGlobal?: UIGlobal;
}

enum MenuItemSelected {
    MY_ADS = 'my_ads',
    SETTINGS = 'settings'
}

const menuItemSelectedText: Record<MenuItemSelected, string> = {
    [MenuItemSelected.MY_ADS]: 'Мои объявления',
    [MenuItemSelected.SETTINGS]: 'Настройки'
};

interface State {
    menuItemSelected: MenuItemSelected;
    phone: string | null;
    ads: AdItem[];
}

interface Values {
    name?: string;
    phone?: string;
}

const b = bevis('user-cabinet');

@inject('clientDataModel', 'uiGlobal')
@observer
export class UserCabinetPage extends React.Component<Props, State> {
    state: State = {
        menuItemSelected: MenuItemSelected.MY_ADS,
        phone: null,
        ads: []
    };

    public componentDidMount() {
        AdRequestBookV1.getUserAds().then((response) =>
            this.setState({
                ads: response
            })
        );
    }

    private onSaveSettingsHandler = (values: Values) => {
        const {uiGlobal} = this.props;
        const {name, phone} = values;

        uiGlobal?.showSpinner();

        return UserRequestBookV1.updateInfo({
            name,
            contacts: {
                phone
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
                <h2 className={b('display-name')}>{clientDataModel?.user?.name}</h2>
                <ul className={b('menu')}>
                    {[MenuItemSelected.MY_ADS, MenuItemSelected.SETTINGS].map((key, i) => (
                        <li
                            key={`user-cabinet-menu-control-${i}`}
                            className={key === this.state.menuItemSelected ? b('menu_selected') : ''}
                            onClick={() => this.setState({menuItemSelected: key})}
                        >
                            {menuItemSelectedText[key]}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    private renderMyAdsPanel(): React.ReactNode {
        return (
            <div className={b('my-ads-panel')}>
                {this.state.ads.map((item, index) => (
                    <div>{JSON.stringify(item)}</div>
                ))}
            </div>
        );
    }

    private renderSettingsPanel(): React.ReactNode {
        return (
            <div className={b('settings-panel')}>
                <Formik
                    initialValues={{
                        name: this.props.clientDataModel?.user?.name || '',
                        phone: this.props.clientDataModel?.user?.contacts.phone || ''
                    }}
                    onSubmit={this.onSaveSettingsHandler}
                    render={() => (
                        <Form className={b('form')}>
                            <Field
                                name="name"
                                render={({meta, field}: FieldProps) => (
                                    <EditText
                                        className={classnames('', b('input-name'))}
                                        placeholder="Ваше имя"
                                        maxLength={100}
                                        value={field.value}
                                        name={field.name}
                                        error={(meta.touched && meta.error && meta.error) || ''}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            <Field
                                name="phone"
                                render={({meta, field}: FieldProps) => (
                                    <EditText
                                        className={classnames('', b('input-phone'))}
                                        placeholder="Ваш контактный телефон"
                                        value={field.value}
                                        name={field.name}
                                        error={(meta.touched && meta.error && meta.error) || ''}
                                        onChange={(event) => {
                                            let {value} = event.target;
                                            if (value.startsWith('7')) {
                                                value = `+${value}`;
                                            }

                                            const phone = value.length < 7 ? value : new AsYouType('RU').input(value);
                                            event.target.value = phone;

                                            field.onChange(event);
                                        }}
                                    />
                                )}
                            />
                            <div className={b('submit-button')}>
                                <Button type="primary" text="Изменить" htmlType="submit" />
                            </div>
                        </Form>
                    )}
                />
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
            return <div />;
        }

        if (!clientDataModel?.user) {
            return <Page401 />;
        }

        return (
            <div className={b()}>
                <Paper>
                    <div className={b('container')}>
                        {this.renderControlPanel()}
                        {this.renderMainPanel()}
                    </div>
                </Paper>
            </div>
        );
    }
}
