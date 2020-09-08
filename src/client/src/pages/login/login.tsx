import * as React from 'react';
import * as classnames from 'classnames';
import {observer, inject} from 'mobx-react';
import {RouteComponentProps} from 'react-router';
import {Store} from 'rc-field-form/lib/interface';
import {Form, Input} from 'antd';

import bevis from 'client/lib/bevis';
import {ClientDataModel} from 'client/models/client-data';
import {UserRequestBookV1} from 'client/lib/request-book/v1/user';
import {ModalMessage} from 'client/components/base/modal-message';
import {Button} from 'client/components/base/button';
import {Paper} from 'client/components/base/paper';
import {EDIT_TEXT_ROOT_CLASS_NAME, EDIT_TEXT_FORM_ITEM_CLASS_NAME} from 'client/components/base/edit-text';
import {FORM_VALIDATE_MESSAGES, FORM_EMAIL_REQUIRED} from 'client/consts';
import {Label} from 'client/components/base/label';
import {UIGlobal} from 'client/models/ui-global';
import {RoutePaths} from 'client/lib/routes';

import './login.scss';

interface Props extends RouteComponentProps {
	clientDataModel?: ClientDataModel;
	uiGlobal?: UIGlobal;
}

const b = bevis('login-page');

@inject('clientDataModel', 'uiGlobal')
@observer
export class LoginPage extends React.Component<Props> {
	private onFinishHandler = (values: Store) => {
		const {uiGlobal} = this.props;
		const {email} = values;

    	uiGlobal?.showSpinner();

    	// TODO сделать ограничение по времени
    	// TODO сделать ограничение по времени на сервере
    	return UserRequestBookV1.loginByEmail(email)
    		.then(() => this.props.history.push(`${RoutePaths.LOGIN_VERIFIED}?email=${email}`))
    		.catch((error) => ModalMessage.showError(error.response.data.message))
    		.finally(() => uiGlobal?.destroySpinner());
	}

	public render(): React.ReactNode {
		// TODO если залогинен перенаправлять на главную страницу

		return (
  			<div className={b()}>
				<Paper>
					<div className={b('preimage')}>
						<img className='image' src='/image/animal-category/cat.svg' />
						<Label
							size='header'
							text='Вход на сайт'
							className={b('preimage-label')}
						/>
					</div>
					<Form
    					className={b('form')}
    					layout='vertical'
    					onFinish={this.onFinishHandler}
    					validateMessages={FORM_VALIDATE_MESSAGES}
					>
    					<Form.Item
							className={EDIT_TEXT_FORM_ITEM_CLASS_NAME}
    						name='email'
    						rules={[
    							FORM_EMAIL_REQUIRED
    						]}
    					>
							<Input
								className={classnames(EDIT_TEXT_ROOT_CLASS_NAME, b('input-email'))}
								placeholder='Адрес электронной почты'
							/>
    					</Form.Item>
    					<Form.Item
    						className={b('submit-button')}
    					>
    						<Button
    							type='primary'
    							text='Войти'
								htmlType='submit'
    						/>
    					</Form.Item>
    				</Form>
				</Paper>
			</div>
		);
	}
}
