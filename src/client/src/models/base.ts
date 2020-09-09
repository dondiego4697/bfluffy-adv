import {observable} from 'mobx';

import {DataState} from 'client/consts';
import {clientDataModel} from 'client/models';

export class BasePageModel {
    @observable public state: DataState = DataState.LOADING;

    public setLoading() {
        this.state = DataState.LOADING;
        clientDataModel.state = DataState.LOADING;
    }

    public setReady() {
        this.state = DataState.READY;
        clientDataModel.state = DataState.READY;
    }
}
