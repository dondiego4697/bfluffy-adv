import * as React from 'react';

import bevis from 'client/lib/bevis';

import './index.scss';

interface Props {}

interface State {}

const b = bevis('bfluffy-select');

export class Select extends React.Component<Props, State> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}></div>
            </div>
        );
    }
}
