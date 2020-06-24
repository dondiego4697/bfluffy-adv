import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';
import {Store} from 'rc-field-form/lib/interface';
import {
	Form, Input, Select, Button
} from 'antd';

import {FarmEditModel} from 'client/models/farm/edit';
import {RoutePaths} from 'client/lib/routes';
import {GeoModel} from 'client/models/geo';
import bevis from 'client/lib/bevis';
import {ModalMessage} from 'client/components/modal-message';
import {FORM_VALIDATE_MESSAGES, FORM_ITEM_REQUIRED} from 'client/consts';

import './index.scss';

interface Props extends RouteComponentProps {
    farmEditModel?: FarmEditModel;
    geoModel?: GeoModel;
}

const {Option} = Select;

const b = bevis('farm-edit-page');

@inject('farmEditModel', 'geoModel')
@observer
export class FarmEditPage extends React.Component<Props> {
    private onFinishHandler = (values: Store) => this.props.farmEditModel!.createFarm({
    	cityCode: values.cityCode,
	        contacts: {
    		email: values.email,
    		phone: values.phone
    	},
	        name: values.name,
	        description: values.description,
	        address: values.address
    })
    	.then(() => this.props.history.replace(RoutePaths.FARM_EDIT))
    		.catch((error) => ModalMessage.showError(error.message))

    private handleCitySearch = (cityDisplayName?: string) => {
    	if (!cityDisplayName) {
    		return [];
    	}

        this.props.farmEditModel!.foundCities = this.props.geoModel!.findCityByName(cityDisplayName);
    }

    private renderForm() {
    	return (
    		<Form
    			layout='vertical'
    			fields={this.props.farmEditModel!.formFields}
    			onFinish={this.onFinishHandler}
    			validateMessages={FORM_VALIDATE_MESSAGES}
    		>
    			<Form.Item
    				label='Название питомника'
    				name='name'
    				rules={[
    					FORM_ITEM_REQUIRED
    				]}
    			>
    				<Input />
    			</Form.Item>
    			<Form.Item
    				label='Описание питомника'
    				name='description'
    				rules={[
    					FORM_ITEM_REQUIRED
    				]}
    			>
    				<Input.TextArea />
    			</Form.Item>
    			<Form.Item
    				label='Адрес'
    				name='address'
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
    				rules={[]}
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
    					showArrow={false}
    					filterOption={false}
    					onSearch={this.handleCitySearch}
    					// onChange={this.handleCityChange}
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
                        Сохранить
    				</Button>
    			</Form.Item>
    		</Form>
    	);
    }

    public render(): React.ReactNode {
    	return (
  			<div className={b()}>
  				<div className={b('container')}>
    				{this.renderForm()}
    			</div>
    		</div>
    	);
    }
}
