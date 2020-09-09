import * as Boom from '@hapi/boom';
import * as Knex from 'knex';
import {UserDbProvider} from 'server/v1/db-provider/user';
import {dbManager} from 'server/lib/db-manager';
import {DbTable, ClientStatusCode} from 'server/types/consts';
import {DBTableUsers} from 'server/types/db/users';
import {logger} from 'server/lib/logger';

interface Params {
    email: string;
    verifiedCode: string;
}

interface User {
    id: DBTableUsers.Schema['id'];
    email: DBTableUsers.Schema['email'];
    verifiedCode: DBTableUsers.Schema['verified_code'];
    createdAt: DBTableUsers.Schema['created_at'];
    verified: DBTableUsers.Schema['verified'];
}

const knex = Knex({client: 'pg'});

export async function createUser(params: Params): Promise<User> {
    const existedUser = await UserDbProvider.getUserByEmail(params.email);
    if (existedUser) {
        throw Boom.badRequest(ClientStatusCode.USER_EMAIL_EXIST);
    }

    const query = knex(DbTable.USERS)
        .insert({
            email: params.email,
            verified_code: params.verifiedCode
        })
        .returning(['id', 'email', 'verified_code as verifiedCode', 'created_at as createdAt', 'verified']);

    const {
        rows: [user]
    } = await dbManager.executeModifyQuery(query.toString());

    if (!user) {
        logger.error(`[create user] user did not create: ${JSON.stringify(params)}`);
        throw Boom.badRequest();
    }

    return user;
}
