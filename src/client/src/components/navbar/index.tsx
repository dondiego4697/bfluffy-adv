import * as React from 'react';
import {cloneDeep} from 'lodash';
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom';

import {ClientDataModel} from 'client/models/client-data';
import bevis from 'client/lib/bevis';
import {RoutePaths} from 'client/lib/routes';
import {LoginContent} from 'client/components/navbar/content/login';
import {Button} from 'client/components/base/button';
import {Spinner} from 'client/components/base/spinner';
import {Modal} from 'client/components/base/modal';
import {VerifiedCodeContent} from 'client/components/navbar/content/verified-code';
import {NEW_ITEM} from 'client/consts';

import './index.scss';
import 'antd/dist/antd.css';

interface Props {
	clientDataModel?: ClientDataModel;
	onHistoryChangeHandler: (path: string) => void;
}

enum ShowType {
	LOGIN = 'login',
	VERIFIED_CODE = 'verified_code'
}

interface State {
	modalVisible: boolean;
	modalLoading: boolean;
	currentEmail?: string;
	nextAddress?: string;
	showType?: ShowType;
}

const b = bevis('navbar');

@inject('clientDataModel')
@observer
export class Navbar extends React.Component<Props, State> {
	state: State = {
		modalVisible: false,
		modalLoading: false,
		showType: undefined,
		currentEmail: undefined,
		nextAddress: undefined
	};

	private onLoginClickHandler = (nextAddress?: string) => {
		this.setState({
			modalVisible: true,
			showType: ShowType.LOGIN,
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
			showType: ShowType.VERIFIED_CODE,
			currentEmail: email
		});
	}

	private onCabinetClickHandler = () => {
		this.props.onHistoryChangeHandler(RoutePaths.CABINET);
	}

	private renderModalFooter(): React.ReactNode {
		if (this.state.showType === ShowType.VERIFIED_CODE) {
			return (
				<div className={b('login-footer')}>
					<Button
						type='link'
						text='Ввести другой email'
						onClickHandler={() => this.setState({
							modalVisible: true,
							showType: ShowType.LOGIN,
							currentEmail: undefined
						})}
					/>
				</div>
			);
		}

		return null;
	}

	private renderModalContent(): React.ReactNode {
		return (
			<Spinner spinning={this.state.modalLoading}>
				<div className={b('modal-content')}>
					{
						this.state.showType === ShowType.LOGIN
							? (
								<LoginContent
									onCloseModalHandler={this.onCloseModalHandler}
									onLoadingHandler={this.onModalLoadingHandler}
									onVerifiedCodeHandler={this.onVerifiedCodeHandler}
								/>
							)
							: this.state.showType === ShowType.VERIFIED_CODE
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
			</Spinner>
		);
	}

	public render(): React.ReactNode {
		const {clientDataModel} = this.props;

		return (
			<div className={b()}>
				<div className={b('container')}>
					<Link to={RoutePaths.MAIN}>
						<div className={b('logo-container')}>
							<img className='logo' src='/image/logo.svg' alt='logo' />
							<h2>bfluffy.ru</h2>
							<img
								className='beta'
								alt='beta'
								src='https://img.icons8.com/windows/96/000000/beta.png'
							/>
						</div>
					</Link>
					<div className={b('controls-container')}>
						<div className={b('login-button')}>
							{
								clientDataModel?.user
									? (
										<Button
											icon={<img src='/image/user-icon.svg' alt='user-icon' />}
											text={clientDataModel.user.email}
											type='base'
											onClickHandler={this.onCabinetClickHandler}
										/>
									)
									: (
										<Button
											text='Вход и регистрация'
											type='base'
											onClickHandler={() => this.onLoginClickHandler(RoutePaths.CABINET)}
										/>
									)
							}
						</div>
						<Button
							type='primary'
							text='Подать объявление'
							onClickHandler={
									clientDataModel?.user
										? () => this.props.onHistoryChangeHandler(
											RoutePaths.AD_EDIT.replace(':id', NEW_ITEM)
										)
										: () => this.onLoginClickHandler(
											RoutePaths.AD_EDIT.replace(':id', NEW_ITEM)
										)
							}
						/>
					</div>
					<Modal
						visible={this.state.modalVisible}
						footer={this.renderModalFooter()}
						onCancelHandler={() => this.setState({modalVisible: false})}
					>
						{this.renderModalContent()}
        			</Modal>
				</div>
			</div>
		);
	}
}
