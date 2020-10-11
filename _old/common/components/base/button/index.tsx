import * as React from 'react';
import * as classnames from 'classnames';
import {Link} from 'react-router-dom';

import bevis from 'common/lib/bevis';

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

interface ImageProps extends Omit<BaseProps, 'text'> {
    type: 'image';
    hrefTo: string;
    img: React.ReactNode;
}

interface LinkProps extends BaseProps {
    type: 'link';
    hrefTo: string;
}

type Props = LinkProps | ButtonProps | ImageProps;

const b = bevis('bfluffy-button');
const bType = bevis('bfluffy-button-type');

export class Button extends React.Component<Props> {
    public render(): React.ReactNode {
        const {type, className} = this.props;

        return (
            <div
                className={classnames({
                    [b()]: true,
                    ...(className ? {[className]: true} : {})
                })}
            >
                {this.props.type === 'image' ? (
                    <Link to={this.props.hrefTo} className={bType(type)}>
                        {this.props.img}
                    </Link>
                ) : this.props.type === 'link' ? (
                    <Link to={this.props.hrefTo} className={bType(type)}>
                        {this.props.text}
                    </Link>
                ) : this.props.hrefTo ? (
                    <Link to={this.props.hrefTo} className={bType(type)}>
                        {this.props.text}
                    </Link>
                ) : (
                    <input
                        value={this.props.text}
                        className={bType(type)}
                        onClick={this.props.onClickHandler}
                        type={this.props.htmlType || 'button'}
                    />
                )}
            </div>
        );
    }
}
