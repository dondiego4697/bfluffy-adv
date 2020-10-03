import * as React from 'react';
import {Link} from 'react-router-dom';
import {RoutePaths} from 'client/lib/routes';

import bevis from 'client/lib/bevis';

import './index.scss';

const b = bevis('logo');

export class Logo extends React.Component {
    public render(): React.ReactNode {
        return (
            <Link to={RoutePaths.MAIN} className={b()}>
                <div className={b('container')}>
                    <img className="logo" src="/image/logo.svg" alt="logo" />
                    <h2>bfluffy.ru</h2>
                    <img className="beta" alt="beta" src="https://img.icons8.com/windows/96/000000/beta.png" />
                </div>
            </Link>
        );
    }
}
