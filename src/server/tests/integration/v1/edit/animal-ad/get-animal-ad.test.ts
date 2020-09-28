import got from 'got';
import * as http from 'http';
import * as nock from 'nock';
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

const REQUEST_PATH = '/api/v1/edit/animal_ad/info';

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
    });

    it('should get animal ad info', async () => {
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

        const {body, statusCode} = await client.get<any>(`${url}${REQUEST_PATH}`, {
            searchParams: {
                publicId: animalAd.publicId
            }
        });

        expect(statusCode).toEqual(200);
        expect(body).toEqual({
            cost: animalAd.cost,
            sex: animalAd.sex,
            name: animalAd.name,
            description: animalAd.description,
            address: animalAd.address,
            animalBreedCode: animalBreed.code,
            animalCategoryCode: animalCategory.code,
            cityCode: city.code,
            documents: animalAd.documents,
            imageUrls: urls
        });
    });
});
