import {getRequest} from 'client/lib/request';

export interface City {
    cityCode: string;
    cityDisplayName: string;
    regionCode: string;
    regionDisplayName: string;
}

async function getCityList() {
    return getRequest<City[]>('/api/v1/public/geo/city_list', {
        responseType: 'json'
    });
}

export const GeoRequestBookV1 = {
    getCityList
};
