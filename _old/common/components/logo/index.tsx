import * as React from 'react';
import {Link} from 'react-router-dom';

import {RoutePaths} from 'common/lib/routes';
import bevis from 'common/lib/bevis';
import {LOGO_SVG} from 'common/svg/icons';

import './index.scss';

const b = bevis('logo');

export class Logo extends React.Component {
    public render(): React.ReactNode {
        return (
            <div className={b('container')}>
                <Link to={RoutePaths.MAIN} className={b()}>
                    {LOGO_SVG}
                    <h2>bfluffy.ru</h2>
                    <img className="beta" alt="beta" src="https://img.icons8.com/windows/96/000000/beta.png" />
                </Link>
            </div>
        );
    }
}
