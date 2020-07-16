import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable, FarmType} from 'server/types/consts';
import {DBTableFarm} from 'server/types/db/farm';

interface Params {
    cityId: number;
	contacts: DBTableFarm.FieldContacts;
	name: string;
	description?: string;
	address: string;
	type: FarmType;
}

const knex = Knex({client: 'pg'});

export async function updateFarm(publicId: string, params: Params): Promise<void> {
	const {
		cityId, contacts, name,
		description, address, type
	} = params;

	const query = knex(DbTable.FARM)
		.update({
			city_id: cityId,
			contacts: JSON.stringify(contacts),
			name,
			type,
			description,
			address
		})
		.where({
			public_id: publicId
		});

	await dbManager.executeModifyQuery(query.toString());
}
