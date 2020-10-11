import * as React from 'react';

import bevis from 'common/lib/bevis';
import {Button} from 'common/components/base/button';
import {RoutePaths} from 'common/lib/routes';

import './index.scss';

const b = bevis('not-auth-page');

export class Page401 extends React.Component<{}> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <h1>401</h1>
                    <Button
                        type='primary'
                        text='Авторизоваться'
                        hrefTo={RoutePaths.MAIN}
                    />
                </div>
            </div>
        );
    }
}
