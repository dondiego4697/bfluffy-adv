import * as React from 'react';

import bevis from 'common/lib/bevis';
import {Spinner} from 'common/components/base/spinner/spinner';

import './global-spinner.scss';

interface Props {
    spinning?: boolean;
}

const b = bevis('bfluffy-global-spinner');

export class GlobalSpinner extends React.Component<Props> {
    public componentDidUpdate() {
        document.body.style.overflow = this.props.spinning ? 'hidden' : 'auto';
    }

    public render(): React.ReactNode {
        const {spinning} = this.props;

        const children = (
            <div className={b()} style={{display: spinning ? 'flex' : 'none'}}>
                <Spinner />
            </div>
        );

        return children;
    }
}
