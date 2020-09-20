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
    name?: string;
    error?: string;
    selectedKey?: string;
    items: Item[];
    onKeyChange: (key?: string) => void;
}

interface State {
    items: Item[];
}

const b = bevis('bfluffy-search-select');

export class SearchSelect extends React.Component<Props, State> {
    state: State = {
        items: []
    };

    private removeSuggest(key?: string) {
        this.setState({
            items: []
        });
    }

    private setSuggest(subtext?: string) {
        // TODO полнотекстовый поиск

        if (!subtext) {
            this.setState({
                items: this.props.items
            });
            return;
        }

        this.setState({
            items: this.props.items.filter((item) => item.value.toLowerCase().includes(subtext.toLowerCase()))
        });
    }

    private renderOptions() {
        const {onKeyChange} = this.props;

        return (
            <div className={b('options-container')}>
                {this.state.items.map((item, i) => (
                    <option
                        key={`search-select-item-${i}`}
                        onClick={() => {
                            onKeyChange(item.key);
                            this.removeSuggest(item.key);
                        }}
                    >
                        {item.value}
                    </option>
                ))}
            </div>
        );
    }

    public render(): React.ReactNode {
        const {name, error, label, className, placeholder, items, selectedKey, onKeyChange} = this.props;

        const selectedItem = items.find((item) => item.key === selectedKey);
        const value = selectedItem?.value;

        console.log(selectedKey, value);

        return (
            <label
                className={classnames({
                    [b()]: true,
                    ...(className ? {[className]: true} : {})
                })}
            >
                {label}
                <input
                    type="text"
                    name={name}
                    placeholder={placeholder}
                    value={value || ''}
                    onChange={(event) => {
                        if (event.target.value.length < (value?.length || 0)) {
                            onKeyChange();
                        }

                        this.setSuggest(event.target.value);
                    }}
                    onFocus={() => !value && this.setSuggest()}
                />
                {error && <p className={b('error')}>{error}</p>}
                {this.renderOptions()}
            </label>
        );
    }
}
