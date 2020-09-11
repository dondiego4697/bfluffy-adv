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

    @computed public get formFields() {
        if (!this.ad) {
            return [];
        }

        return [
            // {
            //     name: ['farmName'],
            //     value: this.farm.name
            // },
            // {
            //     name: ['farmDescription'],
            //     value: this.farm.description
            // },
            // {
            //     name: ['farmAddress'],
            //     value: this.farm.address
            // },
            // {
            //     name: ['email'],
            //     value: this.farm.contacts.email
            // },
            // {
            //     name: ['phone'],
            //     value: this.farm.contacts.phone
            // },
            // {
            //     name: ['cityCode'],
            //     value: {
            //         // value: city?.cityCode,
            //         // label: city?.cityDisplayName
            //     }
            // }
        ];
    }

    @action public clearAd() {
        this.ad = null;
    }
}
