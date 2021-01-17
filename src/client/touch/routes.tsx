import * as React from 'react';
import {Switch, Route} from 'react-router-dom';

import {RoutePaths} from 'common/lib/routes';
import {GeneralDataModel} from 'common/models/general-data';
import App from 'touch/pages/app';
import {MainPage} from 'touch/pages/main-page';

interface Props {
    generalDataModel?: GeneralDataModel;
}

export class RoutesApp extends React.Component<Props> {
    private renderRouter(): React.ReactNode {
        return (
            <Switch>
                <Route exact path={RoutePaths.MAIN} component={MainPage} />
            </Switch>
        );
    }

    public render(): React.ReactNode {
        return <App>{this.renderRouter()}</App>;
    }
}
