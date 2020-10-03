import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';
import {DBTableAnimalAd} from 'server/types/db/animal-ad';

interface Params {
    name: string;
    description: string;
    isBasicVaccinations: boolean;
    cost: number;
    sex: DBTableAnimalAd.FieldSex;
    animalBreedId: number;
    cityId: number;
    address?: string;
    ageMonths?: number;
    documents: DBTableAnimalAd.FieldDocuments;
}

const knex = Knex({client: 'pg'});

export async function updateAnimalAd(publicId: string, params: Params) {
    const {
        name, description, address, documents, cityId,
        isBasicVaccinations, sex, cost, animalBreedId, ageMonths
    } = params;

    const query = knex(DbTable.ANIMAL_AD)
        .update({
            name,
            description,
            age_months: ageMonths,
            is_basic_vaccinations: isBasicVaccinations,
            sex: JSON.stringify(sex),
            cost,
            animal_breed_id: animalBreedId,
            city_id: cityId,
            documents: JSON.stringify(documents),
            address
        })
        .where({
            public_id: publicId
        });

    await dbManager.executeModifyQuery(query.toString());
}
