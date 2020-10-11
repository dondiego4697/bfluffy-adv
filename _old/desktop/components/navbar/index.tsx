import * as React from 'react';
import * as classnames from 'classnames';
import {inject, observer} from 'mobx-react';

import bevis from 'common/lib/bevis';
import {GeneralDataModel} from 'common/models/general-data';
import {Button} from 'common/components/base/button';
import {RoutePaths} from 'common/lib/routes';
import {Logo} from 'common/components/logo';
import {NEW_ITEM} from 'common/consts';

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
                                text={generalDataModel.user.email}
                                type="base"
                                hrefTo={RoutePaths.USER_CABINET_ADS}
                            />
                        ) : (
                            <Button
                                className={b('button')}
                                text="Вход"
                                type="base"
                                hrefTo={RoutePaths.LOGIN}
                            />
                        )}
                        <Button
                            className={classnames(b('button'), b('create-ad-button'))}
                            type="primary"
                            text="Подать объявление"
                            hrefTo={
                                generalDataModel?.user ? RoutePaths.EDITOR_AD.replace(':id', NEW_ITEM) : RoutePaths.LOGIN
                            }
                        />
                    </div>
                </div>
            </div>
        );
    }
}
