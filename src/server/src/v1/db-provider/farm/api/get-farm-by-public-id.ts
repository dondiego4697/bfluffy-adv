import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';
import {DBTableFarm} from 'server/types/db/farm';
import {DBTableCity} from 'server/types/db/city';
import {DBTableUsers} from 'server/types/db/users';

interface Farm {
	id: DBTableFarm.Schema['id'];
	contacts: DBTableFarm.FieldContacts;
	name: DBTableFarm.Schema['name'];
	description: DBTableFarm.Schema['description'];
	address: DBTableFarm.Schema['address'];
	rating: DBTableFarm.Schema['rating'];
	isArchive: DBTableFarm.Schema['is_archive'];
	createdAt: DBTableFarm.Schema['created_at'];
	updatedAt: DBTableFarm.Schema['updated_at'];
	farmPublicId: DBTableFarm.Schema['public_id'];
	ownerId: DBTableUsers.Schema['id'];
	cityCode: DBTableCity.Schema['code'];
}

const knex = Knex({client: 'pg'});

export async function getFarmByPublicId(publicId: string): Promise<Farm | undefined> {
	const query = knex(DbTable.FARM)
		.select({
			id: `${DbTable.FARM}.id`,
			contacts: `${DbTable.FARM}.contacts`,
			name: `${DbTable.FARM}.name`,
			description: `${DbTable.FARM}.description`,
			address: `${DbTable.FARM}.address`,
			rating: `${DbTable.FARM}.rating`,
			isArchive: `${DbTable.FARM}.is_archive`,
			createdAt: `${DbTable.FARM}.created_at`,
			updatedAt: `${DbTable.FARM}.updated_at`,
			farmPublicId: `${DbTable.FARM}.public_id`,
			ownerId: `${DbTable.FARM}.owner_id`,
			cityCode: `${DbTable.CITY}.code`
		})
		.join(
			DbTable.CITY,
			`${DbTable.CITY}.id`,
			`${DbTable.FARM}.city_id`
		)
		.where({
			public_id: publicId
		});

	const {rows: [row]} = await dbManager.executeModifyQuery(query.toString());
	return row;
}
