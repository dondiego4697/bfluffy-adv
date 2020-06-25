import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';

const knex = Knex({client: 'pg'});

export async function archiveFarm(publicId: string): Promise<void> {
	const query = knex(DbTable.FARM)
		.update({
			archive: true
		})
		.where({
			public_id: publicId
		});

	await dbManager.executeModifyQuery(query.toString());
}
