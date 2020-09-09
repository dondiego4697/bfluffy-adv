import * as Boom from '@hapi/boom';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {UserDbProvider} from 'server/v1/db-provider/user';
import {ClientStatusCode} from 'server/types/consts';
import {logger} from 'server/lib/logger';

export const getUserInfo = wrap<Request, Response>(async (req, res) => {
    if (!req.userData.id) {
        throw Boom.forbidden(ClientStatusCode.USER_INFO_FORBIDDEN);
    }

    const user = await UserDbProvider.getUserById(req.userData.id);
    if (!user) {
        logger.error(`user did not found: ${req.userData.id}`);
        throw Boom.notFound(ClientStatusCode.USER_NOT_EXIST);
    }

    res.json({
        contacts: user.contacts,
        name: user.name,
        email: user.email,
        verified: user.verified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    });
});
