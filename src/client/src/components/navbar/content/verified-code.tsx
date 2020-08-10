import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {Store} from 'rc-field-form/lib/interface';
import {Form, Input} from 'antd';

import {ClientDataModel} from 'client/models/client-data';
import bevis from 'client/lib/bevis';
import {UserRequestBookV1} from 'client/lib/request-book/v1/user';
import {ModalMessage} from 'client/components/base/modal-message';
import {Button} from 'client/components/base/button';
import {Label} from 'client/components/base/label';
import {FORM_VALIDATE_MESSAGES, FORM_ITEM_REQUIRED} from 'client/consts';

import './index.scss';

interface Props {
	clientDataModel?: ClientDataModel;
	onLoadingHandler: (isLoading: boolean) => void;
	onCloseModalHandler: () => void;
	email: string;
}

const b = bevis('login-content');

@inject('clientDataModel')
@observer
export class VerifiedCodeContent extends React.Component<Props> {
	private onFinishSignupHandler = (values: Store) => {
		this.props.onLoadingHandler(true);

		return UserRequestBookV1.checkVerifiedCode(
			this.props.email,
			values.verifiedCode
		)
			.then(() => this.props.clientDataModel?.initClientDataModel())
			.then(() => this.props.onCloseModalHandler())
    		.catch((error) => ModalMessage.showError(error.response.data.message))
			.finally(() => this.props.onLoadingHandler(false));
	}

	public render(): React.ReactNode {
    	return (
			<Form
				className={b('form')}
				layout='vertical'
				onFinish={this.onFinishSignupHandler}
				validateMessages={FORM_VALIDATE_MESSAGES}
			>
				<Label
					text='Подтверждение авторизации'
					size='header'
					className={b('header')}
				/>
				<Form.Item
					name='verifiedCode'
					className={b('verified-code-field')}
    				rules={[
    					FORM_ITEM_REQUIRED
    				]}
				>
    				<Input
						className={b('input')}
						placeholder='Код из письма'
    				/>
    			</Form.Item>
				<div className={b('info')}>
					Вам на почту
					{' '}
					<p className='bold'>{this.props.email}</p>
					{' '}
					отправлено письмо
				</div>
				<Form.Item
					className={b('login-button')}
				>
					<Button
						type='primary'
						text='Подтвердить'
    					htmlType='submit'
					/>
				</Form.Item>
			</Form>
		);
	}
}
