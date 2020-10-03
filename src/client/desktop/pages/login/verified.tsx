import * as React from 'react';
import {observer, inject} from 'mobx-react';
import {RouteComponentProps} from 'react-router';
import {Formik, FormikErrors, Form, Field, FieldProps} from 'formik';

import bevis from 'client/lib/bevis';
import {ClientDataModel} from 'client/models/client-data';
import {Paper} from 'client/components/base/paper';
import {UserRequestBookV1} from 'client/lib/request-book/v1/user';
import {ModalMessage} from 'client/components/base/modal-message';
import {Button} from 'client/components/base/button';
import {EditText} from 'client/components/base/edit-text';
import {RoutePaths} from 'client/lib/routes';
import {Label} from 'client/components/base/label';
import {UIGlobal} from 'client/models/ui-global';
import {FieldErrors} from 'common/consts';
import {DOG_BASE64} from 'client/pages/login/image';

import './verified.scss';

interface Props extends RouteComponentProps {
    clientDataModel?: ClientDataModel;
    uiGlobal?: UIGlobal;
}

interface Values {
    code: string;
}

const b = bevis('verified-page');

@inject('clientDataModel', 'uiGlobal')
@observer
export class VerifiedPage extends React.Component<Props> {
    private onValidateHandler = (values: Values) => {
        const errors: FormikErrors<Values> = {};
        if (!values.code) {
            errors.code = FieldErrors.REQUIRED;
        }
        return errors;
    };

    private getEmail() {
        const params = new URLSearchParams(this.props.location.search || '');
        return params.get('email');
    }

    private onSubmitHandler = (values: Values) => {
        const {uiGlobal} = this.props;
        const {code} = values;
        const email = this.getEmail();

        if (!email) {
            this.props.history.replace(RoutePaths.LOGIN);
            return Promise.resolve();
        }

        uiGlobal?.showSpinner();

        return UserRequestBookV1.checkVerifiedCode(email, code)
            .then(() => this.props.clientDataModel?.initClientDataModel())
            .then(() => this.props.history.replace(RoutePaths.MAIN))
            .catch((error) => ModalMessage.showError(error.response.data.message))
            .finally(() => uiGlobal?.destroySpinner());
    };

    public render(): React.ReactNode {
        const email = this.getEmail();

        if (this.props.clientDataModel?.user) {
            this.props.history.replace(RoutePaths.MAIN);
        }

        if (!email) {
            this.props.history.replace(RoutePaths.LOGIN);
        }

        return (
            <div className={b()}>
                <Paper>
                    <div className={b('preimage')}>
                        <img className="image" src={DOG_BASE64} />
                        <Label size="header" text="Код из письма" className={b('preimage-label')} />
                    </div>
                    <Formik
                        initialValues={{code: ''}}
                        onSubmit={this.onSubmitHandler}
                        validate={this.onValidateHandler}
                        render={() => (
                            <Form className={b('form')}>
                                <div className={b('info')}>
                                    На почту <p className="bold">{email}</p> отправлено письмо
                                </div>
                                <Field
                                    name="code"
                                    render={({meta, field}: FieldProps) => (
                                        <EditText
                                            className={b('input-code')}
                                            placeholder="Код из письма"
                                            value={field.value}
                                            name={field.name}
                                            error={(meta.touched && meta.error && meta.error) || ''}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                                <div className={b('submit-button')}>
                                    <Button type="primary" text="Подтвердить" htmlType="submit" />
                                </div>
                            </Form>
                        )}
                    />
                    <Button
                        type="link"
                        className={b('another-email')}
                        text="Ввести другой email"
                        hrefTo={RoutePaths.LOGIN}
                    />
                </Paper>
            </div>
        );
    }
}
