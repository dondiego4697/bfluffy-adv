import * as React from 'react';
import * as classnames from 'classnames';
import {Button as BaseButton} from 'antd';

import bevis from 'client/lib/bevis';

import './index.scss';

interface Props {
    type: 'primary' | 'link' | 'base';
    text: string;
    onClickHandler?: () => void;
    icon?: React.ReactNode;
    htmlType?: 'button' | 'submit' | 'reset';
    className?: string;
}

const b = bevis('bfluffy-button');
const bType = bevis('bfluffy-button-type');

export class Button extends React.Component<Props> {
	public render(): React.ReactNode {
		const {
			text, type, onClickHandler, icon, htmlType, className
		} = this.props;

		return (
			<BaseButton
				icon={icon}
				className={classnames({
					[b()]: true,
					[bType(type)]: true,
					...(className ? {[className]: true} : {})
				})}
				onClick={onClickHandler}
				htmlType={htmlType}
			>
				{text}
			</BaseButton>
		);
	}
}
