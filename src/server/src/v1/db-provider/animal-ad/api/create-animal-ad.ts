import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';
import {DBTableAnimalAd} from 'server/types/db/animal-ad';

interface Params {
    name: string;
    description: string;
    isBasicVaccinations: boolean;
    cost: number;
    sex: boolean;
    animalBreedId: number;
    ownerId: number;
    address?: string;
    documents: DBTableAnimalAd.FieldDocuments;
}

interface Response {
    id: number;
    publicId: string;
}

const knex = Knex({client: 'pg'});

export async function createAnimalAd(params: Params): Promise<Response> {
    const {name, description, address, documents, isBasicVaccinations, sex, cost, animalBreedId, ownerId} = params;

    const query = knex(DbTable.ANIMAL_AD)
        .insert({
            name,
            description,
            is_basic_vaccinations: isBasicVaccinations,
            sex,
            cost,
            owner_id: ownerId,
            animal_breed_id: animalBreedId,
            documents: JSON.stringify(documents),
            address
        })
        .returning(['id', 'public_id as publicId']);

    const {
        rows: [row]
    } = await dbManager.executeModifyQuery(query.toString());
    return row;
}
