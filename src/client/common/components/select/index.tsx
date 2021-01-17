import * as React from 'react';
import * as classnames from 'classnames';

import bevis from 'common/lib/bevis';

import './index.scss';
import {CHEVRON_SVG} from 'common/svg/icons';

interface Option {
    key: string;
    value: string;
}

interface Props {
    label?: string;
    required?: boolean;
    name?: string;
    selectedKey?: string;
    className?: string;
    error?: string;
    options: Option[];
    onKeyChange: (key: string) => void;
}

interface State {
    showOptions: boolean;
}

const b = bevis('bfluffy-select');

export class Select extends React.Component<Props, State> {
    state: State = {
        showOptions: false
    };

    private renderOptions() {
        const {onKeyChange, options, selectedKey} = this.props;

        return (
            <div
                className={classnames({
                    [b('options-container')]: true,
                    [b('options-container_visible')]: this.state.showOptions
                })}
            >
                {options.map((options, i) => (
                    <option
                        className={classnames({
                            [b('option-selected')]: options.key === selectedKey
                        })}
                        key={`select-item-${i}`}
                        onMouseDown={() => onKeyChange(options.key)}
                    >
                        {options.value}
                    </option>
                ))}
            </div>
        );
    }

    public render(): React.ReactNode {
        const {name, error, label, className, required, options, selectedKey} = this.props;

        const selectedOption = options.find((option) => option.key === selectedKey);
        const value = selectedOption?.value;

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
                    <div className={b('input-container')}>
                        <input
                            type="checkbox"
                            name={name}
                            checked={this.state.showOptions}
                            onChange={(event) =>
                                this.setState({
                                    showOptions: event.target.checked
                                })
                            }
                            onBlur={() =>
                                this.setState({
                                    showOptions: false
                                })
                            }
                        />
                        <div className={b('input-text-container')}>
                            <div className={b('placeholder-container')}>
                                <span>{value}</span>
                            </div>
                            <div
                                className={classnames({
                                    [b('chevron')]: true,
                                    [b('chevron_enabled')]: this.state.showOptions
                                })}
                            >
                                {CHEVRON_SVG}
                            </div>
                        </div>
                    </div>
                    {error && <p className={b('error-value')}>{error}</p>}
                    {this.renderOptions()}
                </label>
            </div>
        );
    }
}
