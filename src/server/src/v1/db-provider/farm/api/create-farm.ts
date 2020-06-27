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

type PublicId = string;

const knex = Knex({client: 'pg'});

export async function createFarm(params: Params): Promise<PublicId> {
	const {
		cityId, ownerId, contacts, name, description, address
	} = params;

	const query = knex(DbTable.FARM)
		.insert({
			city_id: cityId,
			owner_id: ownerId,
			contacts: JSON.stringify(contacts),
			name,
			description,
			address
		})
		.returning('public_id as publicId');

	const {rows: [row]} = await dbManager.executeModifyQuery(query.toString());
	return row.publicId;
}
