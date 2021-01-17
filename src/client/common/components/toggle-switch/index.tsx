import * as React from 'react';

import bevis from 'common/lib/bevis';

import './index.scss';

interface Props {
    value: boolean;
    onChange: (value: boolean) => void;
}

const b = bevis('bfluffy-toggle-switch');

export class ToggleSwitch extends React.Component<Props> {
    public render(): React.ReactNode {
        const {value, onChange} = this.props;

        return (
            <div className={b()}>
                <div className={b('container')}>
                    <label>
                        <input
                            className={b('input')}
                            type="checkbox"
                            checked={value}
                            onChange={(event) => onChange(event.target.checked)}
                        />
                        <span className={b('slider')} />
                    </label>
                </div>
            </div>
        );
    }
}
