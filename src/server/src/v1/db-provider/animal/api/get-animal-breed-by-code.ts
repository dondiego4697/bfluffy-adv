import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';
import {DBTableAnimalBreed} from 'server/types/db/animal-breed';

interface AnimalBreed {
    id: DBTableAnimalBreed.Schema['id'];
    code: DBTableAnimalBreed.Schema['code'];
    displayName: DBTableAnimalBreed.Schema['display_name'];
}

const knex = Knex({client: 'pg'});

export async function getAnimalBreedByCode(code: string): Promise<AnimalBreed | undefined> {
    const query = knex(DbTable.ANIMAL_BREED)
        .select([
            knex.raw(`${DbTable.ANIMAL_BREED}.id`),
            knex.raw(`${DbTable.ANIMAL_BREED}.code`),
            knex.raw(`${DbTable.ANIMAL_BREED}.display_name as "displayName"`)
        ])
        .where({code});

    const {
        rows: [row]
    } = await dbManager.executeReadQuery(query.toString());
    return row;
}
