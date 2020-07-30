import * as React from 'react';
import * as classnames from 'classnames';
import {cloneDeep} from 'lodash';
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import {Button, Modal, Spin} from 'antd';

import {ClientDataModel} from 'client/models/client-data';
import bevis from 'client/lib/bevis';
import {RoutePaths} from 'client/lib/routes';
import {LoginContent} from 'client/components/navbar/content/login';
import {VerifiedCodeContent} from 'client/components/navbar/content/verified-code';
import {NEW_ITEM} from 'client/consts';

import './index.scss';
import 'antd/dist/antd.css';

interface Props {
	clientDataModel?: ClientDataModel;
	onHistoryChangeHandler: (path: RoutePaths) => void;
}

interface State {
	modalVisible: boolean;
	modalLoading: boolean;
	currentEmail?: string;
	nextAddress?: string;
	showType?: 'login' | 'verified_code';
}

const b = bevis('navbar');

@inject('clientDataModel')
@observer
export class Navbar extends React.Component<Props, State> {
	state = {
		modalVisible: false,
		modalLoading: false,
		showType: undefined,
		currentEmail: undefined,
		nextAddress: undefined
	};

	private onLoginClickHandler = (nextAddress?: string) => {
		this.setState({
			modalVisible: true,
			showType: 'login',
			nextAddress
		});
	}

	private onModalLoadingHandler = (isLoading: boolean) => {
		this.setState({modalLoading: isLoading});
	}

	private onCloseModalHandler = () => {
		const nextAddress = cloneDeep(this.state.nextAddress);

		this.setState({
			modalVisible: false,
			nextAddress: undefined
		});

		if (nextAddress) {
			this.props.onHistoryChangeHandler(nextAddress);
		}
	}

	private onVerifiedCodeHandler = (email: string) => {
		this.setState({
			modalVisible: true,
			showType: 'verified_code',
			currentEmail: email
		});
	}

	private onCabinetClickHandler = () => {
		this.props.onHistoryChangeHandler(RoutePaths.CABINET);
	}

	private renderModalFooter(): React.ReactNode {
		if (this.state.showType === 'verified_code') {
			return (
				<div className={b('login-footer')}>
					<Button
						className='bfluffy-button-link'
						onClick={() => this.setState({
							modalVisible: true,
							showType: 'login',
							currentEmail: undefined
						})}
					>
						Ввести другой email
					</Button>
				</div>
			);
		}

		return null;
	}

	private renderModalContent(): React.ReactNode {
		return (
			<Spin
				spinning={this.state.modalLoading}
				className='bfluffy-spinner'
			>
				<div className={b('modal-content')}>
					{
						this.state.showType === 'login'
							? (
								<LoginContent
									onCloseModalHandler={this.onCloseModalHandler}
									onLoadingHandler={this.onModalLoadingHandler}
									onVerifiedCodeHandler={this.onVerifiedCodeHandler}
								/>
							)
							: this.state.showType === 'verified_code'
								? (
									<VerifiedCodeContent
										onCloseModalHandler={this.onCloseModalHandler}
										onLoadingHandler={this.onModalLoadingHandler}
										email={this.state.currentEmail!}
									/>
								)
								: <div />
					}
				</div>
			</Spin>
		);
	}

	public render(): React.ReactNode {
		const {clientDataModel} = this.props;

		return (
			<div className={b()}>
				<div className={b('container')}>
					<Link to={RoutePaths.MAIN}>
						<div className={b('logo-container')}>
							<img src='/image/logo.svg' alt='logo' />
							<h2>bfluffy.ru</h2>
						</div>
					</Link>
					<div className={b('controls-container')}>
						<div className={b('login-button')}>
							{
								clientDataModel?.user
									? (
										<Button
											icon={<img src='/image/user-icon.svg' alt='user-icon' />}
											onClick={this.onCabinetClickHandler}
										>
											{clientDataModel.user.email}
										</Button>
									)
									: (
										<Button onClick={() => this.onLoginClickHandler()}>
											Вход и регистрация
										</Button>
									)
							}
						</div>
						{
							clientDataModel?.user
								? (
									<Link
										className={classnames(b('create-ad-button'), 'bfluffy-button-simple')}
										to={RoutePaths.AD_EDIT.replace(':id', NEW_ITEM)}
									>
										Подать объявление
									</Link>
								)
								: (
									<Button
										onClick={() => this.onLoginClickHandler(
											RoutePaths.AD_EDIT.replace(':id', NEW_ITEM)
										)}
										className={classnames(b('create-ad-button'), 'bfluffy-button-simple')}
									>
										Подать объявление
									</Button>
								)
						}
					</div>
					<Modal
						className={b('modal')}
						visible={this.state.modalVisible}
						closable={false}
						centered
						footer={this.renderModalFooter()}
						onCancel={() => this.setState({modalVisible: false})}
						closeIcon={null}
					>
						{this.renderModalContent()}
        			</Modal>
				</div>
			</div>
		);
	}
}
