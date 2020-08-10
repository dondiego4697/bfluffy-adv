import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';
import {Menu} from 'antd';

import {CabinetPageModel} from 'client/models/cabinet';
import {ClientDataModel} from 'client/models/client-data';
import {Paper} from 'client/components/paper';
import {AvatarUpload} from 'client/components/avatar-upload';
import bevis from 'client/lib/bevis';

import './index.scss';

interface Props extends RouteComponentProps {
	cabinetPageModel: CabinetPageModel;
	clientDataModel: ClientDataModel;
}

enum MenuItemSelected {
	MY_ADS = 'my_ads',
	SETTINGS = 'settings'
}

interface State {
	menuItemSelected: MenuItemSelected;
}

const b = bevis('cabinet');

@inject('cabinetPageModel', 'clientDataModel')
@observer
export class CabinetPage extends React.Component<Props, State> {
	state: State = {
		menuItemSelected: MenuItemSelected.MY_ADS
	};

	public componentDidMount(): void {
    	this.loadData();
	}

	private loadData() {
    	return this.props.cabinetPageModel!.getBar();
	}

	private renderControlPanel(): React.ReactNode {
		return (
			<div className={b('control-panel')}>
				<AvatarUpload
					size={64}
					cropTitle='Загрузить изображение'
					cropShape='round'
					imageUrl={this.props.clientDataModel.user?.avatar}
				/>
				<h2 className='display-name'>Антонина Грибкова</h2>
				<p className='farm-type'>Частное лицо</p>
				<Menu
					className={b('menu')}
					selectedKeys={[this.state.menuItemSelected]}
					onSelect={({key}) => this.setState({
						menuItemSelected: key as MenuItemSelected
					})}
				>
  					<Menu.Item key={MenuItemSelected.MY_ADS}>Мои объявления</Menu.Item>
  					<Menu.Item key={MenuItemSelected.SETTINGS}>Настройки</Menu.Item>
				</Menu>
			</div>
		);
	}

	private renderMyAdsPanel(): React.ReactNode {
		return (
			<div className={b('my-ads-panel')} />
		);
	}

	private renderSettingsPanel(): React.ReactNode {
		return (
			<div className={b('settings-panel')} />
		);
	}

	private renderMainPanel(): React.ReactNode {
		return (
			<div className={b('main-panel')}>
				<h1 className='title'>
					{
						this.state.menuItemSelected === MenuItemSelected.SETTINGS
							? 'Настройки'
							: 'Мои объявления'
					}
				</h1>
				{
					this.state.menuItemSelected === MenuItemSelected.SETTINGS
						? this.renderSettingsPanel()
						: this.renderMyAdsPanel()
				}
			</div>
		);
	}

	public render(): React.ReactNode {
		const {clientDataModel} = this.props;

		if (!clientDataModel.user) {
			return (
				<div className={b()} />
			);
		}

    	return (
  			<div className={b()}>
				<Paper>
  					<div className={b('container')}>
						{this.renderControlPanel()}
						{this.renderMainPanel()}
					</div>
				</Paper>
    		</div>
    	);
	}
}
