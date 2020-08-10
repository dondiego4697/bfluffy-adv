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
import {FORM_VALIDATE_MESSAGES, FORM_EMAIL_REQUIRED} from 'client/consts';

import './index.scss';

interface Props {
    clientDataModel?: ClientDataModel;
    onCloseModalHandler: () => void;
    onLoadingHandler: (isLoading: boolean) => void;
    onVerifiedCodeHandler: (email: string) => void;
}

const b = bevis('login-content');

@inject('clientDataModel')
@observer
export class LoginContent extends React.Component<Props> {
    private onFinishLoginHandler = (values: Store) => {
    	this.props.onLoadingHandler(true);

    	return UserRequestBookV1.loginByEmail(values.email)
    		.then(() => this.props.onVerifiedCodeHandler(values.email))
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
    			<Label
    				text='Вход'
    				size='header'
    				className={b('header')}
    			/>
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
    					text='Войти'
    					htmlType='submit'
    				/>
    			</Form.Item>
    		</Form>
    	);
    }
}
