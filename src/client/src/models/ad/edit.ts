import {observable, action, computed} from 'mobx';

import {BasePageModel} from 'client/models/base';
import {
	FarmRequestBookV1,
	FarmInfo,
	CreateFarmParams
} from 'client/lib/request-book/v1/farm';
import {City} from 'client/lib/request-book/v1/geo';

export class AdEditPageModel extends BasePageModel {
    @observable public farm: FarmInfo | null = null;

    @observable public notFound: boolean = false;

    @observable public foundCities: City[] = [];

	@action public getFarmInfo(publicId: string) {
    	this.setLoading();

    	return FarmRequestBookV1.getFarmInfo(publicId)
    		.then((data) => {
    			this.farm = data;
    			this.notFound = false;
    		})
    		.catch((error) => {
    			if (error.response.status >= 400) {
    				this.notFound = true;
    				return;
    			}

    			throw error;
    		})
    		.finally(() => this.setReady());
    }

    @action public createFarm(farm: CreateFarmParams) {
    	this.setLoading();

    	return FarmRequestBookV1.createFarm(farm)
    		.finally(() => this.setReady());
	}

	@action public updateFarm(farm: CreateFarmParams) {
    	this.setLoading();

    	return FarmRequestBookV1.updateFarm(this.farm!.farmPublicId, farm)
    		.finally(() => this.setReady());
    }

	@action public findCity(cityDisplayName?: string) {
		if (!cityDisplayName) {
    		return [];
    	}

		// this.foundCities = geoModel.findCityByName(cityDisplayName);
	}

	@computed public get isNew() {
		return !this.farm?.farmPublicId;
	}

    @computed public get formFields() {
    	if (!this.farm) {
    		return [];
    	}

		// const city = geoModel.findCityByCode(this.farm.cityCode);
    	return [
    		{
    			name: ['farmName'],
    			value: this.farm.name
			},
			{
    			name: ['farmDescription'],
    			value: this.farm.description
			},
			{
    			name: ['farmAddress'],
    			value: this.farm.address
			},
			{
    			name: ['email'],
    			value: this.farm.contacts.email
			},
			{
    			name: ['phone'],
    			value: this.farm.contacts.phone
			},
			{
				name: ['cityCode'],
				value: {
					// value: city?.cityCode,
					// label: city?.cityDisplayName
				}
    		}
    	];
	}

    @action public clearFarm() {
    	this.farm = null;
    }
}
