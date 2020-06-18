import * as jwt from 'jsonwebtoken';
import * as Boom from '@hapi/boom';
import {config} from 'server/config';
import {logger} from 'server/lib/logger';
import {ClientStatusCode} from 'server/types/consts';

interface Credentials {
    email: string;
	password: string;
}

const PRIVATE_KEY = config['auth.privateKey'];

function encode(credentials: Credentials, options?: jwt.SignOptions): string {
	return jwt.sign(credentials, PRIVATE_KEY, options);
}

function decode(token: string): Credentials {
	try {
		const {email, password} = jwt.verify(token, PRIVATE_KEY) as Credentials;
		return {email, password};
	} catch (error) {
		logger.error(error);
		throw Boom.badRequest(ClientStatusCode.USER_INVALID_TOKEN);
	}
}

export const AuthToken = {
	encode,
	decode
};
