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
    address?: string;
    documents: DBTableAnimalAd.FieldDocuments;
}

const knex = Knex({client: 'pg'});

export async function updateAnimalAd(publicId: string, params: Params) {
    const {name, description, address, documents, isBasicVaccinations, sex, cost, animalBreedId} = params;

    const query = knex(DbTable.ANIMAL_AD)
        .update({
            name,
            description,
            is_basic_vaccinations: isBasicVaccinations,
            sex,
            cost,
            animal_breed_id: animalBreedId,
            documents: JSON.stringify(documents),
            address
        })
        .where({
            public_id: publicId
        });

    await dbManager.executeModifyQuery(query.toString());
}
