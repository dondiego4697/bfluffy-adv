import * as React from 'react';
import * as Yup from 'yup';
import {observer, inject} from 'mobx-react';
import {RouteComponentProps} from 'react-router';
import {Formik, Form, Field, FieldProps} from 'formik';

import bevis from 'common/lib/bevis';
import {GeneralDataModel} from 'common/models/general-data';
import {UserRequestBookV1} from 'common/lib/request-book/v1/user';
import {UIModel} from 'common/models/ui';
import {ModalMessage} from 'common/components/base/modal-message';
import {Button} from 'common/components/base/button';
import {EditText} from 'common/components/base/edit-text';
import {Paper} from 'common/components/base/paper';
import {RoutePaths} from 'common/lib/routes';
import {CAT_SVG} from 'common/svg/animal-category';

import './login.scss';

interface Props extends RouteComponentProps {
    generalDataModel?: GeneralDataModel;
    uiModel?: UIModel;
}

interface Values {
    email: string;
}

const b = bevis('login-page');

const validationSchema = Yup.object().shape({
    email: Yup.string().email().required()
});

@inject('generalDataModel', 'uiModel')
@observer
export class LoginPage extends React.Component<Props> {

    private onSubmitHandler = (values: Values) => {
        const {uiModel} = this.props;
        const {email} = values;

        uiModel?.showSpinner();

        // TODO сделать ограничение по времени
        // TODO сделать ограничение по времени на сервере
        return UserRequestBookV1.loginByEmail(email)
            .then(() => this.props.history.push(`${RoutePaths.LOGIN_VERIFIED}?email=${email}`))
            .catch((error) => ModalMessage.showError(error.response.data.message))
            .finally(() => uiModel?.destroySpinner());
    };

    public render(): React.ReactNode {
        if (this.props.generalDataModel?.user) {
            this.props.history.replace(RoutePaths.MAIN);
        }

        return (
            <div className={b()}>
                <Paper>
                    <div className={b('preimage')}>
                        {CAT_SVG}
                        <h1 className={b('preimage-label')}>Вход на сайт</h1>
                    </div>
                    <Formik<Values>
                        initialValues={{email: ''}}
                        validationSchema={validationSchema}
                        onSubmit={this.onSubmitHandler}
                        render={() => (
                            <Form className={b('form')}>
                                <Field
                                    name="email"
                                    render={({meta, field}: FieldProps) => (
                                        <EditText
                                            className={b('input-email')}
                                            placeholder="Адрес электронной почты"
                                            value={field.value}
                                            name={field.name}
                                            error={(meta.touched && meta.error) || ''}
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
