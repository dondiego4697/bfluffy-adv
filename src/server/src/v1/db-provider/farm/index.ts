import {createFarm} from 'server/v1/db-provider/farm/api/create-farm';
import {updateFarm} from 'server/v1/db-provider/farm/api/update-farm';
import {getFarmByPublicId} from 'server/v1/db-provider/farm/api/get-farm-by-public-id';

export const FarmDbProvider = {
	createFarm,
	updateFarm,
	getFarmByPublicId
};
