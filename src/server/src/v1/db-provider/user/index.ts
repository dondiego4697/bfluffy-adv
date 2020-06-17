import {createUser} from 'server/v1/db-provider/user/api/create-user';
import {
	verifiedUser
} from 'server/v1/db-provider/user/api/update-user';
import {
	getUserByEmail,
	getUserByCredentials
} from 'server/v1/db-provider/user/api/get-user';

export const UserDbProvider = {
	createUser,
	getUserByEmail,
	getUserByCredentials,
	verifiedUser
};
