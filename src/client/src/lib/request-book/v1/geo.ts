import {getRequest} from 'client/lib/request';

export interface City {
    cityCode: string;
    cityDisplayName: string;
    regionCode: number;
    regionDisplayName: string;
}

export type RegionsHash = Record<string, City[]>;

async function getRegionsHash() {
	return getRequest<RegionsHash>(
		'/api/v1/geo/regions_hash',
		{
			responseType: 'json'
		}
	);
}

export const GeoRequestBookV1 = {
	getRegionsHash
};
