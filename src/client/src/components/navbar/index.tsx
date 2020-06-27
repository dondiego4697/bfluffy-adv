import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import {Divider} from 'antd';

import {ClientDataModel} from 'client/models/client-data';
import bevis from 'client/lib/bevis';
import {RoutePaths} from 'client/lib/routes';
import {NEW_ITEM} from 'client/consts';

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
					<div className={b('logo-container')}>
						<div>BFluffy</div>
					</div>
					{
						clientDataModel?.user
							? (
								<Link to={RoutePaths.CABINET}>
									{clientDataModel.user.name}
								</Link>
							)
							: (
								<div className={b('login-controls-container')}>
									<Link to={RoutePaths.LOGIN}>
										Вход
									</Link>
									<Divider type='vertical' />
									<Link to={RoutePaths.SIGNUP}>
										Регистрация
									</Link>
								</div>
							)
					}
					<div className={b('controls-container')}>
						<Link to={RoutePaths.AD_EDIT}>
							Подать объявление
						</Link>
						<br />
						<Link to={RoutePaths.FARM_EDIT.replace(':id', NEW_ITEM)}>
							Создать питомник
						</Link>
					</div>
				</div>
			</div>
		);
	}
}
