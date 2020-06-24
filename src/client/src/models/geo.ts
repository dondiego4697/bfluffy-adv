import {observable, action} from 'mobx';
import {flatten} from 'lodash';

import {GeoRequestBookV1, RegionsHash, City} from 'client/lib/request-book/v1/geo';

export class GeoModel {
    @observable public regionsHash: RegionsHash = {};

    @observable public cityList: City[] = [];

    constructor() {
    	this.initRegionsHash();
    }

	@action public initRegionsHash() {
    	return GeoRequestBookV1.getRegionsHash()
    		.then((response) => {
    			this.regionsHash = response;
    			this.cityList = flatten(Object.values(response));
    		});
    }

	public findCityByName(subtext: string) {
		return this.cityList.filter(
			(city) => city.cityDisplayName.toLowerCase().includes(subtext.toLowerCase())
		);
	}
}
