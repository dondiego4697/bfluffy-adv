import * as React from 'react';
import * as classnames from 'classnames';

import bevis from 'common/lib/bevis';

import './index.scss';

interface Item {
    key: string;
    value: string;
    img?: JSX.Element;
}

interface Props {
    items: Item[];
    checkedKeys: string[];
    onChange: (keys: string[]) => void;
}

const b = bevis('bfluffy-checkbox');

export class CheckBox extends React.Component<Props> {
    public render(): React.ReactNode {
        const {items, checkedKeys, onChange} = this.props;

        return (
            <div className={b()}>
                <div className={b('container')}>
                    {items.map((item, i) => {
                        const id = `checkbox-container-item-${Math.random()}`;
                        return (
                            <div className={b('checkbox-container')} key={`bfluffy-checkbox-item-${i}`}>
                                <input
                                    type="checkbox"
                                    className={b('checkbox')}
                                    id={id}
                                    value={item.key}
                                    checked={checkedKeys.includes(item.key)}
                                    onChange={(event) => {
                                        const key = event.target.value;
                                        const index = checkedKeys.findIndex((checkedKey) => checkedKey === key);
                                        if (index !== -1) {
                                            const arr = [...checkedKeys];
                                            arr.splice(index, 1);
                                            onChange(arr);
                                        } else {
                                            onChange([...checkedKeys, key]);
                                        }
                                    }}
                                />
                                <label
                                    className={classnames({
                                        hidden: Boolean(item.img)
                                    })}
                                    htmlFor={id}
                                >
                                    {item.img && <div className="img-item-container">{item.img}</div>}
                                    {item.value}
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
