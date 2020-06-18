import * as React from 'react';
import {Link} from 'react-router-dom';
import {Divider} from 'antd';

import bevis from 'client/lib/bevis';
import {RoutePaths} from 'client/lib/routes';

import './index.scss';
import 'antd/dist/antd.css';

const b = bevis('navbar');

export function Navbar() {
	return (
		<div className={b()}>
			<div className={b('container')}>
				<div className={b('logo-container')}>
					<div>BFluffy</div>
				</div>
				<div className={b('login-controls-container')}>
					<Link to={RoutePaths.LOGIN}>
                        Вход
					</Link>
					<Divider type="vertical" />
					<Link to={RoutePaths.SIGNUP}>
                        Регистрация
					</Link>
				</div>
				<div className={b('controls-container')}>
					<Link to={RoutePaths.CREATE_AD}>
                        Подать объявление
					</Link>
				</div>
			</div>
		</div>
	);
}
