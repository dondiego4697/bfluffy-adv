import {Request, Response} from 'express';
import * as Boom from '@hapi/boom';
import {wrap} from 'async-middleware';
import {AuthToken} from 'server/lib/auth-token';
import {UserDbProvider} from 'server/v1/db-provider/user';
import {verifiedUser} from 'server/v1/db-provider/user/api/update-user';
import {ClientStatusCode} from 'server/types/consts';
import {logger} from 'server/lib/logger';
import {getPasswordHash} from 'server/lib/crypto';
import {setAuthTokenCookie} from 'server/middlewares/auth';

interface Credentials {
	email: string;
	password: string;
}

interface Body {
    authToken?: string;
    credentials?: Credentials;
}

interface UserResponse {
	token: string;
	name: string;
	email: string;
}

export const login = wrap<Request, Response>(async (req, res) => {
	const {authToken, credentials} = req.body as Body;

	let userResponse: UserResponse | null = null;

	if (authToken) {
		userResponse = await loginByAuthToken(authToken);
	}

	if (credentials) {
		userResponse = await loginByCredentials(credentials);
	}

	if (!userResponse) {
		throw Boom.badImplementation();
	}

	setAuthTokenCookie(userResponse.token, res);
	res.json(userResponse);
});

async function loginByAuthToken(authToken: string): Promise<UserResponse> {
	const credentials = AuthToken.decode(authToken);

	const user = await UserDbProvider.getUserByCredentials(
		credentials.email,
		getPasswordHash(credentials.password)
	);

	if (!user) {
		logger.error(`[login by auth token] User by email ${credentials.email} did not found`);
		throw Boom.badRequest(ClientStatusCode.USER_NOT_EXIST);
	}

	if (!user.verified) {
		await verifiedUser(user.email);
	}

	return {
		token: authToken,
		email: user.email,
		name: user.displayName
	};
}

async function loginByCredentials(credentials: Credentials): Promise<UserResponse> {
	const user = await UserDbProvider.getUserByCredentials(
		credentials.email,
		getPasswordHash(credentials.password)
	);

	if (!user) {
		logger.error(`[login by credentials] User by email ${credentials.email} did not found`);
		throw Boom.badRequest(ClientStatusCode.USER_NOT_EXIST);
	}

	if (!user.verified) {
		throw Boom.badRequest(ClientStatusCode.USER_NOT_VERIFIED);
	}

	return {
		token: AuthToken.encode(credentials),
		email: user.email,
		name: user.displayName
	};
}
