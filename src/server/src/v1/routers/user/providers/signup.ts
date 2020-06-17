import * as Boom from '@hapi/boom';
import {URL, URLSearchParams} from 'url';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {SignUpType} from 'server/types/consts';
import {UserDbProvider} from 'server/v1/db-provider/user';
import {AuthToken} from 'server/lib/auth-token';
import {config} from 'server/config';
import {sendEmail} from 'server/lib/send-email';
import {getPasswordHash} from 'server/lib/crypto';

interface Body {
    external_token?: string;
    email: string;
    type: SignUpType;
    name: string;
    password: string;
}

export const signup = wrap<Request, Response>(async (req, res) => {
	const body = req.body as Body;

	if (body.type === SignUpType.EMAIL) {
		res.json(await signupByEmail(body));
		return;
	}

	throw Boom.badImplementation();
});

export function formEmailMessage(token: string) {
	const host = config['host.app'];

	const url = new URL('/login', host);
	const query = new URLSearchParams({
		verified_token: token
	});
	url.search = query.toString();

	return {
		html: `<div>${url.toString()}</div>`,
		text: url.toString()
	};
}

async function signupByEmail(body: Body) {
	const user = await UserDbProvider.createUser({
		email: body.email,
		name: body.name,
		type: body.type,
		password: getPasswordHash(body.password)
	});

	const token = AuthToken.encode({
		email: user.email,
		password: body.password
	});

	const {html, text} = formEmailMessage(token);

	// DO NOT TOUCH !!! OR TEST MANUAL
	await sendEmail(user.email, {
		subject: 'top subject',
		html,
		text
	});

	return {token};
}
