import * as Boom from '@hapi/boom';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {AuthToken} from 'server/lib/auth-token';
import {UserDbProvider} from 'server/v1/db-provider/user';
import {getPasswordHash} from 'server/lib/crypto';
import {ClientStatusCode} from 'server/types/consts';
import {config} from 'server/config';

interface UserData {
	id: number;
	isAuth: boolean; // Запрос с auth токеном
	isVerified: boolean;
}

declare global {
    namespace Express {
        interface Request {
            userData: UserData;
        }
    }
}

export const auth = wrap<Request, Response>(async (req, res, next) => {
	req.userData = {
		id: -1,
		isAuth: false,
		isVerified: false
	};

	const {auth_token: authToken} = req.cookies;

	if (!authToken) {
		throw Boom.unauthorized(ClientStatusCode.USER_NOT_AUTHORIZED);
	}

	req.userData.isAuth = true;

	const credentials = AuthToken.decode(authToken);
	const user = await UserDbProvider.getUserByCredentials(
		credentials.email,
		getPasswordHash(credentials.password)
	);

	if (!user) {
		throw Boom.unauthorized(ClientStatusCode.USER_NOT_AUTHORIZED);
	}

	req.userData.id = user.id;
	req.userData.isVerified = user.verified;

	setAuthTokenCookie(authToken, res);

	next();
});

export function setAuthTokenCookie(authToken: string, res: Response) {
	res.cookie('auth_token', authToken, {maxAge: config['auth.token.ttl']});
}
