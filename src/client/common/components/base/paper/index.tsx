import * as React from 'react';

import bevis from 'client/lib/bevis';

import './index.scss';

const b = bevis('bfluffy-paper');

export class Paper extends React.Component<{}> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>{this.props.children}</div>
            </div>
        );
    }
}
