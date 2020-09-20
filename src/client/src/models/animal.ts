import {observable, action, computed} from 'mobx';
import {groupBy} from 'lodash';

import {AnimalRequestBookV1, AnimalBreed} from 'client/lib/request-book/v1/animal';

interface AnimalCategory {
    code: string;
    displayName: string;
}

export class AnimalModel {
    @observable public breedHash: Record<string, AnimalBreed[]> = {};

    @observable public breedList: AnimalBreed[] = [];

    @observable public categoryList: AnimalCategory[] = [];

    constructor() {
        this.init();
    }

    @computed public get isReady() {
        return Object.values(this.breedHash).length > 0;
    }

    @action public init() {
        return AnimalRequestBookV1.getBreedList().then((response) => {
            this.breedList = response;
            this.breedHash = groupBy(response, 'categoryCode');

            this.categoryList = [];
            Object.entries(this.breedHash).forEach(([code, items]) => {
                this.categoryList.push({
                    code,
                    displayName: items[0].categoryDisplayName
                });
            });
        });
    }
}
