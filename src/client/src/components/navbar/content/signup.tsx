import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {Store, RuleRender} from 'rc-field-form/lib/interface';
import {Form, Input, Button} from 'antd';

import {ClientDataModel} from 'client/models/client-data';
import bevis from 'client/lib/bevis';
import {UserRequestBookV1} from 'client/lib/request-book/v1/user';
import {ModalMessage} from 'client/components/modal-message';
import {FORM_VALIDATE_MESSAGES, FORM_ITEM_REQUIRED, FORM_EMAIL_REQUIRED} from 'client/consts';

import './index.scss';

interface Props {
	clientDataModel?: ClientDataModel;
	onLoadingHandler: (isLoading: boolean) => void;
	onCloseModalHandler: () => void;
}

const EMAIL_VALIDATOR: RuleRender = () => ({
	validator(_rule, value) {
		if (!value) {
			return Promise.resolve();
		}

		return UserRequestBookV1.checkEmail(value)
			.then((body) => {
				if (body.exist) {
					throw new Error('Такой email уже существует');
				}
			});
	}
});

const b = bevis('login-content');

@inject('clientDataModel')
@observer
export class SignupContent extends React.Component<Props> {
	private onFinishSignupHandler = (values: Store) => {
		this.props.onLoadingHandler(true);

		return UserRequestBookV1.signUpByEmail({
			email: values.email,
			name: values.name,
			password: values.password
		})
			.then(() => ModalMessage.showSuccess({
				title: 'Успешно',
				content: `На почту ${values.email} отправлено письмо с подтверждением`,
				onOk: () => this.props.onCloseModalHandler()
			}))
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
				<h2
					className={b('header')}
				>
                    Регистрация
				</h2>
				<Form.Item
					name='email'
					rules={[
						FORM_EMAIL_REQUIRED,
						EMAIL_VALIDATOR
					]}
				>
					<Input
						className={b('input')}
						placeholder='Адрес электронной почты'
					/>
				</Form.Item>
				<Form.Item
    				name='name'
    				rules={[
    					FORM_ITEM_REQUIRED
    				]}
				>
    				<Input
						className={b('input')}
						placeholder='Имя пользователя'
    				/>
    			</Form.Item>
				<Form.Item
					name='password'
					rules={[
						FORM_ITEM_REQUIRED
					]}
				>
					<Input.Password
						className={b('input')}
						placeholder='Пароль'
					/>
				</Form.Item>
				<Form.Item
					className={b('login-button')}
				>
					<Button
						type='primary'
						htmlType='submit'
						className='bfluffy-button-simple'
					>
						Регистрация
					</Button>
				</Form.Item>
			</Form>
		);
	}
}
