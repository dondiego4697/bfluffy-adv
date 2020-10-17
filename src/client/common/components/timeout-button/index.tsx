import * as React from 'react';
import * as classnames from 'classnames';

import bevis from 'common/lib/bevis';

import './index.scss';

interface Props {
    text: string;
    seconds: number;
    onClickHandler: () => void;
}

interface State {
    seconds: number;
}

const b = bevis('bfluffy-timeout-button');

export class TimeoutButton extends React.Component<Props, State> {
    state: State = {
        seconds: 0
    };

    interval: number | undefined;

    public componentWillMount() {
        this.launchInterval(0);
    }

    private launchInterval(seconds: number) {
        this.setState({seconds});

        this.interval = (setInterval(() => {
            if (this.state.seconds !== 0) {
                return this.setState({seconds: this.state.seconds - 1});
            }

            clearInterval(this.interval);
            this.interval = undefined;
        }, 1000) as unknown) as number;
    }

    private getFormattedTime(secondsRaw: number) {
        const seconds = secondsRaw % 60;
        const minutes = Math.floor(secondsRaw / 60);

        return [minutes < 10 ? `0${minutes}` : minutes, seconds < 10 ? `0${seconds}` : seconds].join(':');
    }

    public render(): React.ReactNode {
        const {text, seconds, onClickHandler} = this.props;

        const enable = this.state.seconds === 0;
        const formattedTime = this.getFormattedTime(this.state.seconds);

        return (
            <div className={b()}>
                <div className={b('container')}>
                    <p
                        className={classnames({
                            [b('button')]: true,
                            [b('button_disable')]: !enable
                        })}
                        onClick={() => {
                            if (!enable) {
                                return;
                            }

                            this.launchInterval(seconds);

                            onClickHandler();
                        }}
                    >
                        {`${text}${enable ? '' : `, ${formattedTime}`}`}
                    </p>
                </div>
            </div>
        );
    }
}
