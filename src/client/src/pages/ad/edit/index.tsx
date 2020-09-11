import * as React from 'react';
import * as classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';

import {Button} from 'client/components/base/button';
import {AdEditPageModel} from 'client/models/ad/edit';
import {ClientDataModel} from 'client/models/client-data';
import bevis from 'client/lib/bevis';
import {NotFoundPage} from 'client/pages/not-found';
import {NEW_ITEM} from 'client/consts';
import {UIGlobal} from 'client/models/ui-global';
import {Paper} from 'client/components/base/paper';
import {GeoSelect} from 'client/components/base/custom-select/geo';
import {AnimalCategorySelect} from 'client/components/base/custom-select/animal-category';
import {AnimalBreedSelect} from 'client/components/base/custom-select/animal-breed';
import {AnimalModel} from 'client/models/animal';
import {GeoModel} from 'client/models/geo';
import {Spinner} from 'client/components/base/spinner/spinner';
import {EditText} from 'client/components/base/edit-text';

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

const b = bevis('ad-edit-page');

@inject('adEditPageModel', 'clientDataModel', 'uiGlobal', 'animalModel', 'geoModel')
@observer
export class AdEditPage extends React.Component<Props> {
    // public componentWillMount() {
    // 	this.props.farmEditModel!.clearFarm();
    // }

    public componentDidMount(): void {
        this.loadData();
    }

    // public componentWillReceiveProps(nextProps: Props) {
    // 	if (nextProps.match.params.id !== this.props.match.params.id) {
    // 		this.props.farmEditModel!.clearFarm();

    // 		this.loadData(nextProps.match.params.id)
    // 			.then(() => this.formRef.current?.resetFields());
    // 	}
    // }

    // private searchCityHandler = (cityDisplayName?: string) => this.props.farmEditModel!.findCity(cityDisplayName);

    // private onFinishHandler = (values: Store) => {
    // 	const params = {
    // 		cityCode: values.cityCode.value,
    // 		contacts: {
    // 			email: values.email,
    // 			phone: values.phone
    // 		},
    // 		name: values.farmName,
    // 		description: values.farmDescription,
    // 		address: values.farmAddress
    // 	};

    // 	if (this.props.farmEditModel!.isNew) {
    // 		return this.props.farmEditModel!.createFarm(params)
    // 			.then((response) => this.props.history.replace(RoutePaths.FARM_EDIT.replace(':id', response.publicId)))
    // 			.catch((error) => ModalMessage.showError(error.response.data.message));
    // 	}

    // 	return this.props.farmEditModel!.updateFarm(params)
    // 		.then((response) => this.props.history.replace(RoutePaths.FARM_EDIT.replace(':id', response.publicId)))
    // 		.catch((error) => ModalMessage.showError(error.response.data.message));
    // }

    private loadData(id?: string) {
        const publicId = id || this.props.match.params.id;
        if (publicId === NEW_ITEM) {
            return Promise.resolve();
        }

        return this.props.adEditPageModel?.getInfo(publicId);
    }

    private onSaveAdHandler = (values: any) => {
        const {uiGlobal} = this.props;
        uiGlobal?.showSpinner();

        console.log(values);
    };

    private renderForm() {
        // TODO переработать компоненты select

        // 1. Сделать один с выпадашкой обычно
        // 2. Сделать один с поиском
        // 3. Сделать свой radio button group

        return (
            <Paper>
                {/* <EditText
                    placeholder={'что-то'}
                    onChange={(value) => console.log(value)}
                    label='xnj'
                />
    		    <Form
    		    	className={b('form')}
    		    	layout='vertical'
                    onFinish={this.onSaveAdHandler}
                    validateMessages={FORM_VALIDATE_MESSAGES}
    		    >
                    <Form.Item className={'EDIT_TEXT_FORM_ITEM_CLASS_NAME'} name='city'>
                        <GeoSelect
                            label='Ваш город'
                            onChange={(code) => console.log(code)}
                        />
                    </Form.Item>
                    <Form.Item className={'EDIT_TEXT_FORM_ITEM_CLASS_NAME'} name='category'>
                        <AnimalCategorySelect
                            label='Категория'
                            onChange={(code) => {
                                this.props.adEditPageModel?.updateCategoryCode(code);
                            }}
                        />
                    </Form.Item>
                    <Form.Item className={'EDIT_TEXT_FORM_ITEM_CLASS_NAME'} name='type'>
                        <AnimalBreedSelect
                            categoryCodeSelected={this.props.adEditPageModel?.categoryCodeSelected}
                            label='Вид или порода'
                            onChange={(code) => console.log(code)}
                        />
                    </Form.Item>
                    <Form.Item className={'EDIT_TEXT_FORM_ITEM_CLASS_NAME'} name='sex'>
                        <p className={b('label')}>Пол</p>
                        <Radio.Group
                            defaultValue={1}
                            onChange={(event) => console.log(event.target.value)}
                        >
                            <Radio className={b('radio-sex')} value={0}>
                                Девочка
                            </Radio>
                            <Radio className={b('radio-sex')} value={1}>
                                Мальчик
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item className={'EDIT_TEXT_FORM_ITEM_CLASS_NAME'} name='documents'>
                        <Input
                            className={classnames('', b('input-documents'))}
                            placeholder='Документы'
                        />
                    </Form.Item>
                    <Form.Item className={'EDIT_TEXT_FORM_ITEM_CLASS_NAME'} name='price'>
                        <Input
                            className={classnames('', b('input-price'))}
                            placeholder='Цена'
                        />
                    </Form.Item>
                    <Form.Item className={'EDIT_TEXT_FORM_ITEM_CLASS_NAME'} name='address'>
                        <Input
                            className={classnames('EDIT_TEXT_ROOT_CLASS_NAME', b('input-address'))}
                            placeholder='Адрес осмотра'
                        />
                    </Form.Item>
                    <Form.Item className={'EDIT_TEXT_FORM_ITEM_CLASS_NAME'} name='title'>
                        <Input
                            className={classnames('EDIT_TEXT_ROOT_CLASS_NAME', b('input-title'))}
                            placeholder='Заголовок объявления'
                        />
                    </Form.Item>
                    <Form.Item className={'EDIT_TEXT_FORM_ITEM_CLASS_NAME'} name='description'>
                        <Input
                            className={classnames('EDIT_TEXT_ROOT_CLASS_NAME', b('input-description'))}
                            placeholder='Описание'
                        />
                    </Form.Item>
                    <Form.Item className={b('submit-button')}>
                        <Button
                            type='primary'
                            htmlType='submit'
                            text={this.props.adEditPageModel?.isNew ? 'Сохранить' : 'Обновить'}
                        />
                    </Form.Item>
    		    </Form> */}
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
