import * as React from 'react';
import {identity, pickBy} from 'lodash';
import {inject} from 'mobx-react';
import {RouteComponentProps} from 'react-router-dom';

import {RoutePaths} from 'client/lib/routes';
import {ClientDataModel} from 'client/models/client-data';
import {AnimalSearchPanel, SearchParams} from 'client/components/animal-search-panel';
import bevis from 'client/lib/bevis';

import './index.scss';

interface Props extends RouteComponentProps {
    clientDataModel?: ClientDataModel;
}

const b = bevis('main-page');

@inject('clientDataModel')
export class MainPage extends React.Component<Props> {
    private onSearchHandler = (params: SearchParams) => {
        const searchParams = new URLSearchParams(pickBy(params, identity) as Record<string, string>);

        this.props.history.push(`${RoutePaths.AD_SEARCH}?${searchParams.toString()}`);
    };

    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <AnimalSearchPanel onSearch={this.onSearchHandler} />
                </div>
            </div>
        );
    }
}
