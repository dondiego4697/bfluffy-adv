import * as React from 'react';
import * as classnames from 'classnames';
import {pickBy, identity} from 'lodash';
import {observer, inject} from 'mobx-react';
import {RouteComponentProps} from 'react-router';
import {Formik, FormikErrors, Form, Field, FieldProps} from 'formik';

import bevis from 'client/lib/bevis';
import {ClientDataModel} from 'client/models/client-data';
import {UserRequestBookV1} from 'client/lib/request-book/v1/user';
import {ModalMessage} from 'client/components/base/modal-message';
import {Button} from 'client/components/base/button';
import {EditText} from 'client/components/base/edit-text';
import {Paper} from 'client/components/base/paper';
import {Label} from 'client/components/base/label';
import {UIGlobal} from 'client/models/ui-global';
import {RoutePaths} from 'client/lib/routes';
import {validateEmail} from 'client/consts';

import './login.scss';

interface Props extends RouteComponentProps {
    clientDataModel?: ClientDataModel;
    uiGlobal?: UIGlobal;
}

interface Values {
    email: string;
}

const b = bevis('login-page');

@inject('clientDataModel', 'uiGlobal')
@observer
export class LoginPage extends React.Component<Props> {
    private onValidateHandler = (values: Values) => {
        const errors: FormikErrors<Values> = {};
        errors.email = validateEmail(values.email);
        return pickBy(errors, identity);
    };

    private onSubmitHandler = (values: Values) => {
        const {uiGlobal} = this.props;
        const {email} = values;

        uiGlobal?.showSpinner();

        // TODO сделать ограничение по времени
        // TODO сделать ограничение по времени на сервере
        return UserRequestBookV1.loginByEmail(email)
            .then(() => this.props.history.push(`${RoutePaths.LOGIN_VERIFIED}?email=${email}`))
            .catch((error) => ModalMessage.showError(error.response.data.message))
            .finally(() => uiGlobal?.destroySpinner());
    };

    public render(): React.ReactNode {
        if (this.props.clientDataModel?.user) {
            this.props.history.replace(RoutePaths.MAIN);
        }

        return (
            <div className={b()}>
                <Paper>
                    <div className={b('preimage')}>
                        <img className="image" src="/image/animal-category/cat.svg" />
                        <Label size="header" text="Вход на сайт" className={b('preimage-label')} />
                    </div>
                    <Formik
                        initialValues={{email: ''}}
                        onSubmit={this.onSubmitHandler}
                        validate={this.onValidateHandler}
                        render={() => (
                            <Form className={b('form')}>
                                <Field
                                    name="email"
                                    render={({meta, field}: FieldProps) => (
                                        <EditText
                                            className={classnames('', b('input-email'))}
                                            placeholder="Адрес электронной почты"
                                            value={field.value}
                                            name={field.name}
                                            error={(meta.touched && meta.error && meta.error) || ''}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                                <div className={b('submit-button')}>
                                    <Button type="primary" text="Войти" htmlType="submit" />
                                </div>
                            </Form>
                        )}
                    />
                </Paper>
            </div>
        );
    }
}
