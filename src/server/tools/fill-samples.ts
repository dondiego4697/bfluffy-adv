import * as dotenv from 'dotenv';

dotenv.config();

import * as Knex from 'knex';
import * as path from 'path';
import * as fs from 'fs';
import * as slugify from '@sindresorhus/slugify';
import {groupBy} from 'lodash';
import {dbManager} from 'server/lib/db-manager';
import {logger} from 'server/lib/logger';
import {DbTable} from 'server/types/consts';

interface CityItem {
    city: string;
    region: string;
}

const knex = Knex({client: 'pg'});

async function fillSamples() {
    const catsBreeds = JSON.parse(fs.readFileSync(path.resolve('src/resources/db/catalog/cats-breeds.json'), 'utf-8'));
    const dogsBreeds = JSON.parse(fs.readFileSync(path.resolve('src/resources/db/catalog/dogs-breeds.json'), 'utf-8'));
    const cities = JSON.parse(fs.readFileSync(path.resolve('src/resources/db/catalog/cities.json'), 'utf-8'));

    await fillCatsBreeds(catsBreeds);
    await fillDogsBreeds(dogsBreeds);
    await fillCities(cities);
}

async function getCategoryId(code: string): Promise<string | undefined> {
    const query = knex.select('id').from(DbTable.ANIMAL_CATEGORY).where({code});
    const {
        rows: [row]
    } = await dbManager.executeReadQuery(query.toString());
    return row && row.id;
}

async function getRegionId(code: string): Promise<string | undefined> {
    const query = knex.select('id').from(DbTable.REGION).where({code});
    const {
        rows: [row]
    } = await dbManager.executeReadQuery(query.toString());
    return row && row.id;
}

async function fillCatsBreeds(items: string[]) {
    const query = knex.raw('? ON CONFLICT DO NOTHING RETURNING id', [
        knex(DbTable.ANIMAL_CATEGORY).insert({
            code: 'cats',
            display_name: 'Кошки'
        })
    ]);

    const {
        rows: [row]
    } = await dbManager.executeModifyQuery(query.toString());
    const categoryId = (row && row.id) || (await getCategoryId('cats'));

    for (const item of items) {
        const query = knex.raw('? ON CONFLICT DO NOTHING', [
            knex(DbTable.ANIMAL_BREED).insert({
                code: slugify(item),
                display_name: item,
                animal_category_id: categoryId
            })
        ]);

        await dbManager.executeModifyQuery(query.toString());
        logger.info(`[cats] insert ${item}`);
    }
}

async function fillDogsBreeds(items: string[]) {
    const query = knex.raw('? ON CONFLICT DO NOTHING RETURNING id', [
        knex(DbTable.ANIMAL_CATEGORY).insert({
            code: 'dogs',
            display_name: 'Собаки'
        })
    ]);

    const {
        rows: [row]
    } = await dbManager.executeModifyQuery(query.toString());
    const categoryId = (row && row.id) || (await getCategoryId('dogs'));

    for (const item of items) {
        const query = knex.raw('? ON CONFLICT DO NOTHING', [
            knex(DbTable.ANIMAL_BREED).insert({
                code: slugify(item),
                display_name: item,
                animal_category_id: categoryId
            })
        ]);

        await dbManager.executeModifyQuery(query.toString());
        logger.info(`[dogs] insert ${item}`);
    }
}

async function fillCities(cities: CityItem[]) {
    const groups = groupBy(cities, (item) => item.region);

    for (const [regionName, cities] of Object.entries(groups)) {
        const query = knex.raw('? ON CONFLICT DO NOTHING RETURNING id', [
            knex(DbTable.REGION).insert({
                code: slugify(regionName),
                display_name: regionName
            })
        ]);

        const {
            rows: [row]
        } = await dbManager.executeModifyQuery(query.toString());
        const regionId = (row && row.id) || (await getRegionId(slugify(regionName)));

        for (const city of cities) {
            const query = knex.raw('? ON CONFLICT DO NOTHING', [
                knex(DbTable.CITY).insert({
                    code: slugify(city.city),
                    display_name: city.city,
                    region_id: regionId
                })
            ]);

            await dbManager.executeModifyQuery(query.toString());
            logger.info(`[${regionName}] insert ${city.city}`);
        }
    }
}

fillSamples()
    .then(() => logger.info('Samples was filled!'))
    .finally(() => dbManager.forceCloseConnection());
