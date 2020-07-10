import * as React from 'react';
import {
	AsYouType as PhoneFormatter,
	parsePhoneNumberFromString
} from 'libphonenumber-js';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';
import {Store, RuleRender} from 'rc-field-form/lib/interface';
import {Form, Input, Select, Button, Spin} from 'antd';
import {FormInstance} from 'antd/lib/form';

import {FarmEditModel} from 'client/models/farm/edit';
import {ClientDataModel} from 'client/models/client-data';
import {RoutePaths} from 'client/lib/routes';
import bevis from 'client/lib/bevis';
import {ModalMessage} from 'client/components/modal-message';
import {NotFoundPage} from 'client/pages/not-found';
import {FORM_VALIDATE_MESSAGES, FORM_ITEM_REQUIRED, NEW_ITEM, DataState} from 'client/consts';

import './index.scss';

interface RouteParams {
    id: string;
}

interface Props extends RouteComponentProps<RouteParams> {
	farmEditModel: FarmEditModel;
	clientDataModel: ClientDataModel;
}

const {Option} = Select;

const b = bevis('farm-edit-page');

const PHONE_VALIDATOR: RuleRender = () => ({
	validator(_rule, value) {
		if (!value) {
			return Promise.resolve();
		}

		const phone = parsePhoneNumberFromString(value, 'RU');
		if (phone?.isValid()) {
			return Promise.resolve();
		}

		return Promise.reject(new Error('Невалидный телефонный номер'));
	}
});

@inject('farmEditModel', 'clientDataModel')
@observer
export class FarmEditPage extends React.Component<Props> {
	private formRef = React.createRef<FormInstance>();

	public componentWillMount() {
		this.props.farmEditModel!.clearFarm();
	}

	public componentDidMount(): void {
    	this.loadData();
	}

	public componentWillReceiveProps(nextProps: Props) {
    	if (nextProps.match.params.id !== this.props.match.params.id) {
			this.props.farmEditModel!.clearFarm();

			this.loadData(nextProps.match.params.id)
				.then(() => this.formRef.current?.resetFields());
    	}
	}

	private searchCityHandler = (cityDisplayName?: string) => this.props.farmEditModel!.findCity(cityDisplayName);

	private onFinishHandler = (values: Store) => {
    	const params = {
    		cityCode: values.cityCode.value,
    		contacts: {
    			email: values.email,
    			phone: values.phone
    		},
    		name: values.farmName,
    		description: values.farmDescription,
    		address: values.farmAddress
    	};

    	if (this.props.farmEditModel!.isNew) {
    		return this.props.farmEditModel!.createFarm(params)
    			.then((response) => this.props.history.replace(RoutePaths.FARM_EDIT.replace(':id', response.publicId)))
    			.catch((error) => ModalMessage.showError(error.response.data.message));
    	}

    	return this.props.farmEditModel!.updateFarm(params)
    		.then((response) => this.props.history.replace(RoutePaths.FARM_EDIT.replace(':id', response.publicId)))
    		.catch((error) => ModalMessage.showError(error.response.data.message));
	}

	private loadData(id?: string) {
    	const publicId = id || this.props.match.params.id;
    	if (publicId === NEW_ITEM) {
    		return Promise.resolve();
    	}

    	return this.props.farmEditModel!.getFarmInfo(publicId);
	}

	private renderForm() {
    	return (
			<Spin spinning={this.props.clientDataModel.state === DataState.LOADING}>
    			<Form
    				ref={this.formRef}
    				layout='vertical'
    				fields={this.props.farmEditModel!.formFields}
    				onFinish={this.onFinishHandler}
    				validateMessages={FORM_VALIDATE_MESSAGES}
    			>
    				<Form.Item
    					label='Название питомника'
    					name='farmName'
    					rules={[
    						FORM_ITEM_REQUIRED
    					]}
    				>
    					<Input />
    				</Form.Item>
    				<Form.Item
    					label='Описание питомника'
    					name='farmDescription'
    					rules={[]}
    				>
    					<Input.TextArea />
    				</Form.Item>
    				<Form.Item
    					label='Адрес'
    					name='farmAddress'
    					rules={[
    						FORM_ITEM_REQUIRED
    					]}
    				>
    					<Input />
    				</Form.Item>
    				<Form.Item
    					label='email'
    					name='email'
    					rules={[
    						{
    							type: 'email'
    						}
    					]}
    				>
    					<Input />
    				</Form.Item>
    				<Form.Item
    					label='Телефон'
    					name='phone'
    					normalize={(value) => {
    						const phoneFormatter = new PhoneFormatter('RU');
    						const phone = phoneFormatter.input(value);

    						if (phone === '+' || !phone) {
    							return;
    						}

    						return phone.startsWith('+') ? phone : `+${phone}`;
    					}}
    					rules={[
    						PHONE_VALIDATOR
    					]}
    				>
    					<Input />
    				</Form.Item>
    				<Form.Item
    					label='Город'
    					name='cityCode'
    					rules={[
    						FORM_ITEM_REQUIRED
    					]}
    				>
    					<Select
    						showSearch
    						defaultActiveFirstOption
    						labelInValue
    						showArrow={false}
    						filterOption={false}
    						onSearch={this.searchCityHandler}
    						notFoundContent={null}
    						style={{width: 200}}
    					>
    						{
            	                this.props.farmEditModel!.foundCities.map((city) => (
            	                	<Option
            	                		key={`search-city-${city.cityCode}`}
            	                		value={city.cityCode}
            	                	>
            	                		{city.cityDisplayName}
            	                	</Option>
            	                ))
    						}
    					</Select>
    				</Form.Item>
    				<Form.Item>
    					<Button type='primary' htmlType='submit'>
    						{this.props.farmEditModel!.isNew ? 'Сохранить' : 'Обновить'}
    					</Button>
    				</Form.Item>
    			</Form>
			</Spin>
    	);
	}

	public render(): React.ReactNode {
    	if (this.props.farmEditModel!.notFound) {
    		return <NotFoundPage />;
    	}

    	return (
  			<div className={b()}>
  				<div className={b('container')}>
    				{this.renderForm()}
    			</div>
    		</div>
    	);
	}
}
