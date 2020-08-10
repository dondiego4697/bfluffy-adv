import * as React from 'react';
import {Spin} from 'antd';

import bevis from 'client/lib/bevis';

import './index.scss';

interface Props {
    spinning?: boolean;
}

const b = bevis('bfluffy-spinner');

export class Spinner extends React.Component<Props> {
	public render(): React.ReactNode {
		const {spinning} = this.props;

		return (
			<Spin
				className={b()}
				spinning={spinning}
			>
				{this.props.children}
        	</Spin>
		);
	}
}
