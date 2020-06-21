import * as Boom from '@hapi/boom';
import {URL, URLSearchParams} from 'url';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {config} from 'server/config';
import {UserDbProvider} from 'server/v1/db-provider/user';
import {logger} from 'server/lib/logger';
import {ClientStatusCode} from 'server/types/consts';
import {sendEmail} from 'server/lib/send-email';
import {AuthToken} from 'server/lib/auth-token';
import {getPasswordHash} from 'server/lib/crypto';

interface ForgotPasswordBody {
	email: string;
}

interface ResetPasswordBody {
	auth_token: string;
	new_password: string;
}

export const resetPassword = wrap<Request, Response>(async (req, res) => {
	const {
		auth_token: authToken,
		new_password: newPassword
	} = req.body as ResetPasswordBody;

	const credentials = AuthToken.decode(authToken);

	const existedUser = await UserDbProvider.getUserByCredentials(
		credentials.email,
		credentials.password
	);

	if (!existedUser) {
		logger.error(`[reset password] User by email ${credentials.email} did not found`);
		throw Boom.badRequest(ClientStatusCode.USER_NOT_EXIST);
	}

	const user = await UserDbProvider.updatePasswordByEmail(
		credentials.email,
		getPasswordHash(newPassword)
	);

	if (!user) {
		logger.error(`[reset password] User by email ${credentials.email} did not updated`);
		throw Boom.badRequest();
	}

	const token = AuthToken.encode({
		email: user.email,
		password: newPassword
	});

	res.cookie('auth_token', token, {maxAge: config['auth.token.ttl']});
	res.json({});
});

export const forgotPassword = wrap<Request, Response>(async (req, res) => {
	const {email} = req.body as ForgotPasswordBody;

	const user = await UserDbProvider.getUserByEmail(email);
	if (!user) {
		logger.error(`[forgot password] User by email ${email} did not found`);
		throw Boom.badRequest(ClientStatusCode.USER_NOT_EXIST);
	}

	const authToken = AuthToken.encode({
		password: user.password, // hashed password :)
		email: user.email
	}, {expiresIn: '1h'});

	const {html, text} = formEmailMessage(authToken);

	await sendEmail(user.email, {
		subject: 'TODO top subject',
		html,
		text
	});

	res.json({auth_token: authToken});
});

export function formEmailMessage(authToken: string) {
	const host = config['host.app'];

	const url = new URL('/reset_password', host);
	const query = new URLSearchParams({auth_token: authToken});
	url.search = query.toString();

	return {
		html: `<div>${url.toString()}</div>`,
		text: url.toString()
	};
}
