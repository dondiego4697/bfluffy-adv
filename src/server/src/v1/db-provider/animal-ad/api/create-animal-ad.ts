import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';
import {DBTableAnimalAd} from 'server/types/db/animal-ad';

interface Params {
    title: string;
    description: string;
    isBasicVaccinations: boolean;
    cost: number;
    sex: DBTableAnimalAd.FieldSex;
    animalBreedId: number;
    ownerId: number;
    cityId: number;
    address?: string;
    birthday?: Date;
    documents: DBTableAnimalAd.FieldDocuments;
}

interface Response {
    id: number;
    publicId: string;
}

const knex = Knex({client: 'pg'});

export async function createAnimalAd(params: Params): Promise<Response> {
    const {
        title,
        description,
        address,
        documents,
        cityId,
        isBasicVaccinations,
        sex,
        cost,
        animalBreedId,
        ownerId,
        birthday
    } = params;

    const query = knex(DbTable.ANIMAL_AD)
        .insert({
            title,
            description,
            birthday,
            is_basic_vaccinations: isBasicVaccinations,
            sex: JSON.stringify(sex),
            cost,
            owner_id: ownerId,
            city_id: cityId,
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
