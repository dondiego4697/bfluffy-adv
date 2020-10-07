import got from 'got';
import * as http from 'http';
import * as nock from 'nock';
import * as moment from 'moment';
import {app} from 'server/app';
import {TestDb} from 'tests/test-db';
import {startServer, stopServer} from 'tests/test-server';
import {TestFactory} from 'tests/test-factory';
import {AuthToken} from 'server/lib/auth-token';

const BASE_USER = {
    email: 'test@mail.ru',
    verifiedCode: 'code'
};

const AUTH_TOKEN = AuthToken.encode(BASE_USER);

const client = got.extend({
    throwHttpErrors: false,
    retry: 0,
    timeout: 2000,
    responseType: 'json',
    headers: {
        cookie: `auth_token=${AUTH_TOKEN}`
    }
});

const REQUEST_PATH = '/api/v1/private/animal_ad/list';

describe(REQUEST_PATH, () => {
    let server: http.Server;
    let url: string;

    beforeAll(async () => {
        [server, url] = await startServer(app);
        nock.disableNetConnect();
        nock.enableNetConnect(/localhost/);
    });

    afterAll(async () => {
        await stopServer(server);
        nock.enableNetConnect();
    });

    beforeEach(async () => {
        await TestDb.clean();
        await TestFactory.createUser(BASE_USER);
        await TestFactory.createUser({
            ...BASE_USER,
            email: 'smth@mail.ru'
        });
    });

    it('should return animal ad list', async () => {
        const region = await TestFactory.createRegion();
        const city = await TestFactory.createCity(region.id);

        const animalCategory = await TestFactory.createAnimaCategory();
        const animalBreed = await TestFactory.createAnimalBreed(animalCategory.id);
        const animalAd = await TestFactory.createAnimalAd({
            ownerId: 1,
            breedId: animalBreed.id,
            cityId: city.id
        });

        const urls = ['url1', 'url2', 'url3'];
        await TestFactory.createAnimalAdImages({
            animalAdId: animalAd.id,
            urls
        });

        const {body, statusCode} = await client.get<any>(`${url}${REQUEST_PATH}`);

        expect(statusCode).toEqual(200);
        expect(body).toEqual([
            {
                publicId: animalAd.publicId,
                cost: animalAd.cost,
                sex: animalAd.sex,
                title: animalAd.title,
                description: animalAd.description,
                address: animalAd.address,
                animalBreedDisplayName: animalBreed.displayName,
                animalCategoryDisplayName: animalCategory.displayName,
                cityDisplayName: city.displayName,
                documents: animalAd.documents,
                imageUrls: urls,
                createdAt: animalAd.createdAt.toISOString(),
                updatedAt: moment(animalAd.updatedAt).startOf('day').fromNow(),
                viewsCount: animalAd.viewsCount
            }
        ]);
    });

    it("should return only author's ads", async () => {
        const region = await TestFactory.createRegion();
        const city = await TestFactory.createCity(region.id);

        const animalCategory = await TestFactory.createAnimaCategory();
        const animalBreed = await TestFactory.createAnimalBreed(animalCategory.id);
        const animalAd = await TestFactory.createAnimalAd({
            ownerId: 2,
            breedId: animalBreed.id,
            cityId: city.id
        });

        const urls = ['url1', 'url2', 'url3'];
        await TestFactory.createAnimalAdImages({
            animalAdId: animalAd.id,
            urls
        });

        const {body, statusCode} = await client.get<any>(`${url}${REQUEST_PATH}`);

        expect(statusCode).toEqual(200);
        expect(body).toEqual([]);
    });
});
