import * as Boom from '@hapi/boom';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {SignUpType} from 'server/types/consts';
import {UserDbProvider} from 'server/v1/db-provider/user';
import {AuthToken} from 'server/lib/auth-token';
import {sendEmail} from 'server/lib/send-email';
import {getPasswordHash} from 'server/lib/crypto';
import {EmailMessage} from 'server/email-message';

interface Body {
    externalToken?: string;
    email: string;
    type: SignUpType;
    name: string;
    password: string;
}

export const signup = wrap<Request, Response>(async (req, res) => {
	const body = req.body as Body;

	let result: any | null = null;

	if (body.type === SignUpType.EMAIL) {
		result = await signupByEmail(body);
	}

	if (!result) {
		throw Boom.badImplementation();
	}

	res.json(result);
});

async function signupByEmail(body: Body) {
	const user = await UserDbProvider.createUser({
		email: body.email,
		name: body.name,
		type: body.type,
		password: getPasswordHash(body.password)
	});

	const authToken = AuthToken.encode({
		email: user.email,
		password: body.password
	});

	const {html, text} = EmailMessage.signup(authToken);

	await sendEmail(user.email, {
		subject: 'TODO top subject',
		html,
		text
	});

	return {authToken};
}
