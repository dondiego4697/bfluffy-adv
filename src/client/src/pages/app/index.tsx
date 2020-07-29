import * as React from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter, RouteComponentProps} from 'react-router';

import {ClientDataModel} from 'client/models/client-data';
import bevis from 'client/lib/bevis';
import {Navbar} from 'client/components/navbar';

import './index.scss';

interface Props extends RouteComponentProps {
    children: React.ReactNode;
    clientDataModel?: ClientDataModel;
}

const b = bevis('root');

@inject('clientDataModel')
@observer
class App extends React.Component<Props> {
	private getDataFromQuery() {
		const {location} = this.props;

    	const query = new URLSearchParams(location.search);
    	return {
			authToken: query.get('auth_token'),
			processType: query.get('process_type')
		};
	}

	public render(): React.ReactNode {
		const {children} = this.props;
		const {authToken, processType} = this.getDataFromQuery();

		return (
  			<div className={b()}>
				<Navbar
					authToken={authToken}
					processType={processType}
					onHistoryChangeHandler={(path) => this.props.history.push(path)}
				/>
  				<div className={b('container')}>
  					{children}
				</div>
			</div>
		);
	}
}

export default withRouter(App);
