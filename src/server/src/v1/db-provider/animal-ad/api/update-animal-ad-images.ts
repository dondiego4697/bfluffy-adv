import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';

interface Params {
    animalAdId: number;
    forDeleteUrls: string[];
    forInsertUrls: string[];
}

const knex = Knex({client: 'pg'});

export async function updateAnimalAdImages(params: Params): Promise<void> {
    const {animalAdId, forDeleteUrls, forInsertUrls} = params;

    const deleteQuery = knex(DbTable.ANIMAL_AD_GALLARY)
        .whereIn('url', forDeleteUrls)
        .andWhere({
            animal_ad_id: animalAdId
        })
        .del();

    const insertQuery = knex(DbTable.ANIMAL_AD_GALLARY).insert(
        forInsertUrls.map((url) => ({
            animal_ad_id: animalAdId,
            url
        }))
    );

    await dbManager.executeInTransaction(async (client) => {
        await client.query(deleteQuery.toString());
        await client.query(insertQuery.toString());
    });
}
