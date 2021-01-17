import * as React from 'react';
import {render} from 'react-dom';
import {Router} from 'react-router-dom';
import {Provider} from 'mobx-react';

import * as models from 'common/models';
import {RoutesApp} from 'touch/routes';
import {history} from 'common/lib/history';

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
