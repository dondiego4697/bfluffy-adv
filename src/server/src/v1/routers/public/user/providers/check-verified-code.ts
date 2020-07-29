import {Request, Response} from 'express';
import * as Boom from '@hapi/boom';
import {wrap} from 'async-middleware';
import {AuthToken} from 'server/lib/auth-token';
import {UserDbProvider} from 'server/v1/db-provider/user';
import {ClientStatusCode} from 'server/types/consts';
import {setAuthTokenCookie} from 'server/middlewares/auth';

interface Body {
    email: string;
    verifiedCode: string;
}

export const checkVerifiedCode = wrap<Request, Response>(async (req, res) => {
	const {email, verifiedCode} = req.body as Body;

	const user = await UserDbProvider.getUserByEmail(email);

	if (!user) {
		throw Boom.badRequest(ClientStatusCode.USER_NOT_EXIST);
	}

	if (user.verifiedCode !== verifiedCode) {
		throw Boom.badRequest(ClientStatusCode.USER_WRONG_VERIFIED_CODE);
	}

	if (!user.verified) {
		await UserDbProvider.verifiedUser(email);
		user.verified = true;
	}

	const authToken = AuthToken.encode({
		email,
		verifiedCode
	});

	setAuthTokenCookie(authToken, res);
	res.json({
		authToken,
		email: user.email,
		verified: user.verified
	});
});
