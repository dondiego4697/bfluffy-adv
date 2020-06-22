import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';
import {DBTableAnimalBreed} from 'server/types/db/animal-breed';

interface AnimalBreed {
    code: DBTableAnimalBreed.Schema['code'];
    displayName: DBTableAnimalBreed.Schema['display_name'];
}

const knex = Knex({client: 'pg'});

export async function getAnimalBreedList(categoryCode: string): Promise<AnimalBreed[]> {
	const query = knex(DbTable.ANIMAL_BREED)
		.select([
			knex.raw(`${DbTable.ANIMAL_BREED}.code`),
			knex.raw(`${DbTable.ANIMAL_BREED}.display_name as "displayName"`)
		])
		.innerJoin(
			DbTable.ANIMAL_CATEGORY,
			`${DbTable.ANIMAL_CATEGORY}.id`,
			`${DbTable.ANIMAL_BREED}.animal_category_id`
		)
		.whereRaw(`${DbTable.ANIMAL_CATEGORY}.code = ?`, [categoryCode]);

	const {rows} = await dbManager.executeReadQuery(query.toString());
	return rows;
}
