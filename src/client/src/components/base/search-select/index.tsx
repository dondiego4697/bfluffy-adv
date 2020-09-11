import * as React from 'react';

import bevis from 'client/lib/bevis';

import './index.scss';

interface Props {}

interface State {}

const b = bevis('bfluffy-search-select');

export class SearchSelect extends React.Component<Props, State> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}></div>
            </div>
        );
    }
}
