import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classnames from 'classnames';

import bevis from 'common/lib/bevis';

import './index.scss';

interface Props {
    type?: 'error' | 'success';
    visible?: boolean;
    title?: string;
    description?: string;
    okText?: string;
    onCloseHandler: () => void;
}

const b = bevis('bfluffy-popup');

function getWidth() {
    const {clientWidth} = document.body;

    if (clientWidth < 432) {
        return clientWidth - 32;
    }

    return 300;
}

export class Popup extends React.Component<Props> {
    public render(): React.ReactNode {
        const {title, description, okText = 'OK', onCloseHandler, visible} = this.props;

        const children = (
            <div
                className={classnames({
                    [b()]: true,
                    [b('visible')]: visible
                })}
            >
                <div
                    role="button"
                    tabIndex={0}
                    className={b('mask')}
                    onClick={onCloseHandler}
                    onKeyPress={onCloseHandler}
                >
                    <div className={b('container')}>
                        <div
                            role="button"
                            tabIndex={-1}
                            className={b('content')}
                            onClick={(event) => event.stopPropagation()}
                            onKeyPress={(event) => event.stopPropagation()}
                            style={{
                                width: getWidth()
                            }}
                        >
                            <h1 className={b('title')}>{title}</h1>
                            <p className={b('description')}>{description}</p>
                            <div
                                role="button"
                                tabIndex={0}
                                className={b('ok-btn')}
                                onClick={onCloseHandler}
                                onKeyPress={onCloseHandler}
                            >
                                {okText}
                            </div>
                            <div
                                role="button"
                                tabIndex={0}
                                className={b('cross')}
                                onClick={onCloseHandler}
                                onKeyPress={onCloseHandler}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );

        return ReactDOM.createPortal(children, document.body);
    }
}
