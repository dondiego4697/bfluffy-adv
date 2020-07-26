import {getUserCardByUserId} from 'server/v1/db-provider/user-card/api/get-user-card-by-user-id';
import {createUserCard} from 'server/v1/db-provider/user-card/api/create-user-card';
import {updateUserCard} from 'server/v1/db-provider/user-card/api/update-user-card';

export const UserCardDbProvider = {
	getUserCardByUserId,
	createUserCard,
	updateUserCard
};
