import * as React from 'react';
import * as classnames from 'classnames';
import {Link} from 'react-router-dom';

import bevis from 'client/lib/bevis';

import './index.scss';

interface Props {
    type: 'primary' | 'link' | 'base';
    text: string;
    onClickHandler?: () => void;
    htmlType?: 'button' | 'submit' | 'reset';
	className?: string;
	hrefTo?: string;
}

const b = bevis('bfluffy-button');
const bType = bevis('bfluffy-button-type');

export class Button extends React.Component<Props> {
	public render(): React.ReactNode {
		const {
			text, type, htmlType, className,
			onClickHandler, hrefTo
		} = this.props;

		return (
			<div className={classnames({
				[b()]: true,
				...(className ? {[className]: true} : {})
			})}
			>
				{
					hrefTo && (
						<Link
							to={hrefTo}
							className={bType(type)}
						>
							{text}
						</Link>
					)
                	|| (
                		<input
                		value={text}
                		className={bType(type)}
                		onClick={onClickHandler}
                		type={htmlType || 'button'}
                		/>
                	)
				}
			</div>
		);
	}
}
