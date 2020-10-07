import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';
import {DBTableAnimalAd} from 'server/types/db/animal-ad';
import {DBTableAnimalBreed} from 'server/types/db/animal-breed';
import {DBTableCity} from 'server/types/db/city';
import {DBTableAnimalCategory} from 'server/types/db/animal-category';

interface AnimalAd {
    publicId: DBTableAnimalAd.Schema['public_id'];
    cost: DBTableAnimalAd.Schema['cost'];
    sex: DBTableAnimalAd.Schema['sex'];
    title: DBTableAnimalAd.Schema['title'];
    description: DBTableAnimalAd.Schema['description'];
    address: DBTableAnimalAd.Schema['address'];
    documents: DBTableAnimalAd.Schema['documents'];
    viewsCount: DBTableAnimalAd.Schema['views_count'];
    createdAt: DBTableAnimalAd.Schema['created_at'];
    updatedAt: DBTableAnimalAd.Schema['updated_at'];
    animalBreedDisplayName: DBTableAnimalBreed.Schema['display_name'];
    cityDisplayName: DBTableCity.Schema['display_name'];
    animalCategoryDisplayName: DBTableAnimalCategory.Schema['display_name'];
    imageUrls: string[];
}

const knex = Knex({client: 'pg'});

export async function getAnimalAdByOwnerId(ownerId: number): Promise<AnimalAd[]> {
    const query = knex(DbTable.ANIMAL_AD)
        .select([
            knex.raw(`${DbTable.ANIMAL_AD}.public_id as "publicId"`),
            knex.raw(`${DbTable.ANIMAL_AD}.cost as cost`),
            knex.raw(`${DbTable.ANIMAL_AD}.sex as sex`),
            knex.raw(`${DbTable.ANIMAL_AD}.title as title`),
            knex.raw(`${DbTable.ANIMAL_AD}.description as description`),
            knex.raw(`${DbTable.ANIMAL_AD}.address as address`),
            knex.raw(`${DbTable.ANIMAL_AD}.documents as documents`),
            knex.raw(`${DbTable.ANIMAL_AD}.views_count as "viewsCount"`),
            knex.raw(`${DbTable.ANIMAL_AD}.created_at as "createdAt"`),
            knex.raw(`${DbTable.ANIMAL_AD}.updated_at as "updatedAt"`),
            knex.raw(`${DbTable.ANIMAL_BREED}.display_name as "animalBreedDisplayName"`),
            knex.raw(`${DbTable.CITY}.display_name as "cityDisplayName"`),
            knex.raw(`${DbTable.ANIMAL_CATEGORY}.display_name as "animalCategoryDisplayName"`),
            knex.raw(`coalesce(array_agg(${DbTable.ANIMAL_AD_GALLARY}.url), ARRAY[]::text[]) as "imageUrls"`)
        ])
        .join(DbTable.ANIMAL_BREED, `${DbTable.ANIMAL_BREED}.id`, `${DbTable.ANIMAL_AD}.animal_breed_id`)
        .join(DbTable.ANIMAL_CATEGORY, `${DbTable.ANIMAL_CATEGORY}.id`, `${DbTable.ANIMAL_BREED}.animal_category_id`)
        .join(DbTable.CITY, `${DbTable.CITY}.id`, `${DbTable.ANIMAL_AD}.city_id`)
        .leftJoin(DbTable.ANIMAL_AD_GALLARY, `${DbTable.ANIMAL_AD}.id`, `${DbTable.ANIMAL_AD_GALLARY}.animal_ad_id`)
        .where({
            owner_id: ownerId
        })
        .groupByRaw(
            `${DbTable.ANIMAL_AD}.id, ${DbTable.ANIMAL_BREED}.id, ${DbTable.ANIMAL_CATEGORY}.id, ${DbTable.CITY}.id`
        )
        .orderBy('updatedAt', 'desc');

    const {rows} = await dbManager.executeModifyQuery(query.toString());
    return rows;
}
