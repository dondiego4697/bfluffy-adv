import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';
import {DBTableAnimalBreed} from 'server/types/db/animal-breed';
import {DBTableAnimalCategory} from 'server/types/db/animal-category';

interface AnimalBreed {
    breedCode: DBTableAnimalBreed.Schema['code'];
    breedDisplayName: DBTableAnimalBreed.Schema['display_name'];
    categoryCode: DBTableAnimalCategory.Schema['code'];
    categoryDisplayName: DBTableAnimalCategory.Schema['display_name'];
}

const knex = Knex({client: 'pg'});

export async function getAnimalBreedList(): Promise<AnimalBreed[]> {
	const query = knex(DbTable.ANIMAL_BREED)
		.select([
			knex.raw(`${DbTable.ANIMAL_BREED}.code as "breedCode"`),
			knex.raw(`${DbTable.ANIMAL_BREED}.display_name as "breedDisplayName"`),
			knex.raw(`${DbTable.ANIMAL_CATEGORY}.code as "categoryCode"`),
			knex.raw(`${DbTable.ANIMAL_CATEGORY}.display_name as "categoryDisplayName"`)
		])
		.innerJoin(
			DbTable.ANIMAL_CATEGORY,
			`${DbTable.ANIMAL_CATEGORY}.id`,
			`${DbTable.ANIMAL_BREED}.animal_category_id`
		)
		.orderBy([`${DbTable.ANIMAL_CATEGORY}.id`, `${DbTable.ANIMAL_BREED}.id`]);

	const {rows} = await dbManager.executeReadQuery(query.toString());
	return rows;
}
