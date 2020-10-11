import * as React from 'react';
import {Switch, Route} from 'react-router-dom';

import {RoutePaths} from 'common/lib/routes';
import {GeneralDataModel} from 'common/models/general-data';
import App from 'touch/pages/app';
import {MainPage} from 'touch/pages/main-page';
import {LoginPage} from 'desktop/pages/login/login';
import {VerifiedPage} from 'desktop/pages/login/verified';
import {Page404} from 'desktop/pages/404';

interface Props {
    generalDataModel?: GeneralDataModel;
}

export class RoutesApp extends React.Component<Props> {
    private renderRouter(): React.ReactNode {
        return (
            <Switch>
                <Route exact path={RoutePaths.MAIN} component={MainPage} />
                <Route exact path={RoutePaths.LOGIN} component={LoginPage} />
                <Route exact path={RoutePaths.LOGIN_VERIFIED} component={VerifiedPage} />
                <Route component={Page404} />
            </Switch>
        );
    }

    public render(): React.ReactNode {
        return <App>{this.renderRouter()}</App>;
    }
}
