import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';
import {DBTableUsers} from 'server/types/db/users';

interface User {
    id: DBTableUsers.Schema['id'];
    email: DBTableUsers.Schema['email'];
    name: DBTableUsers.Schema['name'];
    contacts: DBTableUsers.Schema['contacts'];
    verifiedCode: DBTableUsers.Schema['verified_code'];
    createdAt: DBTableUsers.Schema['created_at'];
    updatedAt: DBTableUsers.Schema['updated_at'];
    verified: DBTableUsers.Schema['verified'];
    avatar: DBTableUsers.Schema['avatar'];
}

const knex = Knex({client: 'pg'});

export async function getUserByEmail(email: string): Promise<User | undefined> {
    const query = knex
        .select([
            knex.raw('id'),
            knex.raw('email'),
            knex.raw('name'),
            knex.raw('contacts'),
            knex.raw('verified_code as "verifiedCode"'),
            knex.raw('created_at as "createdAt"'),
            knex.raw('updated_at as "updatedAt"'),
            knex.raw('verified'),
            knex.raw('avatar')
        ])
        .from(DbTable.USERS)
        .where({email});

    const {
        rows: [row]
    } = await dbManager.executeReadQuery(query.toString());
    return row;
}

export async function getUserById(id: number): Promise<User | undefined> {
    const query = knex
        .select([
            knex.raw('id'),
            knex.raw('email'),
            knex.raw('name'),
            knex.raw('contacts'),
            knex.raw('verified_code as "verifiedCode"'),
            knex.raw('created_at as "createdAt"'),
            knex.raw('updated_at as "updatedAt"'),
            knex.raw('verified'),
            knex.raw('avatar')
        ])
        .from(DbTable.USERS)
        .where({id});

    const {
        rows: [row]
    } = await dbManager.executeReadQuery(query.toString());
    return row;
}
