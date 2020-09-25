import * as React from 'react';
import * as classnames from 'classnames';
import {Link} from 'react-router-dom';

import bevis from 'client/lib/bevis';

import './index.scss';

interface BaseProps {
    text: string;
    className?: string;
    hrefTo?: string;
}

interface ButtonProps extends BaseProps {
    type: 'primary' | 'base';
    onClickHandler?: () => void;
    htmlType?: 'button' | 'submit' | 'reset';
}

interface LinkProps extends BaseProps {
    type: 'link';
    hrefTo: string;
}

type Props = LinkProps | ButtonProps;

const b = bevis('bfluffy-button');
const bType = bevis('bfluffy-button-type');

export class Button extends React.Component<Props> {
    public render(): React.ReactNode {
        const {type, className, text} = this.props;

        return (
            <div
                className={classnames({
                    [b()]: true,
                    ...(className ? {[className]: true} : {})
                })}
            >
                {this.props.type === 'link' ? (
                    <Link to={this.props.hrefTo} className={bType(type)}>
                        {text}
                    </Link>
                ) : this.props.hrefTo ? (
                    <Link to={this.props.hrefTo} className={bType(type)}>
                        {text}
                    </Link>
                ) : (
                    <input
                        value={text}
                        className={bType(type)}
                        onClick={this.props.onClickHandler}
                        type={this.props.htmlType || 'button'}
                    />
                )}
            </div>
        );
    }
}
