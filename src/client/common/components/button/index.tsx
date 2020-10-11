import * as React from 'react';
import * as classnames from 'classnames';
import {Link} from 'react-router-dom';

import bevis from 'common/lib/bevis';

import './index.scss';

interface BaseProps {
    text: string;
    className?: string;
    styleType: 'primary' | 'base' | 'link';
    htmlType?: 'button' | 'submit' | 'reset';
}

interface ButtonProps extends BaseProps {
    actionType: 'button';
    onClickHandler: () => void;
}

interface LinkProps extends BaseProps {
    actionType: 'link';
    hrefTo: string;
}

type Props = LinkProps | ButtonProps;

const b = bevis('bfluffy-button');
const bType = bevis('bfluffy-button-type');

export class Button extends React.Component<Props> {
    public render(): React.ReactNode {
        const {styleType, text, className, htmlType = 'button'} = this.props;

        return (
            <div
                className={classnames({
                    [b()]: true,
                    ...(className ? {[className]: true} : {})
                })}
            >
                {this.props.actionType === 'link' ? (
                    <Link to={this.props.hrefTo} className={bType(styleType)}>
                        {text}
                    </Link>
                ) : (
                    <input
                        value={this.props.text}
                        className={bType(styleType)}
                        onClick={this.props.onClickHandler}
                        type={htmlType}
                    />
                )}
            </div>
        );
    }
}
