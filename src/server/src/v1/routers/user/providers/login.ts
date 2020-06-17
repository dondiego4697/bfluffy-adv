import {Request, Response} from 'express';
import * as Boom from '@hapi/boom';
import {wrap} from 'async-middleware';
import {AuthToken} from 'server/lib/auth-token';
import {UserDbProvider} from 'server/v1/db-provider/user';
import {verifiedUser} from 'server/v1/db-provider/user/api/update-user';
import {ClientStatusCode} from 'server/types/consts';
import {logger} from 'server/lib/logger';
import {getPasswordHash} from 'server/lib/crypto';

interface Credentials {
	email: string;
	password: string;
}

interface Body {
    verified_token?: string;
    credentials?: Credentials;
}

export const login = wrap<Request, Response>(async (req, res) => {
	const {
		verified_token: verifiedToken,
		credentials
	} = req.body as Body;

	if (verifiedToken) {
		res.json(await loginByVerifiedToken(verifiedToken));
		return;
	}

	if (credentials) {
		res.json(await loginByCredentials(credentials));
		return;
	}

	throw Boom.badImplementation();
});

async function loginByVerifiedToken(token: string) {
	const credentials = AuthToken.decode(token);

	const user = await UserDbProvider.getUserByCredentials(
		credentials.email,
		getPasswordHash(credentials.password)
	);

	if (!user) {
		logger.error(`User by verified token email: ${credentials.email} did not found`);
		throw Boom.badRequest(ClientStatusCode.USER_NOT_EXIST);
	}

	if (!user.verified) {
		await verifiedUser(user.email);
	}

	return {token};
}

async function loginByCredentials(credentials: Credentials) {
	const user = await UserDbProvider.getUserByCredentials(
		credentials.email,
		getPasswordHash(credentials.password)
	);

	if (!user) {
		logger.error(`User by credentials email: ${credentials.email} did not found`);
		throw Boom.badRequest(ClientStatusCode.USER_NOT_EXIST);
	}

	if (!user.verified) {
		throw Boom.badRequest(ClientStatusCode.USER_NOT_VERIFIED);
	}

	return {token: AuthToken.encode(credentials)};
}
