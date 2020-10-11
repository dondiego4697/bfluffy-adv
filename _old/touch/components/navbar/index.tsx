import * as React from 'react';
import * as classnames from 'classnames';
import {inject, observer} from 'mobx-react';

import bevis from 'common/lib/bevis';
import {GeneralDataModel} from 'common/models/general-data';
import {Button} from 'common/components/base/button';
import {RoutePaths} from 'common/lib/routes';
import {Logo} from 'common/components/logo';
import {NEW_ITEM} from 'common/consts';
import {USER_SVG, CREATE_AD_SVG} from 'common/svg/icons';

import './index.scss';

interface Props {
    generalDataModel?: GeneralDataModel;
}

const b = bevis('navbar');

@inject('generalDataModel')
@observer
export class Navbar extends React.Component<Props> {
    public render(): React.ReactNode {
        const {generalDataModel} = this.props;

        return (
            <div className={b()}>
                <div className={b('container')}>
                    <Logo />
                    <div className={b('controls-container')}>
                        {generalDataModel?.user ? (
                            <Button
                                className={b('button')}
                                type="image"
                                hrefTo={RoutePaths.USER_CABINET_ADS}
                                img={USER_SVG}
                            />
                        ) : (
                            <Button
                                className={b('button')}
                                type="image"
                                hrefTo={RoutePaths.LOGIN}
                                img={USER_SVG}
                            />
                        )}
                        <Button
                            className={classnames(b('button'), b('create-ad-button'))}
                            type="image"
                            hrefTo={
                                generalDataModel?.user ? RoutePaths.EDITOR_AD.replace(':id', NEW_ITEM) : RoutePaths.LOGIN
                            }
                            img={CREATE_AD_SVG}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
