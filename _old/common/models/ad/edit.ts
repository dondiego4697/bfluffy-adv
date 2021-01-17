import {observable, action} from 'mobx';

import {BasePageModel} from 'common/models/base';
import {CreateAdParams, PrivateAdRequestBookV1, AdInfo} from 'common/lib/request-book/v1/private-ad';
import {NEW_ITEM} from 'common/consts';

export class AdEditPageModel extends BasePageModel {
    @observable public ad: AdInfo | null = null;
    @observable public notFound: boolean = false;

    @action public getInfo(publicId: string) {
        this.setLoading();

        return PrivateAdRequestBookV1.getUserAd(publicId)
            .then((response) => (this.ad = response))
            .finally(() => this.setReady());
    }

    @action public createAd(id: string, params: CreateAdParams) {
        this.setLoading();

        if (id === NEW_ITEM) {
            return PrivateAdRequestBookV1.createAd(params).finally(() => this.setReady());
        }

        return PrivateAdRequestBookV1.updateAd(id, params).finally(() => this.setReady());
    }

    @action public clearAd() {
        this.ad = null;
    }
}
