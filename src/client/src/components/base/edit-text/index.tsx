import * as React from 'react';
import * as classnames from 'classnames';

import bevis from 'client/lib/bevis';

import './index.scss';

interface Props {
    placeholder?: string;
    className?: string;
    value?: string;
    label?: string;
    name?: string;
    error?: string;
    onChange: (event: React.ChangeEvent<any>) => void;
}

const b = bevis('bfluffy-edit-text');

export class EditText extends React.Component<Props> {
    public render(): React.ReactNode {
        const {name, error, label, className, placeholder, value, onChange} = this.props;

        return (
            <label
                className={classnames({
                    [b()]: true,
                    ...(className ? {[className]: true} : {})
                })}
            >
                {label}
                <input type="text" name={name} placeholder={placeholder} value={value} onChange={onChange} />
                {error && <p className={b('error')}>{error}</p>}
            </label>
        );
    }
}
