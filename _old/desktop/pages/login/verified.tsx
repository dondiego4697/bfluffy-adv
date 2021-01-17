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
import {DOG_SVG} from 'common/svg/animal-category';

import './verified.scss';

interface Props extends RouteComponentProps {
    generalDataModel?: GeneralDataModel;
    uiModel?: UIModel;
}

interface Values {
    code: string;
}

const b = bevis('verified-page');

const validationSchema = Yup.object().shape({
    code: Yup.string().required()
});

@inject('generalDataModel', 'uiModel')
@observer
export class VerifiedPage extends React.Component<Props> {

    private getEmail() {
        const params = new URLSearchParams(this.props.location.search || '');
        return params.get('email');
    }

    private onSubmitHandler = (values: Values) => {
        const {uiModel} = this.props;
        const {code} = values;
        const email = this.getEmail();

        if (!email) {
            this.props.history.replace(RoutePaths.LOGIN);
            return Promise.resolve();
        }

        uiModel?.showSpinner();

        return UserRequestBookV1.checkVerifiedCode(email, code)
            .then(() => this.props.generalDataModel?.signIn())
            .then(() => this.props.history.replace(RoutePaths.MAIN))
            .catch((error) => ModalMessage.showError(error.response.data.message))
            .finally(() => uiModel?.destroySpinner());
    };

    public render(): React.ReactNode {
        const email = this.getEmail();

        if (this.props.generalDataModel?.user) {
            this.props.history.replace(RoutePaths.MAIN);
        }

        if (!email) {
            this.props.history.replace(RoutePaths.LOGIN);
        }

        return (
            <div className={b()}>
                <Paper>
                    <div className={b('preimage')}>
                        {DOG_SVG}
                        <h1 className={b('preimage-label')}>Вход на сайт</h1>
                    </div>
                    <Formik<Values>
                        initialValues={{code: ''}}
                        onSubmit={this.onSubmitHandler}
                        validationSchema={validationSchema}
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
