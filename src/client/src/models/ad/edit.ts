import {observable, action, computed} from 'mobx';

import {BasePageModel} from 'client/models/base';

export class AdEditPageModel extends BasePageModel {
    @observable public ad: any | null = null;
    @observable public notFound: boolean = false;

    @observable public categoryCodeSelected: string = '';

    @action public getInfo(publicId: string) {
        this.setLoading();
    }

    @computed public get isNew() {
        return !this.ad?.farmPublicId;
    }

    @action public updateCategoryCode(code: string) {
        this.categoryCodeSelected = code;
    }

    @action public clearAd() {
        this.ad = null;
    }
}
