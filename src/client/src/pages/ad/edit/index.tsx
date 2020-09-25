import * as Yup from 'yup';
import * as React from 'react';
import * as classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';
import {Formik, Form, Field, FieldProps} from 'formik';

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
import {EditText} from 'client/components/base/edit-text';
import {Label} from 'client/components/base/label';
import {RadioGroup} from 'client/components/base/radio-group';
import {CheckBox} from 'client/components/base/checkbox';
import {AdRequestBookV1} from 'client/lib/request-book/v1/ad';
import {ModalMessage} from 'client/components/base/modal-message';
import {RoutePaths} from 'client/lib/routes';

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
    name: string;
    breedCategoryCode: string;
    breedCode: string;
    cityCode: string;
    sex: boolean;
    price?: number;
    description?: string;
    documents: string[];
    address?: string;
}

const b = bevis('ad-edit-page');

const validationSchema = Yup.object().shape({
    breedCategoryCode: Yup.string().required(),
    breedCode: Yup.string().required(),
    sex: Yup.boolean().required(),
    address: Yup.string(),
    name: Yup.string().required(),
    documents: Yup.array().of(Yup.string()).default([]),
    description: Yup.string(),
    cityCode: Yup.string().required(),
    price: Yup.number().min(0).default(0)
});

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

    private onSubmitHandler = (values: Values) => {
        const {uiGlobal} = this.props;

        uiGlobal?.showSpinner();

        return AdRequestBookV1.createAd({
            name: values.name,
            description: values.description,
            address: values.address,
            animalBreedCode: values.breedCode,
            cityCode: values.cityCode,
            imageUrls: [],
            documents: values.documents.reduce((result, doc) => ({...result, [doc]: true}), {}),
            sex: values.sex,
            isBasicVaccinations: false,
            price: values.price || 0
        })
            .then((response) => this.props.history.replace(RoutePaths.AD_EDIT.replace(':id', response.publicId)))
            .then(() =>
                ModalMessage.showSuccess({
                    title: 'Успешно',
                    message: 'Ваше объявление успешно создано'
                })
            )
            .catch((error) => ModalMessage.showError(error.response.data.message))
            .finally(() => uiGlobal?.destroySpinner());
    };

    private renderForm() {
        return (
            <Paper>
                <Formik<Values>
                    initialValues={{
                        name: '',
                        description: '',
                        cityCode: '',
                        documents: [],
                        address: '',
                        breedCategoryCode: 'dogs',
                        breedCode: '',
                        sex: true
                    }}
                    onSubmit={this.onSubmitHandler}
                    validationSchema={validationSchema}
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
                                        error={(meta.touched && meta.error) || ''}
                                        onChange={field.onChange}
                                        maxLength={100}
                                    />
                                )}
                            />
                            <Field
                                name="description"
                                render={({meta, field}: FieldProps) => (
                                    <EditText
                                        className={classnames(b('base-input'))}
                                        maxLength={400}
                                        placeholder="Описание"
                                        type="textarea"
                                        value={field.value}
                                        name={field.name}
                                        error={(meta.touched && meta.error) || ''}
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
                                        error={(meta.touched && meta.error) || ''}
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
                                        error={(meta.touched && meta.error) || ''}
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
                                            form.setFieldValue('breedCode', key);
                                        }}
                                    />
                                )}
                            />
                            <Field
                                name="sex"
                                render={({field, form}: FieldProps) => (
                                    <RadioGroup
                                        className={classnames(b('base-input'))}
                                        selectedKey={field.value ? 'boy' : 'girl'}
                                        items={[
                                            {
                                                key: 'boy',
                                                value: 'Мальчик',
                                                image: '/image/sex-male.svg'
                                            },
                                            {
                                                key: 'girl',
                                                value: 'Девочка',
                                                image: '/image/sex-female.svg'
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
                                render={({field, form}: FieldProps) => (
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
                                    <div className={b('price-container')}>
                                        <EditText
                                            className={classnames(b('base-input'))}
                                            placeholder="Цена"
                                            type="number"
                                            value={field.value}
                                            name={field.name}
                                            error={(meta.touched && meta.error) || ''}
                                            onChange={field.onChange}
                                        />
                                        <img className={b('ruble')} src="/image/ruble.svg" />
                                    </div>
                                )}
                            />
                            <Field
                                name="cityCode"
                                render={({meta, field, form}: FieldProps) => (
                                    <SearchSelect
                                        className={classnames(b('base-input'))}
                                        placeholder="Ваш город"
                                        selectedKey={field.value}
                                        name={field.name}
                                        error={(meta.touched && meta.error) || ''}
                                        items={
                                            this.props.geoModel?.geoObjectList
                                                .filter((item) => item.type === 'city')
                                                .map((item) => ({
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
                                        error={(meta.touched && meta.error) || ''}
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

        return (
            <div className={b()}>
                <div className={b('container')}>{this.renderForm()}</div>
            </div>
        );
    }
}
