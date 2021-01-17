// import * as Yup from 'yup';
// import * as React from 'react';
// import * as classnames from 'classnames';
// import {inject, observer} from 'mobx-react';
// import {RouteComponentProps} from 'react-router';
// import {Formik, Form, Field, FieldArray, FieldProps} from 'formik';

// import {Button} from 'client/components/base/button';
// import {AdEditPageModel} from 'client/models/ad/edit';
// import {ClientDataModel} from 'client/models/client-data';
// import bevis from 'client/lib/bevis';
// import {Page404} from 'client/pages/404';
// import {Page401} from 'client/pages/401';
// import {UIGlobal} from 'client/models/ui-global';
// import {Paper} from 'client/components/base/paper';
// import {SearchSelect} from 'client/components/base/search-select';
// import {Select} from 'client/components/base/select';
// import {AnimalModel} from 'client/models/animal';
// import {GeoModel} from 'client/models/geo';
// import {EditText} from 'client/components/base/edit-text';
// import {Label} from 'client/components/base/label';
// import {RadioGroup} from 'client/components/base/radio-group';
// import {CheckBox} from 'client/components/base/checkbox';
// import {ModalMessage} from 'client/components/base/modal-message';
// import {RoutePaths} from 'client/lib/routes';
// import {NEW_ITEM} from 'common/consts';
// import {ImageUpload} from 'client/components/base/image-upload';
// import {AdRequestBookV1} from 'client/lib/request-book/v1/ad';

// import './index.scss';

// interface RouteParams {
//     id: string;
// }

// interface Props extends RouteComponentProps<RouteParams> {
//     adEditPageModel?: AdEditPageModel;
//     clientDataModel?: ClientDataModel;
//     uiGlobal?: UIGlobal;
//     animalModel?: AnimalModel;
//     geoModel?: GeoModel;
// }

// interface Values {
//     name: string;
//     breedCategoryCode: string;
//     breedCode: string;
//     cityCode: string;
//     sex: boolean;
//     price?: number;
//     description?: string;
//     documents: string[];
//     address?: string;
//     imageUrls: string[];
// }

// const b = bevis('ad-edit-page');

// const validationSchema = Yup.object().shape({
//     breedCategoryCode: Yup.string().required(),
//     breedCode: Yup.string().required(),
//     sex: Yup.boolean().required(),
//     address: Yup.string(),
//     name: Yup.string().required(),
//     documents: Yup.array().of(Yup.string()).default([]),
//     description: Yup.string(),
//     cityCode: Yup.string().required(),
//     price: Yup.number().min(0).default(0),
//     imageUrls: Yup.array().of(Yup.string()).default([])
// });

// const IMAGES_COUNT = 4;
// const EMPTY_IMAGE_URL = 'EMPTY_IMAGE_URL';

// @inject('adEditPageModel', 'clientDataModel', 'uiGlobal', 'animalModel', 'geoModel')
// @observer
// export class AdEditPage extends React.Component<Props> {
//     public componentWillUnmount() {
//         this.props.adEditPageModel?.clearAd();
//     }

//     public componentDidMount() {
//         this.loadData();
//     }

//     public componentDidUpdate(prevProps: Props) {
//         if (this.props.location.pathname !== prevProps.location.pathname) {
//             this.props.adEditPageModel?.clearAd();
//             this.loadData();
//         }
//     }

//     private getPublicIdFromUrl() {
//         return this.props.match.params.id;
//     }

//     private isNew() {
//         const publicId = this.getPublicIdFromUrl();
//         return publicId === NEW_ITEM;
//     }

//     private loadData() {
//         if (this.isNew()) {
//             return Promise.resolve();
//         }

//         const publicId = this.getPublicIdFromUrl();
//         this.props.adEditPageModel?.getInfo(publicId);
//     }

//     private onSubmitHandler = (values: Values) => {
//         return this.props.adEditPageModel
//             ?.createAd(this.props.match.params.id, {
//                 name: values.name,
//                 description: values.description,
//                 address: values.address,
//                 animalBreedCode: values.breedCode,
//                 cityCode: values.cityCode,
//                 imageUrls: values.imageUrls.filter((url) => url !== EMPTY_IMAGE_URL),
//                 documents: values.documents.reduce((result, doc) => ({...result, [doc]: true}), {}),
//                 sex: values.sex,
//                 isBasicVaccinations: false,
//                 price: values.price || 0
//             })
//             .then((response) => this.props.history.replace(RoutePaths.AD_EDIT.replace(':id', response.publicId)))
//             .then(() =>
//                 ModalMessage.showSuccess({
//                     title: 'Успешно',
//                     message: `Объявление ${this.isNew() ? 'создано' : 'обновлено'}`
//                 })
//             )
//             .catch((error) => ModalMessage.showError(error.response.data.message));
//     };

//     private renderForm() {
//         const ad = this.props.adEditPageModel?.ad;

//         return (
//             <Paper>
//                 <Formik<Values>
//                     enableReinitialize={true}
//                     initialValues={
//                         ad
//                             ? {
//                                   name: ad.name,
//                                   description: ad.description || '',
//                                   cityCode: ad.cityCode,
//                                   documents: Object.keys(ad.documents),
//                                   address: ad.address,
//                                   breedCategoryCode: ad.animalCategoryCode,
//                                   breedCode: ad.animalBreedCode,
//                                   sex: ad.sex,
//                                   price: ad.cost,
//                                   imageUrls: ad.imageUrls.reduce((result, url, index) => {
//                                       result[index] = url;
//                                       return result;
//                                   }, new Array(IMAGES_COUNT).fill(EMPTY_IMAGE_URL))
//                               }
//                             : {
//                                   name: '',
//                                   description: '',
//                                   cityCode: '',
//                                   documents: [],
//                                   imageUrls: new Array(IMAGES_COUNT).fill(EMPTY_IMAGE_URL),
//                                   address: '',
//                                   breedCategoryCode: 'dogs',
//                                   breedCode: '',
//                                   sex: true
//                               }
//                     }
//                     onSubmit={this.onSubmitHandler}
//                     validationSchema={validationSchema}
//                     render={({values}) => (
//                         <Form className={b('form')}>
//                             <Label size="header" text="Ваше объявление" className={b('form-header')} />
//                             <Field
//                                 name="name"
//                                 render={({meta, field}: FieldProps) => (
//                                     <EditText
//                                         className={classnames(b('base-input'))}
//                                         placeholder="Заголовок объявления"
//                                         value={field.value}
//                                         name={field.name}
//                                         error={(meta.touched && meta.error) || ''}
//                                         onChange={field.onChange}
//                                         maxLength={100}
//                                     />
//                                 )}
//                             />
//                             <Field
//                                 name="description"
//                                 render={({meta, field}: FieldProps) => (
//                                     <EditText
//                                         className={classnames(b('base-input'))}
//                                         maxLength={400}
//                                         placeholder="Описание"
//                                         type="textarea"
//                                         value={field.value}
//                                         name={field.name}
//                                         error={(meta.touched && meta.error) || ''}
//                                         onChange={field.onChange}
//                                     />
//                                 )}
//                             />
//                             <Field
//                                 name="breedCategoryCode"
//                                 render={({meta, field, form}: FieldProps) => (
//                                     <Select
//                                         className={classnames(b('base-input'))}
//                                         placeholder="Вид"
//                                         selectedKey={field.value}
//                                         name={field.name}
//                                         error={(meta.touched && meta.error) || ''}
//                                         items={
//                                             this.props.animalModel?.categoryList.map((item) => ({
//                                                 key: item.code,
//                                                 value: item.displayName
//                                             })) || []
//                                         }
//                                         onKeyChange={(key) => {
//                                             form.setFieldValue('breedCategoryCode', key);
//                                             form.setFieldValue('breedCode', undefined);
//                                         }}
//                                     />
//                                 )}
//                             />
//                             <Field
//                                 name="breedCode"
//                                 render={({meta, field, form}: FieldProps) => (
//                                     <SearchSelect
//                                         className={classnames(b('base-input'))}
//                                         selectedKey={field.value}
//                                         placeholder="Порода"
//                                         name={field.name}
//                                         error={(meta.touched && meta.error) || ''}
//                                         items={
//                                             this.props.animalModel?.breedList
//                                                 .filter(
//                                                     (item) =>
//                                                         item.categoryCode ===
//                                                         form.getFieldProps('breedCategoryCode')?.value
//                                                 )
//                                                 .map((item) => ({
//                                                     key: item.breedCode,
//                                                     value: item.breedDisplayName
//                                                 })) || []
//                                         }
//                                         onKeyChange={(key) => {
//                                             form.setFieldValue('breedCode', key);
//                                         }}
//                                     />
//                                 )}
//                             />
//                             <Field
//                                 name="sex"
//                                 render={({field, form}: FieldProps) => (
//                                     <RadioGroup
//                                         className={classnames(b('base-input'))}
//                                         selectedKey={field.value ? 'boy' : 'girl'}
//                                         items={[
//                                             {
//                                                 key: 'boy',
//                                                 value: 'Мальчик',
//                                                 image: '/image/sex-male.svg'
//                                             },
//                                             {
//                                                 key: 'girl',
//                                                 value: 'Девочка',
//                                                 image: '/image/sex-female.svg'
//                                             }
//                                         ]}
//                                         onKeyChange={(key) => {
//                                             form.setFieldValue('sex', key === 'boy' ? true : false);
//                                         }}
//                                     />
//                                 )}
//                             />
//                             <Field
//                                 name="documents"
//                                 render={({field, form}: FieldProps) => (
//                                     <CheckBox
//                                         className={classnames(b('base-input'))}
//                                         selectedKeys={field.value}
//                                         items={[
//                                             {
//                                                 key: 'vetPassport',
//                                                 value: 'Ветеринарный паспорт'
//                                             },
//                                             {
//                                                 key: 'genericMark',
//                                                 value: 'Родовая метка'
//                                             },
//                                             {
//                                                 key: 'pedigree',
//                                                 value: 'Родословная'
//                                             },
//                                             {
//                                                 key: 'contractOfSale',
//                                                 value: 'Договор купли-продажи'
//                                             },
//                                             {
//                                                 key: 'withoutDocuments',
//                                                 value: 'Без документов'
//                                             }
//                                         ]}
//                                         onChange={(keys) => {
//                                             form.setFieldValue('documents', keys);
//                                         }}
//                                     />
//                                 )}
//                             />
//                             <Field
//                                 name="price"
//                                 render={({meta, field}: FieldProps) => (
//                                     <div className={b('price-container')}>
//                                         <EditText
//                                             className={classnames(b('base-input'))}
//                                             placeholder="Цена"
//                                             type="number"
//                                             value={field.value}
//                                             name={field.name}
//                                             error={(meta.touched && meta.error) || ''}
//                                             onChange={field.onChange}
//                                         />
//                                         <img className={b('ruble')} src="/image/ruble.svg" />
//                                     </div>
//                                 )}
//                             />
//                             <Field
//                                 name="cityCode"
//                                 render={({meta, field, form}: FieldProps) => (
//                                     <SearchSelect
//                                         className={classnames(b('base-input'))}
//                                         placeholder="Ваш город"
//                                         selectedKey={field.value}
//                                         name={field.name}
//                                         error={(meta.touched && meta.error) || ''}
//                                         items={
//                                             this.props.geoModel?.geoObjectList
//                                                 .filter((item) => item.type === 'city')
//                                                 .map((item) => ({
//                                                     key: item.code,
//                                                     value: item.displayName
//                                                 })) || []
//                                         }
//                                         onKeyChange={(key) => {
//                                             form.setFieldValue('cityCode', key);
//                                         }}
//                                     />
//                                 )}
//                             />
//                             <Field
//                                 name="address"
//                                 render={({meta, field}: FieldProps) => (
//                                     <EditText
//                                         className={classnames(b('base-input'))}
//                                         placeholder="Адрес просмотра"
//                                         value={field.value}
//                                         name={field.name}
//                                         error={(meta.touched && meta.error) || ''}
//                                         onChange={field.onChange}
//                                     />
//                                 )}
//                             />
//                             <FieldArray
//                                 name="imageUrls"
//                                 render={(arrayHelpers) => {
//                                     return (
//                                         <div className={b('images-container')}>
//                                             {values.imageUrls.map((imageUrl, index) => (
//                                                 <ImageUpload
//                                                     key={`ad-edit-image-${index}`}
//                                                     icon="/image/camera.svg"
//                                                     url={imageUrl !== EMPTY_IMAGE_URL ? imageUrl : undefined}
//                                                     onUploadImage={(file) =>
//                                                         AdRequestBookV1.uploadImage(file).then(({url}) => {
//                                                             arrayHelpers.replace(index, url);
//                                                             return url;
//                                                         })
//                                                     }
//                                                 />
//                                             ))}
//                                         </div>
//                                     );
//                                 }}
//                             />
//                             <div className={b('submit-button')}>
//                                 <Button type="primary" text="Сохранить" htmlType="submit" />
//                             </div>
//                         </Form>
//                     )}
//                 />
//             </Paper>
//         );
//     }

//     public render(): React.ReactNode {
//         const {clientDataModel, adEditPageModel} = this.props;

//         if (!clientDataModel?.isReady) {
//             return <div />;
//         }

//         if (!clientDataModel?.user) {
//             return <Page401 />;
//         }

//         if (adEditPageModel?.notFound) {
//             return <Page404 />;
//         }

//         return (
//             <div className={b()}>
//                 <div className={b('container')}>{this.renderForm()}</div>
//             </div>
//         );
//     }
// }
