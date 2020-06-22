import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';
import {DBTableAnimalCategory} from 'server/types/db/animal-category';

interface AnimalCategory {
    code: DBTableAnimalCategory.Schema['code'];
    displayName: DBTableAnimalCategory.Schema['display_name'];
}

const knex = Knex({client: 'pg'});

export async function getAnimalCategoryList(): Promise<AnimalCategory[]> {
	const query = knex(DbTable.ANIMAL_CATEGORY)
		.select([
			knex.raw('code'),
			knex.raw('display_name as "displayName"')
		]);

	const {rows} = await dbManager.executeReadQuery(query.toString());
	return rows;
}
