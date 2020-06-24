import {observable, action, computed} from 'mobx';

import {BasePageModel} from 'client/models/base';
import {FarmRequestBookV1, CreateFarmParams} from 'client/lib/request-book/v1/farm';
import {City} from 'client/lib/request-book/v1/geo';

interface Farm {
    cityId: number;
    name: string;
}

export class FarmEditModel extends BasePageModel {
    @observable public farm: Farm | null = null;

    @observable public notFound: boolean = false;

    @observable public foundCities: City[] = [];

    @action public fetchFarm(publicId: string) {
    	return publicId;
    }

    @action public createFarm(farm: CreateFarmParams) {
    	this.setLoading();

    	return FarmRequestBookV1.createFarm(farm)
    		.finally(() => this.setReady());
    }

    @computed public get formFields() {
    	if (!this.farm) {
    		return [];
    	}

    	return [
    		{
    			name: ['name'],
    			value: this.farm.name
    		}
    	];
    }

    @action public clearFarm() {
    	this.farm = null;
    }
}
