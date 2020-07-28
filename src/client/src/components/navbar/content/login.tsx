import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {Store} from 'rc-field-form/lib/interface';
import {Form, Input, Button} from 'antd';

import {ClientDataModel} from 'client/models/client-data';
import bevis from 'client/lib/bevis';
import {UserRequestBookV1} from 'client/lib/request-book/v1/user';
import {ModalMessage} from 'client/components/modal-message';
import {FORM_VALIDATE_MESSAGES, FORM_ITEM_REQUIRED, FORM_EMAIL_REQUIRED} from 'client/consts';

import './index.scss';

interface Props {
    clientDataModel?: ClientDataModel;
    onForgotPasswordClickHandler: () => void;
    onCloseModalHandler: () => void;
    onLoadingHandler: (isLoading: boolean) => void;
}

const b = bevis('login-content');

@inject('clientDataModel')
@observer
export class LoginContent extends React.Component<Props> {
    private onFinishLoginHandler = (values: Store) => {
		this.props.onLoadingHandler(true);

    	return UserRequestBookV1.logInByCredentials({
    		email: values.email,
    		password: values.password
    	})
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
    			onFinish={this.onFinishLoginHandler}
    			validateMessages={FORM_VALIDATE_MESSAGES}
    		>
    			<h2
    				className={b('header')}
    			>
                    Вход
    			</h2>
    			<Form.Item
    				name='email'
    				rules={[
    					FORM_EMAIL_REQUIRED
    				]}
    			>
    				<Input
    					className={b('input')}
    					placeholder='Адрес электронной почты'
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
    			<div
    				className={b('forgot-password')}
    			>
    				<Button
    					className='bfluffy-button-link'
    					onClick={this.props.onForgotPasswordClickHandler}
    				>
                        Забыли пароль?
    				</Button>
    			</div>
    			<Form.Item
    				className={b('login-button')}
    			>
    				<Button
    					type='primary'
    					htmlType='submit'
    					className='bfluffy-button-simple'
    				>
						Войти
    				</Button>
    			</Form.Item>
    		</Form>
    	);
    }
}
