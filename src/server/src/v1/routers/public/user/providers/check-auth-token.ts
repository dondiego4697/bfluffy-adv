import {Request, Response} from 'express';
import * as Boom from '@hapi/boom';
import {wrap} from 'async-middleware';
import {AuthToken} from 'server/lib/auth-token';
import {UserDbProvider} from 'server/v1/db-provider/user';
import {ClientStatusCode} from 'server/types/consts';
import {setAuthTokenCookie} from 'server/middlewares/auth';

export const checkAuthToken = wrap<Request, Response>(async (req, res) => {
    const {auth_token: authToken} = req.cookies;

    if (!authToken) {
        throw Boom.unauthorized(ClientStatusCode.USER_NOT_AUTHORIZED);
    }

    const credentials = AuthToken.decode(authToken);
    const user = await UserDbProvider.getUserByEmail(credentials.email);

    if (!user) {
        throw Boom.badRequest(ClientStatusCode.USER_NOT_EXIST);
    }

    if (user.verifiedCode !== credentials.verifiedCode) {
        throw Boom.badRequest(ClientStatusCode.USER_WRONG_VERIFIED_CODE);
    }

    setAuthTokenCookie(authToken, res);
    res.json({
        authToken,
        email: user.email,
        contacts: user.contacts,
        name: user.name,
        verified: user.verified,
        avatar: user.avatar
    });
});
