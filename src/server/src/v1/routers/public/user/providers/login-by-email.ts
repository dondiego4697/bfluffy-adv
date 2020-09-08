import {Request, Response} from 'express';
import {random} from 'lodash';
import {sendEmail} from 'server/lib/send-email';
import {wrap} from 'async-middleware';
import {UserDbProvider} from 'server/v1/db-provider/user';
import {EmailMessage} from 'server/email-message';

interface Body {
    email: string;
}

export const loginByEmail = wrap<Request, Response>(async (req, res) => {
	const {email} = req.body as Body;

	// TODO сделать проверку, чтобы не спамили

	const user = await UserDbProvider.getUserByEmail(email);
	const verifiedCode = String(random(1000, 9999));
	const html = EmailMessage.verifiedCode(verifiedCode);

	if (user) {
		await UserDbProvider.updateVerifiedCodeByEmail({
			email,
			verifiedCode
		});
	} else {
		await UserDbProvider.createUser({
			email,
			verifiedCode
		});
	}

	await sendEmail(email, {
		subject: 'Вход на сайт bfluffy.ru',
		html
	});

	res.json({});
});
