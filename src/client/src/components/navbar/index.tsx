import * as React from 'react';
import * as classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import {Button, Modal, Spin} from 'antd';

import {ClientDataModel} from 'client/models/client-data';
import bevis from 'client/lib/bevis';
import {RoutePaths} from 'client/lib/routes';
import {LoginContent} from 'client/components/navbar/content/login';
import {SignupContent} from 'client/components/navbar/content/signup';
import {ForgotPasswordContent} from 'client/components/navbar/content/forgot-password';
import {ResetPasswordContent} from 'client/components/navbar/content/reset-password';
import {NEW_ITEM} from 'client/consts';

import './index.scss';
import 'antd/dist/antd.css';

interface Props {
	clientDataModel?: ClientDataModel;
	onHistoryChangeHandler: (path: RoutePaths) => void;
	authToken: string | null;
}

interface State {
	modalVisible: boolean;
	modalLoading: boolean;
	showType?: 'login' | 'signup' | 'forgot_password' | 'reset_password';
}

const b = bevis('navbar');

@inject('clientDataModel')
@observer
export class Navbar extends React.Component<Props, State> {
	state = {
		modalVisible: false,
		modalLoading: false,
		showType: undefined
	};

	componentWillMount() {
		const {authToken} = this.props;
		if (authToken) {
			this.setState({
				modalVisible: true,
				showType: 'reset_password'
			});
		}
	}

	private onLoginClickHandler = () => {
		this.setState({
			modalVisible: true,
			showType: 'login'
		});
	}

	private onForgotPasswordClickHandler = () => {
		this.setState({
			modalVisible: true,
			showType: 'forgot_password'
		});
	}

	private onModalLoadingHandler = (isLoading: boolean) => {
		this.setState({modalLoading: isLoading});
	}

	private onCloseModalHandler = () => {
		this.setState({
			modalVisible: false
		});
	}

	private onCabinetClickHandler = () => {
		this.props.onHistoryChangeHandler(RoutePaths.CABINET);
	}

	private renderModalFooter(): React.ReactNode {
		if (this.state.showType === 'login') {
			return (
				<div className={b('login-footer')}>
					<Button
						className='bfluffy-button-link'
						onClick={() => this.setState({
							modalVisible: true,
							showType: 'signup'
						})}
					>
						Зарегистрироваться
					</Button>
				</div>
			);
		}

		if (
			this.state.showType === 'signup'
			|| this.state.showType === 'forgot_password'
		) {
			return (
				<div className={b('login-footer')}>
					{
						this.state.showType === 'signup'
							&& <p>У вас уже есть учетная запись?</p>
					}
					<Button
						className='bfluffy-button-link'
						onClick={() => this.setState({
							modalVisible: true,
							showType: 'login'
						})}
					>
						Войти в систему
					</Button>
				</div>
			);
		}

		return null;
	}

	private renderModalContent(): React.ReactNode {
		const {authToken} = this.props;

		return (
			// TODO сделать свой спинер
			<Spin spinning={this.state.modalLoading}>
				<div className={b('modal-content')}>
					{
						this.state.showType === 'login'
							? (
								<LoginContent
									onForgotPasswordClickHandler={this.onForgotPasswordClickHandler}
									onLoadingHandler={this.onModalLoadingHandler}
									onCloseModalHandler={this.onCloseModalHandler}
								/>
							)
							: this.state.showType === 'signup'
								? (
									<SignupContent
										onCloseModalHandler={this.onCloseModalHandler}
										onLoadingHandler={this.onModalLoadingHandler}
									/>
								)
								: this.state.showType === 'forgot_password'
									? (
										<ForgotPasswordContent
											onCloseModalHandler={this.onCloseModalHandler}
											onLoadingHandler={this.onModalLoadingHandler}
										/>
									)
									: this.state.showType === 'reset_password' && authToken
										? (
											<ResetPasswordContent
												authToken={authToken}
												onCloseModalHandler={this.onCloseModalHandler}
												onLoadingHandler={this.onModalLoadingHandler}
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
						{
							clientDataModel?.user
								? (
									<div className={b('login-button')}>
										<Button
											icon={<img src='/image/user-icon.svg' alt='user-icon' />}
											onClick={this.onCabinetClickHandler}
										>
											{clientDataModel.user.name}
										</Button>
									</div>
								)
								: (
									<div className={b('login-button')}>
										<Button onClick={this.onLoginClickHandler}>
											Вход и регистрация
										</Button>
									</div>
								)
						}
						<Link
							className={classnames(b('create-ad-button'), 'bfluffy-button-simple')}
							to={RoutePaths.AD_EDIT.replace(':id', NEW_ITEM)}
						>
							Подать объявление
						</Link>
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
