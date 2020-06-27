import {getCityList} from 'server/v1/db-provider/geo/api/get-city-list';
import {getCityByCityCode} from 'server/v1/db-provider/geo/api/get-city-by-city-code';

export const GeoDbProvider = {
	getCityList,
	getCityByCityCode
};
