import * as React from 'react';
import * as classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';
import {Formik, FormikErrors, Form, Field, FieldProps} from 'formik';

import {Button} from 'client/components/base/button';
import {AdEditPageModel} from 'client/models/ad/edit';
import {ClientDataModel} from 'client/models/client-data';
import bevis from 'client/lib/bevis';
import {NotFoundPage} from 'client/pages/not-found';
import {NEW_ITEM} from 'client/consts';
import {UIGlobal} from 'client/models/ui-global';
import {Paper} from 'client/components/base/paper';
import {SearchSelect} from 'client/components/base/search-select';
import {Select} from 'client/components/base/select';
import {AnimalModel} from 'client/models/animal';
import {GeoModel} from 'client/models/geo';
import {Spinner} from 'client/components/base/spinner/spinner';
import {EditText} from 'client/components/base/edit-text';
import {Label} from 'client/components/base/label';
import {RadioGroup} from 'client/components/base/radio-group';
import {CheckBox} from 'client/components/base/checkbox';

import './index.scss';

interface RouteParams {
    id: string;
}

interface Props extends RouteComponentProps<RouteParams> {
    adEditPageModel?: AdEditPageModel;
    clientDataModel?: ClientDataModel;
    uiGlobal?: UIGlobal;
    animalModel?: AnimalModel;
    geoModel?: GeoModel;
}

interface Values {
    breedCategoryCode: string;
    sex: boolean;
    documents?: string[];
    address?: string;
    name?: string;
    description?: string;
    cityCode?: string;
    breedCode?: string;
    price?: number;
}

const b = bevis('ad-edit-page');

@inject('adEditPageModel', 'clientDataModel', 'uiGlobal', 'animalModel', 'geoModel')
@observer
export class AdEditPage extends React.Component<Props> {
    public componentWillUnmount() {
        this.props.adEditPageModel?.clearAd();
    }

    public componentDidMount(): void {
        this.loadData();
    }

    private loadData(id?: string) {
        const publicId = id || this.props.match.params.id;
        if (publicId === NEW_ITEM) {
            return Promise.resolve();
        }

        return this.props.adEditPageModel?.getInfo(publicId);
    }

    private onValidateHandler = (values: Values) => {
        // TODO install Yup
    };

    private onSubmitHandler = (values: Values) => {
        console.log(values);
        // const {uiGlobal} = this.props;

        // uiGlobal?.showSpinner();

        // return UserRequestBookV1.loginByEmail(email)
        //     .then(() => this.props.history.push(`${RoutePaths.LOGIN_VERIFIED}?email=${email}`))
        //     .catch((error) => ModalMessage.showError(error.response.data.message))
        //     .finally(() => uiGlobal?.destroySpinner());
    };

    private renderForm() {
        return (
            <Paper>
                <Formik<Values>
                    initialValues={{
                        breedCategoryCode: 'dogs',
                        sex: true
                    }}
                    onSubmit={this.onSubmitHandler}
                    validate={this.onValidateHandler}
                    render={() => (
                        <Form className={b('form')}>
                            <Label size="header" text="Ваше объявление" className={b('form-header')} />
                            <Field
                                name="name"
                                render={({meta, field}: FieldProps) => (
                                    <EditText
                                        className={classnames(b('base-input'))}
                                        placeholder="Заголовок объявления"
                                        value={field.value}
                                        name={field.name}
                                        error={(meta.touched && meta.error && meta.error) || ''}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            <Field
                                name="description"
                                render={({meta, field}: FieldProps) => (
                                    <EditText
                                        className={classnames(b('base-input'))}
                                        placeholder="Описание"
                                        value={field.value}
                                        name={field.name}
                                        error={(meta.touched && meta.error && meta.error) || ''}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            <Field
                                name="breedCategoryCode"
                                render={({meta, field, form}: FieldProps) => (
                                    <Select
                                        className={classnames(b('base-input'))}
                                        placeholder="Вид"
                                        selectedKey={field.value}
                                        name={field.name}
                                        error={(meta.touched && meta.error && meta.error) || ''}
                                        items={
                                            this.props.animalModel?.categoryList.map((item) => ({
                                                key: item.code,
                                                value: item.displayName
                                            })) || []
                                        }
                                        onKeyChange={(key) => {
                                            form.setFieldValue('breedCategoryCode', key);
                                            form.setFieldValue('breedCode', undefined);
                                        }}
                                    />
                                )}
                            />
                            <Field
                                name="breedCode"
                                render={({meta, field, form}: FieldProps) => (
                                    <SearchSelect
                                        className={classnames(b('base-input'))}
                                        selectedKey={field.value}
                                        placeholder="Порода"
                                        name={field.name}
                                        error={(meta.touched && meta.error && meta.error) || ''}
                                        items={
                                            this.props.animalModel?.breedList
                                                .filter(
                                                    (item) =>
                                                        item.categoryCode ===
                                                        form.getFieldProps('breedCategoryCode')?.value
                                                )
                                                .map((item) => ({
                                                    key: item.breedCode,
                                                    value: item.breedDisplayName
                                                })) || []
                                        }
                                        onKeyChange={(key) => {
                                            console.log(123123, key);
                                            form.setFieldValue('breedCode', key);
                                        }}
                                    />
                                )}
                            />
                            <Field
                                name="sex"
                                render={({meta, field, form}: FieldProps) => (
                                    <RadioGroup
                                        className={classnames(b('base-input'))}
                                        selectedKey={field.value ? 'boy' : 'girl'}
                                        items={[
                                            {
                                                key: 'boy',
                                                value: 'Мальчик'
                                            },
                                            {
                                                key: 'girl',
                                                value: 'Девочка'
                                            }
                                        ]}
                                        onKeyChange={(key) => {
                                            form.setFieldValue('sex', key === 'boy' ? true : false);
                                        }}
                                    />
                                )}
                            />
                            <Field
                                name="documents"
                                render={({meta, field, form}: FieldProps) => (
                                    <CheckBox
                                        className={classnames(b('base-input'))}
                                        selectedKeys={field.value}
                                        items={[
                                            {
                                                key: 'vetPassport',
                                                value: 'Ветеринарный паспорт'
                                            },
                                            {
                                                key: 'genericMark',
                                                value: 'Родовая метка'
                                            },
                                            {
                                                key: 'pedigree',
                                                value: 'Родословная'
                                            },
                                            {
                                                key: 'contractOfSale',
                                                value: 'Договор купли-продажи'
                                            },
                                            {
                                                key: 'withoutDocuments',
                                                value: 'Без документов'
                                            }
                                        ]}
                                        onChange={(keys) => {
                                            form.setFieldValue('documents', keys);
                                        }}
                                    />
                                )}
                            />
                            <Field
                                name="price"
                                render={({meta, field}: FieldProps) => (
                                    <EditText
                                        className={classnames(b('base-input'))}
                                        placeholder="Цена"
                                        type="number"
                                        value={field.value}
                                        name={field.name}
                                        error={(meta.touched && meta.error && meta.error) || ''}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            <Field
                                name="cityCode"
                                render={({meta, field, form}: FieldProps) => (
                                    <SearchSelect
                                        className={classnames(b('base-input'))}
                                        placeholder="Ваш город"
                                        name={field.name}
                                        error={(meta.touched && meta.error && meta.error) || ''}
                                        items={
                                            this.props.geoModel?.geoObjectList.map((item) => ({
                                                key: item.code,
                                                value: item.displayName
                                            })) || []
                                        }
                                        onKeyChange={(key) => {
                                            form.setFieldValue('cityCode', key);
                                        }}
                                    />
                                )}
                            />
                            <Field
                                name="address"
                                render={({meta, field}: FieldProps) => (
                                    <EditText
                                        className={classnames(b('base-input'))}
                                        placeholder="Адрес осмотра"
                                        value={field.value}
                                        name={field.name}
                                        error={(meta.touched && meta.error && meta.error) || ''}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            <div className={b('submit-button')}>
                                <Button type="primary" text="Сохранить" htmlType="submit" />
                            </div>
                        </Form>
                    )}
                />
            </Paper>
        );
    }

    public render(): React.ReactNode {
        if (this.props.adEditPageModel?.notFound) {
            return <NotFoundPage />;
        }

        if (!this.props.geoModel?.isReady || !this.props.animalModel?.isReady) {
            return <Spinner />;
        }

        return (
            <div className={b()}>
                <div className={b('container')}>{this.renderForm()}</div>
            </div>
        );
    }
}
