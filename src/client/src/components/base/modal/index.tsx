import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classnames from 'classnames';

import bevis from 'client/lib/bevis';
import {SpinnerWrapper} from 'client/components/base/spinner/spinner-wrapper';

import './index.scss';

interface Props {
    visible?: boolean;
    loading?: boolean;
	title?: string;
    onCloseHandler?: () => void;
}

const b = bevis('bfluffy-modal');

function getWidth() {
	const {clientWidth} = document.body;

	if (clientWidth < 632) {
		return clientWidth - 32;
	}

	return 600;
}

export class Modal extends React.Component<Props> {
	public componentDidUpdate() {
		document.body.style.overflow = this.props.visible ? 'hidden' : 'auto';
	}

	public render(): React.ReactNode {
		const {
			title, onCloseHandler,
			loading, visible
		} = this.props;

		const children = (
			<div
				className={classnames({
					[b()]: true,
					[b('visible')]: visible
				})}
			>
				<div
					role='button'
					tabIndex={0}
					className={b('mask')}
					onClick={onCloseHandler}
					onKeyPress={onCloseHandler}
				>
					<div className={b('container')}>
						<SpinnerWrapper spinning={loading}>
							<div
								role='button'
								tabIndex={-1}
								className={b('content')}
								onClick={(event) => event.stopPropagation()}
								onKeyPress={(event) => event.stopPropagation()}
								style={{
									width: getWidth()
								}}
							>
                        	    <h1 className={b('title')}>
                        	        {title}
                        	    </h1>
								<div
									role='button'
									tabIndex={0}
									className={b('cross')}
									onClick={onCloseHandler}
									onKeyPress={onCloseHandler}
								/>
								{this.props.children}
							</div>
						</SpinnerWrapper>
					</div>
				</div>
			</div>
		);

		return ReactDOM.createPortal(
			children,
			document.body
		);
	}
}
