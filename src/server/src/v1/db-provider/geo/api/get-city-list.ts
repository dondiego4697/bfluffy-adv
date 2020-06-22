import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';
import {DBTableCity} from 'server/types/db/city';
import {DBTableRegion} from 'server/types/db/region';

interface City {
    cityCode: DBTableCity.Schema['code'];
    cityDisplayName: DBTableCity.Schema['display_name'];
    regionCode: DBTableRegion.Schema['code'];
    regionDisplayName: DBTableRegion.Schema['display_name'];
}

const knex = Knex({client: 'pg'});

export async function getCityList(): Promise<City[]> {
	const query = knex(DbTable.CITY)
		.select([
			knex.raw(`${DbTable.CITY}.code as "cityCode"`),
			knex.raw(`${DbTable.CITY}.display_name as "cityDisplayName"`),
			knex.raw(`${DbTable.REGION}.code as "regionCode"`),
			knex.raw(`${DbTable.REGION}.display_name as "regionDisplayName"`)
		])
		.innerJoin(
			DbTable.REGION,
			`${DbTable.REGION}.id`,
			`${DbTable.CITY}.region_id`
		);

	const {rows} = await dbManager.executeReadQuery(query.toString());
	return rows;
}
