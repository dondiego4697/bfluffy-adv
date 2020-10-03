import {observable, action} from 'mobx';

import {BasePageModel} from 'client/models/base';
import {CreateAdParams, AdRequestBookV1, AdInfo} from 'client/lib/request-book/v1/ad';
import {NEW_ITEM} from 'common/consts';

export class AdEditPageModel extends BasePageModel {
    @observable public ad: AdInfo | null = null;
    @observable public notFound: boolean = false;

    @action public getInfo(publicId: string) {
        this.setLoading();

        return AdRequestBookV1.getUserAd(publicId)
            .then((response) => (this.ad = response))
            .finally(() => this.setReady());
    }

    @action public createAd(id: string, params: CreateAdParams) {
        this.setLoading();

        if (id === NEW_ITEM) {
            return AdRequestBookV1.createAd(params).finally(() => this.setReady());
        }

        return AdRequestBookV1.updateAd(id, params).finally(() => this.setReady());
    }

    @action public clearAd() {
        this.ad = null;
    }
}
