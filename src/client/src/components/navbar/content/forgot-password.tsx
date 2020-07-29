import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {Store} from 'rc-field-form/lib/interface';
import {Form, Input, Button} from 'antd';

import {ClientDataModel} from 'client/models/client-data';
import bevis from 'client/lib/bevis';
import {UserRequestBookV1} from 'client/lib/request-book/v1/user';
import {ModalMessage} from 'client/components/modal-message';
import {FORM_VALIDATE_MESSAGES, FORM_EMAIL_REQUIRED} from 'client/consts';

import './index.scss';

interface Props {
    clientDataModel?: ClientDataModel;
    onLoadingHandler: (isLoading: boolean) => void;
    onCloseModalHandler: () => void;
}

const b = bevis('login-content');

@inject('clientDataModel')
@observer
export class ForgotPasswordContent extends React.Component<Props> {
    private onFinishForgotPasswordHandler = (values: Store) => {
    	this.props.onLoadingHandler(true);

    	return UserRequestBookV1.forgotPassword(values.email)
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
    			onFinish={this.onFinishForgotPasswordHandler}
    			validateMessages={FORM_VALIDATE_MESSAGES}
    		>
    			<h2 className={b('header')}>
                    Восстановить пароль
    			</h2>
    			<p className={b('forgot-password-info')}>
                    На email придет письмо с инструкцией по сбросу пароля
    			</p>
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
    				className={b('login-button')}
    			>
    				<Button
    					type='primary'
    					htmlType='submit'
    					className='bfluffy-button-simple'
    				>
						Отправить письмо
    				</Button>
    			</Form.Item>
    		</Form>
    	);
    }
}
