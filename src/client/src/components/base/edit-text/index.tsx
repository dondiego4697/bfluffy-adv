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
    maxLength?: number;
    type?: 'number' | 'text' | 'textarea';
    onChange: (event: React.ChangeEvent<any>) => void;
}

const b = bevis('bfluffy-edit-text');

export class EditText extends React.Component<Props> {
    public render(): React.ReactNode {
        const {type, name, error, label, className, placeholder, value, maxLength, onChange} = this.props;

        return (
            <label
                className={classnames({
                    [b()]: true,
                    ...(className ? {[className]: true} : {})
                })}
            >
                {label}
                {type === 'textarea' ? (
                    <textarea
                        rows={5}
                        maxLength={maxLength}
                        name={name}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                    />
                ) : (
                    <input
                        maxLength={maxLength}
                        type={type || 'text'}
                        name={name}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                    />
                )}
                {error && <p className={b('error')}>{error}</p>}
            </label>
        );
    }
}
