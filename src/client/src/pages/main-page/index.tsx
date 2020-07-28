import * as React from 'react';
import {inject} from 'mobx-react';

import {ClientDataModel} from 'client/models/client-data';
import {AnimalSearchPanel, SearchParams} from 'client/components/animal-search-panel';
import bevis from 'client/lib/bevis';

import './index.scss';

interface Props {
    clientDataModel?: ClientDataModel;
}

const b = bevis('main-page');

@inject('clientDataModel')
export class MainPage extends React.Component<Props> {
	private onSearchHandler = (params: SearchParams) => {
		console.log(params);
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
