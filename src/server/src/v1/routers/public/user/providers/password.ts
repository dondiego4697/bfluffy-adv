import * as Boom from '@hapi/boom';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {UserDbProvider} from 'server/v1/db-provider/user';
import {logger} from 'server/lib/logger';
import {ClientStatusCode} from 'server/types/consts';
import {sendEmail} from 'server/lib/send-email';
import {AuthToken} from 'server/lib/auth-token';
import {getPasswordHash} from 'server/lib/crypto';
import {EmailMessage} from 'server/email-message';
import {setAuthTokenCookie} from 'server/middlewares/auth';

interface ForgotPasswordBody {
	email: string;
}

interface ResetPasswordBody {
	authToken: string;
	newPassword: string;
}

export const resetPassword = wrap<Request, Response>(async (req, res) => {
	const {authToken, newPassword} = req.body as ResetPasswordBody;

	const credentials = AuthToken.decode(authToken);

	const existedUser = await UserDbProvider.getUserByCredentials(
		credentials.email,
		credentials.password
	);

	if (!existedUser) {
		logger.error(`[reset password] user by email ${credentials.email} did not found`);
		throw Boom.badRequest(ClientStatusCode.USER_NOT_EXIST);
	}

	const user = await UserDbProvider.updatePasswordByEmail(
		credentials.email,
		getPasswordHash(newPassword)
	);

	if (!user) {
		logger.error(`[reset password] user by email ${credentials.email} did not updated`);
		throw Boom.badRequest();
	}

	const token = AuthToken.encode({
		email: user.email,
		password: newPassword
	});

	setAuthTokenCookie(token, res);
	res.json({});
});

export const forgotPassword = wrap<Request, Response>(async (req, res) => {
	const {email} = req.body as ForgotPasswordBody;

	const user = await UserDbProvider.getUserByEmail(email);
	if (!user) {
		logger.error(`[forgot password] user by email ${email} did not found`);
		throw Boom.badRequest(ClientStatusCode.USER_NOT_EXIST);
	}

	const authToken = AuthToken.encode({
		password: user.password, // hashed password :)
		email: user.email
	}, {expiresIn: '1h'});

	const {html, text} = EmailMessage.resetPassword(authToken);

	await sendEmail(user.email, {
		subject: 'TODO top subject',
		html,
		text
	});

	res.json({authToken});
});
