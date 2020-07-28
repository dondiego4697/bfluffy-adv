import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';

import {CabinetPageModel} from 'client/models/cabinet';
import {ClientDataModel} from 'client/models/client-data';
import bevis from 'client/lib/bevis';

import './index.scss';

interface Props extends RouteComponentProps {
	cabinetPageModel: CabinetPageModel;
	clientDataModel: ClientDataModel;
}

const b = bevis('cabinet');

@inject('cabinetPageModel', 'clientDataModel')
@observer
export class CabinetPage extends React.Component<Props> {
	public componentDidMount(): void {
    	this.loadData();
	}

	private loadData() {
    	return this.props.cabinetPageModel!.getBar();
	}

	public render(): React.ReactNode {
    	return (
  			<div className={b()}>
  				<div className={b('container')} />
    		</div>
    	);
	}
}
