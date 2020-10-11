import * as React from 'react';
import * as classnames from 'classnames';

import bevis from 'common/lib/bevis';

import './index.scss';

interface BaseProps {
    label?: string;
    required?: boolean;
    name?: string;
    value?: string;
    className?: string;
    error?: string;
    maxLength?: number;
    measure?: string;
    onChange: (event: React.ChangeEvent<any>) => void;
}

interface TextProps extends BaseProps {
    type: 'text';
}

interface TextAreaProps extends BaseProps {
    type: 'textarea';
    maxRows?: number;
}

interface NumberProps extends BaseProps {
    type: 'number';
}

type Props = TextProps | TextAreaProps | NumberProps;

const b = bevis('bfluffy-edit-text');

export class EditText extends React.Component<Props> {
    public render(): React.ReactNode {
        const {name, measure, required, error, label, className, value, maxLength, onChange} = this.props;

        return (
            <div>
                <p className={b('label')}>
                    {label}
                    {required ? <p className={b('required')}>*</p> : ''}
                </p>
                <label
                    className={classnames({
                        [b()]: true,
                        [b('error')]: Boolean(error),
                        ...(className ? {[className]: true} : {})
                    })}
                >
                    {this.props.type === 'textarea' ? (
                        <textarea
                            rows={this.props.maxRows}
                            maxLength={maxLength}
                            name={name}
                            value={value}
                            onChange={onChange}
                        />
                    ) : (
                        <input
                            maxLength={maxLength}
                            type={this.props.type || 'text'}
                            name={name}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                    {measure && <p className={b('measure')}>{measure}</p>}
                    {error && <p className={b('error-value')}>{error}</p>}
                </label>
            </div>
        );
    }
}
