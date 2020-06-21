import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {AuthToken} from 'server/lib/auth-token';
import {UserDbProvider} from 'server/v1/db-provider/user';
import {getPasswordHash} from 'server/lib/crypto';

interface UserData {
	isAuth: boolean; // Запрос с auth токеном
	isExistInDb: boolean;
	isVerified: boolean;
}

declare global {
    namespace Express {
        interface Request {
            userData: UserData;
        }
    }
}

export const auth = wrap<Request, Response>(async (req) => {
	req.userData = {
		isAuth: false,
		isExistInDb: false,
		isVerified: false
	};

	const {auth_token: authToken} = req.cookies;

	if (!authToken) {
		return;
	}

	req.userData.isAuth = true;

	const credentials = AuthToken.decode(authToken);
	const user = await UserDbProvider.getUserByCredentials(
		credentials.email,
		getPasswordHash(credentials.password)
	);

	if (!user) {
		return;
	}

	req.userData.isExistInDb = true;
	req.userData.isVerified = user.verified;
});
