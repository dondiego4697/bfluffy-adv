import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';

const knex = Knex({client: 'pg'});

export async function getAnimalAdImages(adId: number): Promise<string[]> {
    const query = knex(DbTable.ANIMAL_AD_GALLARY)
        .select({
            url: `${DbTable.ANIMAL_AD_GALLARY}.url`
        })
        .where({
            animal_ad_id: adId
        });

    const {rows} = await dbManager.executeModifyQuery(query.toString());
    return rows.map((row) => row.url);
}
