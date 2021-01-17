import {cloneDeep} from 'lodash';
import * as React from 'react';
import * as classnames from 'classnames';

import bevis from 'common/lib/bevis';

import './index.scss';

interface Props {
    className?: string;
    count: number;
    onChange: (code: string) => void;
}

interface State {
    values: (number | undefined)[];
}

const b = bevis('bfluffy-code');

const WIDTH_ITEM = 42;

export class Code extends React.Component<Props, State> {
    state = {
        values: [] as (number | undefined)[]
    };

    formRef = React.createRef<HTMLFormElement>();

    private renderItems() {
        const {onChange, count} = this.props;

        return new Array(count).fill(true).map((_, i) => {
            return (
                <input
                    key={`component-code_item_${i}`}
                    maxLength={1}
                    style={{width: WIDTH_ITEM}}
                    value={this.state.values[i]}
                    type="number"
                    onChange={(event) => {
                        const eventValue = event.target.value || undefined;
                        let resultValue: number | undefined;

                        if (eventValue !== undefined) {
                            resultValue = Number(eventValue);
                            if (Number.isNaN(resultValue)) {
                                return;
                            }
                        }

                        if (resultValue !== undefined && String(resultValue).length > 1) {
                            return;
                        }

                        const currentValues = cloneDeep(this.state.values);
                        currentValues[i] = resultValue;
                        this.setState({values: currentValues});

                        onChange(currentValues.join(''));

                        if (resultValue === undefined) {
                            return;
                        }

                        const items = this.formRef.current?.children as HTMLInputElement[] | undefined;
                        if (items === undefined) {
                            return;
                        }

                        items[i + 1]?.focus();
                    }}
                />
            );
        });
    }

    public render(): React.ReactNode {
        const {className, count} = this.props;

        return (
            <label
                className={classnames({
                    [b()]: true,
                    ...(className ? {[className]: true} : {})
                })}
            >
                <form ref={this.formRef} className={b('form')} style={{width: count * WIDTH_ITEM + (count - 1) * 8}}>
                    {this.renderItems()}
                </form>
            </label>
        );
    }
}
