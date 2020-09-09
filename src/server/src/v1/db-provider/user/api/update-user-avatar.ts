import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';

interface Params {
    avatar: string;
    userId: number;
}

const knex = Knex({client: 'pg'});

export async function updateUserAvatar(params: Params): Promise<void> {
    const {avatar, userId} = params;

    const query = knex(DbTable.USERS).update({avatar}).where({id: userId});

    await dbManager.executeModifyQuery(query.toString());
}
