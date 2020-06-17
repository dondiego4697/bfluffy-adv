import * as jwt from 'jsonwebtoken';
import * as Boom from '@hapi/boom';
import {config} from 'server/config';
import {logger} from 'server/lib/logger';
import {ClientStatusCode} from 'server/types/consts';

interface Data {
    email: string;
    password: string;
}

const PRIVATE_KEY = config['auth.privateKey'];

function encode(data: Data): string {
	return jwt.sign(data, PRIVATE_KEY);
}

function decode(token: string): Data {
	try {
		return jwt.verify(token, PRIVATE_KEY) as Data;
	} catch (error) {
		logger.error(error);
		throw Boom.badRequest(ClientStatusCode.USER_INVALID_TOKEN);
	}
}

export const AuthToken = {
	encode,
	decode
};
