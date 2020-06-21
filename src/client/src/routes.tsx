import * as React from 'react';
import {Switch, Route} from 'react-router-dom';

import App from 'client/pages/app';
import {ClientDataModel} from 'client/models/client-data';
import {NotFoundPage} from 'client/pages/not-found';
import {MainPage} from 'client/pages/main-page';
import {LoginPage} from 'client/pages/login';
import {RoutePaths} from 'client/lib/routes';

interface Props {
    clientDataModel?: ClientDataModel;
}

export class RoutesApp extends React.Component<Props> {
	private renderRouter(): React.ReactNode {
		return (
  			<Switch>
				<Route exact path={RoutePaths.MAIN} component={MainPage} />
				<Route exact path={RoutePaths.LOGIN} component={LoginPage} />
				<Route exact path={RoutePaths.SIGNUP} component={LoginPage} />
				<Route exact path={RoutePaths.FORGOT_PASSWORD} component={LoginPage} />
				<Route exact path={RoutePaths.RESET_PASSWORD} component={LoginPage} />
				<Route component={NotFoundPage} />
			</Switch>
		);
	}

	public render(): React.ReactNode {
		return (
  			<App>
				{this.renderRouter()}
			</App>
		);
	}
}
