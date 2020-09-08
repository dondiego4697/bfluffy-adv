import * as React from 'react';
import {inject, observer} from 'mobx-react';

import {ClientDataModel} from 'client/models/client-data';
import bevis from 'client/lib/bevis';
import {Button} from 'client/components/base/button';
import {NEW_ITEM} from 'client/consts';
import {RoutePaths} from 'client/lib/routes';
import {Logo} from 'client/components/logo';

import './index.scss';
import 'antd/dist/antd.css';

interface Props {
	clientDataModel?: ClientDataModel;
}

const b = bevis('navbar');

@inject('clientDataModel')
@observer
export class Navbar extends React.Component<Props> {
	public render(): React.ReactNode {
		const {clientDataModel} = this.props;

		return (
			<div className={b()}>
				<div className={b('container')}>
					<Logo />
					<div className={b('controls-container')}>
						<div className={b('login-button')}>
							{
								clientDataModel?.user
									? (
										<Button
											text={clientDataModel.user.email}
											type='base'
											hrefTo={RoutePaths.USER_CABINET}
										/>
									)
									: (
										<Button
											text='Вход и регистрация'
											type='base'
											hrefTo={RoutePaths.LOGIN}
										/>
									)
							}
						</div>
						<Button
							type='primary'
							text='Подать объявление'
							hrefTo={
								clientDataModel?.user
									? RoutePaths.AD_EDIT.replace(':id', NEW_ITEM)
									: RoutePaths.LOGIN
							}
						/>
					</div>
				</div>
			</div>
		);
	}
}
