import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';
import {DBTableCity} from 'server/types/db/city';

interface City {
    id: DBTableCity.Schema['id'];
}

const knex = Knex({client: 'pg'});

export async function getCityByCityCode(cityCode: string): Promise<City | undefined> {
	const query = knex(DbTable.CITY)
		.select({
			id: 'id'
		})
		.where({
			code: cityCode
		});

	const {rows: [row]} = await dbManager.executeReadQuery(query.toString());
	return row;
}
