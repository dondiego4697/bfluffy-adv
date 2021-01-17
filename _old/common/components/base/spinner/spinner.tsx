import * as React from 'react';

import bevis from 'common/lib/bevis';

import './spinner.scss';

const b = bevis('bfluffy-spinner');

export class Spinner extends React.Component {
    public render(): React.ReactNode {
        return (
            <div className={b('')}>
                <svg viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="20" stroke="url(#spinnerGradient)" />
                </svg>
            </div>
        );
    }
}
