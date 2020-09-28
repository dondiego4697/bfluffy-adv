import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';
import {DBTableAnimalAd} from 'server/types/db/animal-ad';
import {DBTableAnimalBreed} from 'server/types/db/animal-breed';
import {DBTableCity} from 'server/types/db/city';
import {DBTableAnimalCategory} from 'server/types/db/animal-category';

interface AnimalAd {
    id: DBTableAnimalAd.Schema['id'];
    ownerId: DBTableAnimalAd.Schema['owner_id'];
    publicId: DBTableAnimalAd.Schema['public_id'];
    cost: DBTableAnimalAd.Schema['cost'];
    sex: DBTableAnimalAd.Schema['sex'];
    name: DBTableAnimalAd.Schema['name'];
    description: DBTableAnimalAd.Schema['description'];
    address: DBTableAnimalAd.Schema['address'];
    documents: DBTableAnimalAd.Schema['documents'];
    viewsCount: DBTableAnimalAd.Schema['views_count'];
    createdAt: DBTableAnimalAd.Schema['created_at'];
    updatedAt: DBTableAnimalAd.Schema['updated_at'];
    animalBreedCode: DBTableAnimalBreed.Schema['code'];
    animalBreedDisplayName: DBTableAnimalBreed.Schema['display_name'];
    cityCode: DBTableCity.Schema['code'];
    cityDisplayName: DBTableCity.Schema['display_name'];
    animalCategoryCode: DBTableAnimalCategory.Schema['code'];
    animalCategoryDisplayName: DBTableAnimalCategory.Schema['display_name'];
}

const knex = Knex({client: 'pg'});

export async function getAnimalAdByPublicId(publicId: string): Promise<AnimalAd | undefined> {
    const query = knex(DbTable.ANIMAL_AD)
        .select({
            id: `${DbTable.ANIMAL_AD}.id`,
            ownerId: `${DbTable.ANIMAL_AD}.owner_id`,
            publicId: `${DbTable.ANIMAL_AD}.public_id`,
            cost: `${DbTable.ANIMAL_AD}.cost`,
            sex: `${DbTable.ANIMAL_AD}.sex`,
            name: `${DbTable.ANIMAL_AD}.name`,
            description: `${DbTable.ANIMAL_AD}.description`,
            address: `${DbTable.ANIMAL_AD}.address`,
            documents: `${DbTable.ANIMAL_AD}.documents`,
            viewsCount: `${DbTable.ANIMAL_AD}.views_count`,
            createdAt: `${DbTable.ANIMAL_AD}.created_at`,
            updatedAt: `${DbTable.ANIMAL_AD}.updated_at`,
            animalBreedCode: `${DbTable.ANIMAL_BREED}.code`,
            animalBreedDisplayName: `${DbTable.ANIMAL_BREED}.display_name`,
            cityCode: `${DbTable.CITY}.code`,
            cityDisplayName: `${DbTable.CITY}.display_name`,
            animalCategoryCode: `${DbTable.ANIMAL_CATEGORY}.code`,
            animalCategoryDisplayName: `${DbTable.ANIMAL_CATEGORY}.display_name`
        })
        .join(DbTable.ANIMAL_BREED, `${DbTable.ANIMAL_BREED}.id`, `${DbTable.ANIMAL_AD}.animal_breed_id`)
        .join(DbTable.ANIMAL_CATEGORY, `${DbTable.ANIMAL_CATEGORY}.id`, `${DbTable.ANIMAL_BREED}.animal_category_id`)
        .join(DbTable.CITY, `${DbTable.CITY}.id`, `${DbTable.ANIMAL_AD}.city_id`)
        .where({
            public_id: publicId
        });

    const {
        rows: [row]
    } = await dbManager.executeModifyQuery(query.toString());
    return row;
}
