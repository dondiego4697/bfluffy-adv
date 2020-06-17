import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';

const knex = Knex({client: 'pg'});

export async function verifiedUser(email: string): Promise<void> {
	const query = knex(DbTable.USERS)
		.update({verified: true})
		.where({email});

	await dbManager.executeModifyQuery(query.toString());
}
