import * as React from 'react';
import * as classnames from 'classnames';
import {observer, inject} from 'mobx-react';
import {RouteComponentProps} from 'react-router';
import {Store} from 'rc-field-form/lib/interface';
import {Form, Input} from 'antd';

import bevis from 'client/lib/bevis';
import {ClientDataModel} from 'client/models/client-data';
import {Paper} from 'client/components/base/paper';
import {UserRequestBookV1} from 'client/lib/request-book/v1/user';
import {ModalMessage} from 'client/components/base/modal-message';
import {Button} from 'client/components/base/button';
import {EDIT_TEXT_ROOT_CLASS_NAME, EDIT_TEXT_FORM_ITEM_CLASS_NAME} from 'client/components/base/edit-text';
import {FORM_VALIDATE_MESSAGES, FORM_ITEM_REQUIRED} from 'client/consts';
import {RoutePaths} from 'client/lib/routes';
import {Label} from 'client/components/base/label';
import {UIGlobal} from 'client/models/ui-global';

import './verified.scss';

interface Props extends RouteComponentProps {
	clientDataModel?: ClientDataModel;
	uiGlobal?: UIGlobal;
}

const b = bevis('verified-page');

@inject('clientDataModel', 'uiGlobal')
@observer
export class VerifiedPage extends React.Component<Props> {
	private getEmail() {
		const params = new URLSearchParams(this.props.location.search || '');
		return params.get('email');
	}

	private onFinishHandler = (values: Store) => {
		const {uiGlobal} = this.props;
		const {code} = values;
		const email = this.getEmail();

		if (!email) {
			return Promise.resolve();
		}

		uiGlobal?.showSpinner();

		return UserRequestBookV1.checkVerifiedCode(email, code)
			.then(() => this.props.clientDataModel?.initClientDataModel())
			.then(() => this.props.history.replace(RoutePaths.MAIN))
    		.catch((error) => ModalMessage.showError(error.response.data.message))
			.finally(() => uiGlobal?.destroySpinner());
	}

	public render(): React.ReactNode {
		const email = this.getEmail();

		// TODO если залогинен перенаправлять на главную страницу
		// TODO нельзя просто так зайти на страницу эту (а то начнут заходить и подтверждать старым кодом)

		if (!email) {
			// TODO обработать кейс
		}

		return (
  			<div className={b()}>
				<Paper>
					<div className={b('preimage')}>
						<img className='image' src='/image/animal-category/dog.svg' />
						<Label
							size='header'
							text='Код из письма'
							className={b('preimage-label')}
						/>
					</div>
					<Form
						className={b('form')}
						layout='vertical'
						onFinish={this.onFinishHandler}
						validateMessages={FORM_VALIDATE_MESSAGES}
					>
						<div className={b('info')}>
							На почту
							{' '}
							<p className='bold'>{email}</p>
							{' '}
							отправлено письмо
						</div>
						<Form.Item
							name='code'
							className={EDIT_TEXT_FORM_ITEM_CLASS_NAME}
    						rules={[
    							FORM_ITEM_REQUIRED
    						]}
						>
    						<Input
								className={classnames(EDIT_TEXT_ROOT_CLASS_NAME, b('input-code'))}
								placeholder='Код из письма'
    						/>
    					</Form.Item>
						<Form.Item
							className={b('submit-button')}
						>
							<Button
								type='primary'
								text='Подтвердить'
								htmlType='submit'
							/>
						</Form.Item>
					</Form>
					<Button
						type='link'
						className={b('another-email')}
						text='Ввести другой email'
						hrefTo={RoutePaths.LOGIN}
					/>
				</Paper>
			</div>
		);
	}
}
