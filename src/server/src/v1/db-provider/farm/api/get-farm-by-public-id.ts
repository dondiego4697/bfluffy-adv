import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';
import {DBTableFarm} from 'server/types/db/farm';

interface Farm {
    id: DBTableFarm.Schema['id'];
}

const knex = Knex({client: 'pg'});

export async function getFarmByPublicId(publicId: string): Promise<Farm | undefined> {
	const query = knex(DbTable.FARM)
		.select({
			id: 'id'
		})
		.where({
			public_id: publicId
		});

	const {rows: [row]} = await dbManager.executeModifyQuery(query.toString());
	return row;
}
