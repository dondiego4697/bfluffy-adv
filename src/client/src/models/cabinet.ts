import {observable, action} from 'mobx';

import {BasePageModel} from 'client/models/base';

export class CabinetPageModel extends BasePageModel {
    @observable public foo: any[] = [];

	@action public getBar() {
    	this.setLoading();

    	// return FarmRequestBookV1.getFarmList()
    	// 	.then((data) => {
    	// 		this.farmList = data;
    	// 	})
    	// 	.finally(() => this.setReady());
    }
}
