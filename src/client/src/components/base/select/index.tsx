import * as React from 'react';
import * as classnames from 'classnames';

import bevis from 'client/lib/bevis';

import './index.scss';

interface Item {
    key: string;
    value: string;
}

interface Props {
    placeholder?: string;
    className?: string;
    label?: string;
    selectedKey?: string;
    name?: string;
    error?: string;
    onKeyChange: (key: string) => void;
    items: Item[];
}

interface State {
    showItems: boolean;
}

const b = bevis('bfluffy-select');

export class Select extends React.Component<Props, State> {
    state: State = {
        showItems: false
    };

    private renderOptions() {
        const {onKeyChange, items, selectedKey} = this.props;

        return (
            <div
                className={classnames({
                    [b('options-container')]: true,
                    [b('options-container_visible')]: this.state.showItems
                })}
            >
                {items.map((item, i) => (
                    <option
                        className={classnames({
                            [b('options-selected')]: item.key === selectedKey
                        })}
                        key={`select-item-${i}`}
                        onClick={() => onKeyChange(item.key)}
                    >
                        {item.value}
                    </option>
                ))}
            </div>
        );
    }

    public render(): React.ReactNode {
        const {name, error, label, className, placeholder, items, selectedKey} = this.props;

        const selectedItem = items.find((item) => item.key === selectedKey);
        const value = selectedItem?.value;

        return (
            <label
                className={classnames({
                    [b()]: true,
                    ...(className ? {[className]: true} : {})
                })}
            >
                {label}
                <div className={b('input-container')}>
                    <input
                        type="checkbox"
                        name={name}
                        placeholder={placeholder}
                        checked={this.state.showItems}
                        onChange={(event) =>
                            this.setState({
                                showItems: event.target.checked
                            })
                        }
                    />
                    <div className={b('input-text-container')}>
                        <div className={b('placeholder-container')}>
                            <span
                                className={classnames({
                                    ['selected']: Boolean(value)
                                })}
                            >
                                {value || placeholder}
                            </span>
                        </div>
                        <div
                            className={classnames({
                                [b('chevrons')]: true,
                                [b('chevrons_enabled')]: this.state.showItems
                            })}
                        >
                            <i className={b('chevron-up')} />
                            <i className={b('chevron-down')} />
                        </div>
                    </div>
                </div>
                {error && <p className={b('error')}>{error}</p>}
                {this.renderOptions()}
            </label>
        );
    }
}
