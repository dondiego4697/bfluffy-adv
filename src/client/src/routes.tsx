import * as React from 'react';
import {Switch, Route} from 'react-router-dom';

import App from 'client/pages/app';
import {ClientDataModel} from 'client/models/client-data';
import {NotFoundPage} from 'client/pages/not-found';
import {MainPage} from 'client/pages/main-page';
import {RoutePaths} from 'client/lib/routes';

interface Props {
    clientDataModel?: ClientDataModel;
}

export class RoutesApp extends React.Component<Props> {
	private renderRouter(): React.ReactNode {
		return (
  			<Switch>
				<Route exact path={RoutePaths.MAIN} component={MainPage} />
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
