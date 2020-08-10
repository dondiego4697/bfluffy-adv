import * as React from 'react';
import {Modal as ModalBase} from 'antd';

import bevis from 'client/lib/bevis';

import './index.scss';

interface Props {
    visible?: boolean;
    footer?: React.ReactNode;
    onCancelHandler?: () => void;
}

const b = bevis('bfluffy-modal');

export class Modal extends React.Component<Props> {
	public render(): React.ReactNode {
		const {footer, visible, onCancelHandler} = this.props;

		return (
			<ModalBase
				className={b()}
				visible={visible}
				closable={false}
				centered
				footer={footer}
				onCancel={onCancelHandler}
				closeIcon={null}
			>
				{this.props.children}
        	</ModalBase>
		);
	}
}
