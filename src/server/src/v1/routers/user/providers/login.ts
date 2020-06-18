import {Request, Response} from 'express';
import * as Boom from '@hapi/boom';
import {wrap} from 'async-middleware';
import {AuthToken} from 'server/lib/auth-token';
import {UserDbProvider} from 'server/v1/db-provider/user';
import {verifiedUser} from 'server/v1/db-provider/user/api/update-user';
import {ClientStatusCode} from 'server/types/consts';
import {logger} from 'server/lib/logger';
import {config} from 'server/config';
import {getPasswordHash} from 'server/lib/crypto';

interface Credentials {
	email: string;
	password: string;
}

interface Body {
    auth_token?: string;
    credentials?: Credentials;
}

export const login = wrap<Request, Response>(async (req, res) => {
	const {
		auth_token: authToken,
		credentials
	} = req.body as Body;

	let token: string | null = null;

	if (authToken) {
		token = await loginByAuthToken(authToken);
	}

	if (credentials) {
		token = await loginByCredentials(credentials);
	}

	if (!token) {
		throw Boom.badImplementation();
	}

	res.cookie('auth_token', token, {maxAge: config['auth.token.ttl']});
	res.json({});
});

async function loginByAuthToken(authToken: string): Promise<string> {
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

	return authToken;
}

async function loginByCredentials(credentials: Credentials): Promise<string> {
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

	return AuthToken.encode(credentials);
}
