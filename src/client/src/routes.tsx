import * as React from 'react';
import {Switch, Route} from 'react-router-dom';

import App from 'client/pages/app';
import {RoutePaths} from 'client/lib/routes';
import {ClientDataModel} from 'client/models/client-data';
import {NotFoundPage} from 'client/pages/not-found';
import {MainPage} from 'client/pages/main-page';
import {AdEditPage} from 'client/pages/ad/edit';
import {UserCabinetPage} from 'client/pages/user-cabinet';
import {LoginPage} from 'client/pages/login/login';
import {VerifiedPage} from 'client/pages/login/verified';

interface Props {
    clientDataModel?: ClientDataModel;
}

export class RoutesApp extends React.Component<Props> {
    private renderRouter(): React.ReactNode {
        return (
            <Switch>
                <Route exact path={RoutePaths.MAIN} component={MainPage} />
                <Route exact path={RoutePaths.USER_CABINET} component={UserCabinetPage} />
                <Route exact path={RoutePaths.AD_EDIT} component={AdEditPage} />
                <Route exact path={RoutePaths.LOGIN} component={LoginPage} />
                <Route exact path={RoutePaths.LOGIN_VERIFIED} component={VerifiedPage} />
                <Route exact path={RoutePaths.LOGIN_VERIFIED} component={VerifiedPage} />
                <Route component={NotFoundPage} />
            </Switch>
        );
    }

    public render(): React.ReactNode {
        return <App>{this.renderRouter()}</App>;
    }
}
