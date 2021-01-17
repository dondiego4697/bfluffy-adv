import * as Boom from '@hapi/boom';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {UserDbProvider} from 'server/v1/db-provider/user';
import {logger} from 'server/lib/logger';
import {ClientStatusCode} from 'server/types/consts';

interface Body {
    name: string;
    contacts: {
        phone?: string;
    };
}

export const updateUser = wrap<Request, Response>(async (req, res) => {
    const {contacts, name} = req.body as Body;

    const user = await UserDbProvider.getUserById(req.userData.id);
    if (!user) {
        logger.error(`user did not found: ${req.userData.id}`);
        throw Boom.notFound(ClientStatusCode.USER_NOT_EXIST);
    }

    await UserDbProvider.updateUserInfo(req.userData.id, {
        contacts,
        name
    });

    res.json({});
});
