import * as React from 'react';
import * as classnames from 'classnames';

import bevis from 'client/lib/bevis';

import './index.scss';

interface Item {
    key: string;
    value: string;
}

interface Props {
    className?: string;
    selectedKey?: string;
    items: Item[];
    onKeyChange: (key: string) => void;
}

const b = bevis('bfluffy-radio-group');

export class RadioGroup extends React.Component<Props> {
    public render(): React.ReactNode {
        const {className, items, selectedKey, onKeyChange} = this.props;

        return (
            <div
                className={classnames({
                    [b()]: true,
                    ...(className ? {[className]: true} : {})
                })}
            >
                <div className={b('container')}>
                    {items.map((item, i) => (
                        <label key={`redio-group-item-${i}`} className={b('radio-item')}>
                            <input
                                type="radio"
                                value={item.key}
                                checked={item.key === selectedKey}
                                onChange={(event) => {
                                    onKeyChange(event.target.value);
                                }}
                            />
                            {item.value}
                        </label>
                    ))}
                </div>
            </div>
        );
    }
}
