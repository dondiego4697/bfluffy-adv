import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable, FarmType} from 'server/types/consts';
import {DBTableUserCard} from 'server/types/db/user-card';

interface Params {
	cityId: number;
	farmType: FarmType;
    userId: number;
	contacts: DBTableUserCard.FieldContacts;
	name: string;
	description?: string;
	address?: string;
}

type PublicId = string;

const knex = Knex({client: 'pg'});

export async function createUserCard(params: Params): Promise<PublicId> {
	const {
		cityId, userId, contacts,
		name, description, address,
		farmType
	} = params;

	const query = knex(DbTable.USER_CARD)
		.insert({
			city_id: cityId,
			user_id: userId,
			contacts: JSON.stringify(contacts),
			farm_type: farmType,
			name,
			description,
			address
		})
		.returning('public_id as publicId');

	const {rows: [row]} = await dbManager.executeModifyQuery(query.toString());
	return row.publicId;
}
