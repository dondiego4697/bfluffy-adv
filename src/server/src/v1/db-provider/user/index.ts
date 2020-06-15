import {createUser} from 'server/v1/db-provider/user/api/create-user';
import {getUserByEmail} from 'server/v1/db-provider/user/api/get-user-by-email';

export const UserDbProvider = {
	createUser,
	getUserByEmail
};
