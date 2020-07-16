import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable, FarmType} from 'server/types/consts';
import {DBTableFarm} from 'server/types/db/farm';

interface Params {
	cityId: number;
	type: FarmType;
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
		cityId, ownerId, contacts,
		name, description, address,
		type
	} = params;

	const query = knex(DbTable.FARM)
		.insert({
			city_id: cityId,
			owner_id: ownerId,
			contacts: JSON.stringify(contacts),
			type,
			name,
			description,
			address
		})
		.returning('public_id as publicId');

	const {rows: [row]} = await dbManager.executeModifyQuery(query.toString());
	return row.publicId;
}
