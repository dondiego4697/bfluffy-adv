import got from 'got';
import * as http from 'http';
import * as nock from 'nock';
import {omit} from 'lodash';
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

const REQUEST_PATH = '/api/v1/private/animal_ad/create';

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

    it('should create animal ad', async () => {
        const region = await TestFactory.createRegion();
        const city = await TestFactory.createCity(region.id);

        const animalCategory = await TestFactory.createAnimaCategory();
        const animalBreed = await TestFactory.createAnimalBreed(animalCategory.id);

        const imageUrls = ['url1', 'url2', 'url3'];
        const {body, statusCode} = await client.post<any>(`${url}${REQUEST_PATH}`, {
            json: {
                name: 'animal ad name',
                cost: 1.2,
                sex: {
                    male: true,
                    female: true
                },
                ageMonths: 10,
                address: 'address',
                animalBreedCode: animalBreed.code,
                cityCode: city.code,
                documents: {
                    genericMark: true
                },
                imageUrls
            }
        });

        expect(statusCode).toEqual(200);

        const animalAds = await TestFactory.getAllAnimalAds();
        const animalAd = animalAds.find((item) => item.publicId === body.publicId);

        expect(omit(animalAd, ['createdAt', 'updatedAt'])).toEqual({
            animalBreedId: animalBreed.id,
            cost: 1.2,
            description: null,
            name: 'animal ad name',
            address: 'address',
            id: 1,
            isArchive: false,
            isBasicVaccinations: false,
            ownerId: 1,
            publicId: body.publicId,
            sex: {
                male: true,
                female: true
            },
            ageMonths: 10,
            viewsCount: 0,
            documents: {
                genericMark: true
            },
            imageUrls
        });
    });
});
