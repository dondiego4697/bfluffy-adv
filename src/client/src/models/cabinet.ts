import {observable, action} from 'mobx';

import {BasePageModel} from 'client/models/base';
import {
	FarmRequestBookV1,
	Farm
} from 'client/lib/request-book/v1/farm';

export class CabinetModel extends BasePageModel {
    @observable public farmList: Farm[] = [];

	@action public getFarmList() {
    	this.setLoading();

    	return FarmRequestBookV1.getFarmList()
    		.then((data) => {
    			this.farmList = data;
    		})
    		.finally(() => this.setReady());
    }
}
