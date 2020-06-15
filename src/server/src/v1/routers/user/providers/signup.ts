import * as crypto from 'crypto';
import {URL, URLSearchParams} from 'url';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {SignUpType} from 'server/types/consts';
import {UserDbProvider} from 'server/v1/db-provider/user';
import {AuthToken} from 'server/lib/auth-token';
import {config} from 'server/config';
import {sendEmail} from 'server/lib/send-email';

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

	res.json({success: false});
});

async function signupByEmail(body: Body) {
	const hash = crypto.createHmac('sha256', '').update(body.password).digest('hex');
	const user = await UserDbProvider.createUser({
		email: body.email,
		name: body.name,
		type: body.type,
		password: hash
	});

	const token = AuthToken.encode({
		email: user.email,
		password: user.password
	});

	const host = config['host.app'];
	const url = new URL('/login', host);
	const query = new URLSearchParams({
		token,
		verified: '1'
	});
	url.search = query.toString();

	await sendEmail(user.email, {
		subject: 'top subject',
		text: url.toString(),
		html: `<div>${url.toString()}</div>`
	});

	return {success: true};
}
