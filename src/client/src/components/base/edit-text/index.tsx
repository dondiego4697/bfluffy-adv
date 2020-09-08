import * as React from 'react';
import * as classnames from 'classnames';
import {Input} from 'antd';

import bevis from 'client/lib/bevis';

import './index.scss';

interface Props {
    placeholder?: string;
	className?: string;
}

export const EDIT_TEXT_ROOT_CLASS_NAME = 'bfluffy-edit-text';
export const EDIT_TEXT_FORM_ITEM_CLASS_NAME = 'bfluffy-edit-text-form-item';

const b = bevis(EDIT_TEXT_ROOT_CLASS_NAME);

export class EditText extends React.Component<Props> {
	public render(): React.ReactNode {
		const {className, placeholder} = this.props;

		return (
			<Input
				className={classnames({
					[b()]: true,
					...(className ? {[className]: true} : {})
				})}
    			placeholder={placeholder}
			/>
		);
	}
}
