import * as React from 'react';

import bevis from 'common/lib/bevis';

import './index.scss';

const b = bevis('not-found-page');

export class Page404 extends React.Component<{}> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <h1>404</h1>
                </div>
            </div>
        );
    }
}
