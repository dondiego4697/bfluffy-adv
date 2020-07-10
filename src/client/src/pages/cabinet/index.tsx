import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {Card, Skeleton} from 'antd';
import {RouteComponentProps} from 'react-router';
import {EditOutlined} from '@ant-design/icons';

import {CabinetModel} from 'client/models/cabinet';
import {ClientDataModel} from 'client/models/client-data';
import bevis from 'client/lib/bevis';
import {RoutePaths} from 'client/lib/routes';
import {DataState} from 'client/consts';

import './index.scss';

interface Props extends RouteComponentProps {
	cabinetModel: CabinetModel;
	clientDataModel: ClientDataModel;
}

const b = bevis('cabinet');
const {Meta} = Card;

@inject('cabinetModel', 'clientDataModel')
@observer
export class CabinetPage extends React.Component<Props> {
	public componentDidMount(): void {
    	this.loadData();
	}

	private loadData() {
    	return this.props.cabinetModel!.getFarmList();
	}

	public render(): React.ReactNode {
    	return (
  			<div className={b()}>
  				<div className={b('container')}>
				  	<Skeleton
						loading={this.props.clientDataModel.state === DataState.LOADING}
						active={true}
					>
    				{
						this.props.cabinetModel.farmList.map((farm) => (
							<Card
								key={`farm-item-${farm.createdAt}`}
								style={{width: 300}}
								actions={[
									<EditOutlined
										key='edit'
										onClick={() => {
											this.props.history.push(
												RoutePaths.FARM_EDIT.replace(':id', farm.farmPublicId)
											);
										}}
									/>
								]}
							>
								<Meta
									title={farm.name}
									description={farm.description}
								/>
							</Card>
						))
					}
					</Skeleton>
    			</div>
    		</div>
    	);
	}
}
