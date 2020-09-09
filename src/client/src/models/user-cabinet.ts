import {observable, action} from 'mobx';

import {BasePageModel} from 'client/models/base';
import {FarmRequestBookV1} from 'client/lib/request-book/v1/farm';

export class UserCabinetPageModel extends BasePageModel {
    @observable public farmList: any[] = [];

    @action public getBar() {
        this.setLoading();

        return FarmRequestBookV1.getFarmList()
            .then((data) => {
                // this.farmList = data;
            })
            .finally(() => this.setReady());
    }
}
