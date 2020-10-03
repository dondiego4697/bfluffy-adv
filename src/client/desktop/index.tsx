import * as React from 'react';
import {render} from 'react-dom';
import {Router} from 'react-router-dom';
import {Provider} from 'mobx-react';

import * as models from 'client/models';
import {RoutesApp} from 'desktop/routes';
import {history} from 'client/lib/history';

render(
    <Provider {...models}>
        <>
            <Router history={history}>
                <RoutesApp />
            </Router>
        </>
    </Provider>,
    document.getElementById('root')
);
