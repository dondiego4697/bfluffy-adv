import * as React from 'react';
import * as classnames from 'classnames';
import {clone} from 'lodash';

import bevis from 'common/lib/bevis';

import './index.scss';

interface Item {
    key: string;
    value: string;
}

interface Props {
    className?: string;
    items: Item[];
    selectedKeys: string[];
    onChange: (keys: string[]) => void;
}

const b = bevis('bfluffy-checkbox');

export class CheckBox extends React.Component<Props> {
    private updateSelectedKeys(key: string) {
        const {onChange, selectedKeys} = this.props;
        const updatedSelectedKeys = clone(selectedKeys || []);

        const index = updatedSelectedKeys.findIndex((selectedKey) => selectedKey === key);

        if (index === -1) {
            updatedSelectedKeys.push(key);
        } else {
            updatedSelectedKeys.splice(index, 1);
        }

        onChange(updatedSelectedKeys);
    }

    public render(): React.ReactNode {
        const {className, items, selectedKeys} = this.props;

        return (
            <div
                className={classnames({
                    [b()]: true,
                    ...(className ? {[className]: true} : {})
                })}
            >
                <div className={b('container')}>
                    {items.map((item, i) => (
                        <label key={`checkbox-item-${i}`} className={b('checkbox-item')}>
                            <input
                                type="checkbox"
                                value={item.key}
                                checked={Boolean((selectedKeys || []).find((key) => key === item.key))}
                                onChange={(event) => this.updateSelectedKeys(event.target.value)}
                            />
                            {item.value}
                        </label>
                    ))}
                </div>
            </div>
        );
    }
}
