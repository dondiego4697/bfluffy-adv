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
	private getAuthTokenFromQuery() {
		const {location} = this.props;

    	const query = new URLSearchParams(location.search);
    	return query.get('auth_token');
	}

	public render(): React.ReactNode {
		const {children} = this.props;
		const authToken = this.getAuthTokenFromQuery();

		return (
  			<div className={b()}>
				<Navbar
					authToken={authToken}
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
