import * as React from 'react';
import * as classnames from 'classnames';

import bevis from 'common/lib/bevis';

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
    selectedKey?: string;
}

const b = bevis('bfluffy-search-select');

export class SearchSelect extends React.Component<Props, State> {
    state: State = {
        items: []
    };

    inputRef = React.createRef<HTMLInputElement>();

    public componentDidMount() {
        this.updateValue(this.props.selectedKey);
    }

    public componentWillReceiveProps(nextProps: Props) {
        this.updateValue(nextProps.selectedKey);
    }

    private updateValue(key?: string) {
        if (!this.inputRef.current) {
            return;
        }

        if (!key) {
            this.inputRef.current.value = '';
            return;
        }

        const {items} = this.props;
        const selectedItem = items.find((item) => item.key === key);
        const value = selectedItem?.value;

        if (!value) {
            return;
        }

        this.inputRef.current.value = value;
    }

    private hideSuggest() {
        this.setState({items: []});
    }

    private showSuggest(subtext?: string) {
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
                        onMouseDown={() => {
                            onKeyChange(item.key);
                            this.setState({selectedKey: item.key});
                            this.hideSuggest();
                        }}
                    >
                        {item.value}
                    </option>
                ))}
            </div>
        );
    }

    public render(): React.ReactNode {
        const {name, error, label, className, placeholder} = this.props;

        return (
            <label
                className={classnames({
                    [b()]: true,
                    ...(className ? {[className]: true} : {})
                })}
            >
                {label}
                <input
                    ref={this.inputRef}
                    type="text"
                    name={name}
                    placeholder={placeholder}
                    onChange={(event) => {
                        this.showSuggest(event.target.value);
                    }}
                    onFocus={() => !this.inputRef.current?.value && this.showSuggest()}
                    onBlur={() => {
                        this.updateValue(this.state.selectedKey);
                        this.hideSuggest();
                    }}
                />
                {error && <p className={b('error')}>{error}</p>}
                {this.renderOptions()}
            </label>
        );
    }
}
