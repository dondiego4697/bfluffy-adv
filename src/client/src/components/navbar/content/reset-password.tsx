import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {Store} from 'rc-field-form/lib/interface';
import {Form, Input, Button} from 'antd';

import {ClientDataModel} from 'client/models/client-data';
import bevis from 'client/lib/bevis';
import {UserRequestBookV1} from 'client/lib/request-book/v1/user';
import {ModalMessage} from 'client/components/modal-message';
import {FORM_VALIDATE_MESSAGES, FORM_ITEM_REQUIRED} from 'client/consts';

import './index.scss';

interface Props {
    clientDataModel?: ClientDataModel;
    onLoadingHandler: (isLoading: boolean) => void;
    onCloseModalHandler: () => void;
    authToken: string;
}

const b = bevis('login-content');

@inject('clientDataModel')
@observer
export class ResetPasswordContent extends React.Component<Props> {
    private onFinishResetPasswordHandler = (values: Store) => {
    	this.props.onLoadingHandler(true);

    	return UserRequestBookV1.resetPassword({
    		authToken: this.props.authToken,
    		newPassword: values.password
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
    			onFinish={this.onFinishResetPasswordHandler}
    			validateMessages={FORM_VALIDATE_MESSAGES}
    		>
    			<h2 className={b('header')}>
                    Установить новый пароль
    			</h2>
    			<Form.Item
    				name='password'
    				rules={[
    					FORM_ITEM_REQUIRED
    				]}
    			>
    				<Input.Password
    					className={b('input')}
    					placeholder='Новый пароль'
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
						Сохранить новый пароль
    				</Button>
    			</Form.Item>
    		</Form>
    	);
    }
}
