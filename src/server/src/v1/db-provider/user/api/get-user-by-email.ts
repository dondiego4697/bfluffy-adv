import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';
import {DBTableUsers} from 'server/types/db/users';

interface User {
    id: DBTableUsers.Schema['id'];
}

const knex = Knex({client: 'pg'});

export async function getUserByEmail(email: string): Promise<User | undefined> {
	const query = knex
		.select([
			knex.raw('id')
		])
		.from(DbTable.USERS)
		.where({email});

	const {rows} = await dbManager.executeReadQuery(query.toString());
	return rows[0];
}
