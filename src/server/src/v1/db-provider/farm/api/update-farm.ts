import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';
import {DBTableFarm} from 'server/types/db/farm';

interface Params {
    cityId: number;
    ownerId: number;
	contacts: DBTableFarm.FieldContacts;
	name: string;
	description?: string;
	address: string;
}

const knex = Knex({client: 'pg'});

export async function updateFarm(publicId: string, params: Params): Promise<void> {
	const {
		cityId, ownerId, contacts, name, description, address
	} = params;

	const query = knex(DbTable.FARM)
		.update({
			city_id: cityId,
			owner_id: ownerId,
			contacts: JSON.stringify(contacts),
			name,
			description,
			address
		})
		.where({
			public_id: publicId
		});

	await dbManager.executeModifyQuery(query.toString());
}
