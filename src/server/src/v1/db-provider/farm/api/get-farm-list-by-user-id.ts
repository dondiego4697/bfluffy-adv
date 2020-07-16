import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';
import {DBTableFarm} from 'server/types/db/farm';
import {DBTableCity} from 'server/types/db/city';

interface Farm {
	id: DBTableFarm.Schema['id'];
	contacts: DBTableFarm.FieldContacts;
	name: DBTableFarm.Schema['name'];
	type: DBTableFarm.Schema['type'];
	description: DBTableFarm.Schema['description'];
	address: DBTableFarm.Schema['address'];
	rating: DBTableFarm.Schema['rating'];
	createdAt: DBTableFarm.Schema['created_at'];
	updatedAt: DBTableFarm.Schema['updated_at'];
	farmPublicId: DBTableFarm.Schema['public_id'];
	cityCode: DBTableCity.Schema['code'];
}

interface Params {
	isArchive?: boolean;
}

const knex = Knex({client: 'pg'});

export async function getFarmListByUserId(userId: number, params: Params = {}): Promise<Farm[]> {
	const query = knex(DbTable.FARM)
		.select({
			id: `${DbTable.FARM}.id`,
			contacts: `${DbTable.FARM}.contacts`,
			name: `${DbTable.FARM}.name`,
			type: `${DbTable.FARM}.type`,
			description: `${DbTable.FARM}.description`,
			address: `${DbTable.FARM}.address`,
			rating: `${DbTable.FARM}.rating`,
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
			owner_id: userId,
			is_archive: params.isArchive || false
		})
		.orderBy('updated_at', 'desc');

	const {rows} = await dbManager.executeModifyQuery(query.toString());
	return rows;
}
