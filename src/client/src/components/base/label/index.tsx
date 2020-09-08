import * as React from 'react';
import * as classnames from 'classnames';

import bevis from 'client/lib/bevis';

import './index.scss';

interface Props {
    size?: 'small' | 'regular' | 'header' | 'large';
    color?: 'black' | 'white' | 'gray' | 'primary' | 'secondary';
    text: string;
    className?: string;
}

const b = bevis('bfluffy-label');
const bColor = bevis('bfluffy-label-color');
const bSize = bevis('bfluffy-label-size');

export class Label extends React.Component<Props> {
	public render(): React.ReactNode {
		const {
			text, color, size, className
		} = this.props;

		return (
			<div className={classnames({
				[b('container')]: true,
				[bSize(size || 'regular')]: true,
				[bColor(color || 'black')]: true,
				...(className ? {[className]: true} : {})
			})}
			>
				{text}
			</div>
		);
	}
}
