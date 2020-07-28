import * as React from 'react';
import {Switch, Route} from 'react-router-dom';

import App from 'client/pages/app';
import {RoutePaths} from 'client/lib/routes';
import {ClientDataModel} from 'client/models/client-data';
import {NotFoundPage} from 'client/pages/not-found';
import {MainPage} from 'client/pages/main-page';
import {FarmEditPage} from 'client/pages/farm/edit';
import {CabinetPage} from 'client/pages/cabinet';

interface Props {
    clientDataModel?: ClientDataModel;
}

export class RoutesApp extends React.Component<Props> {
	private renderRouter(): React.ReactNode {
		return (
  			<Switch>
				<Route exact path={RoutePaths.MAIN} component={MainPage} />
				<Route exact path={RoutePaths.CABINET} component={CabinetPage} />

				<Route exact path={RoutePaths.FARM_EDIT} component={FarmEditPage} />
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
