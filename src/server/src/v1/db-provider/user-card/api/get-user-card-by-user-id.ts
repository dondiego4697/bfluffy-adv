import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';
import {DBTableUserCard} from 'server/types/db/user-card';
import {DBTableCity} from 'server/types/db/city';

interface UserCard {
	publicId: DBTableUserCard.Schema['public_id'];
	contacts: DBTableUserCard.FieldContacts;
	name: DBTableUserCard.Schema['name'];
	description: DBTableUserCard.Schema['description'];
	address: DBTableUserCard.Schema['address'];
	type: DBTableUserCard.Schema['type'];
	createdAt: DBTableUserCard.Schema['created_at'];
	updatedAt: DBTableUserCard.Schema['updated_at'];
	cityCode: DBTableCity.Schema['code'];
	cityDisplayName: DBTableCity.Schema['display_name'];
}

const knex = Knex({client: 'pg'});

export async function getUserCardByUserId(userId: number): Promise<UserCard | undefined> {
	const query = knex(DbTable.USER_CARD)
		.select({
			publicId: `${DbTable.USER_CARD}.public_id`,
			contacts: `${DbTable.USER_CARD}.contacts`,
			name: `${DbTable.USER_CARD}.name`,
			description: `${DbTable.USER_CARD}.description`,
			address: `${DbTable.USER_CARD}.address`,
			type: `${DbTable.USER_CARD}.type`,
			createdAt: `${DbTable.USER_CARD}.created_at`,
			updatedAt: `${DbTable.USER_CARD}.updated_at`,
			cityCode: `${DbTable.CITY}.code`,
			cityDisplayName: `${DbTable.CITY}.display_name`
		})
		.join(
			DbTable.CITY,
			`${DbTable.CITY}.id`,
			`${DbTable.USER_CARD}.city_id`
		)
		.where({
			user_id: userId
		});

	const {rows: [row]} = await dbManager.executeModifyQuery(query.toString());
	return row;
}
