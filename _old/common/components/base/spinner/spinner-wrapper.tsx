import * as React from 'react';

import bevis from 'common/lib/bevis';
import {Spinner} from 'common/components/base/spinner/spinner';

import './spinner-wrapper.scss';

interface Props {
    spinning?: boolean;
}

const b = bevis('bfluffy-spinner-wrapper');

export class SpinnerWrapper extends React.Component<Props> {
    public render(): React.ReactNode {
        const {spinning} = this.props;

        return (
            <div className={b()}>
                <div className={b('spinner-container')} style={{display: spinning ? 'flex' : 'none'}}>
                    <Spinner />
                </div>
                <div className={b('container')}>{this.props.children}</div>
            </div>
        );
    }
}
