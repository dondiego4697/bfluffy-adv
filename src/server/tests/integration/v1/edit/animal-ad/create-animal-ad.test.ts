/* eslint-disable no-undef */
import got from 'got';
import * as http from 'http';
import * as nock from 'nock';
import {omit} from 'lodash';
import {app} from 'server/app';
import {TestDb} from 'tests/test-db';
import {startServer, stopServer} from 'tests/test-server';
import {TestFactory} from 'tests/test-factory';
import {AuthToken} from 'server/lib/auth-token';
import {SignUpType} from 'server/types/consts';

const BASE_USER = {
	email: 'test@mail.ru',
	password: 'password'
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

const REQUEST_PATH = '/api/v1/edit/animal_ad/create';

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
		await TestFactory.createUser({
			signUpType: SignUpType.EMAIL,
			...BASE_USER
		});
	});

	it('should create animal ad', async () => {
		const animalCategory = await TestFactory.createAnimaCategory();
		const animalBreed = await TestFactory.createAnimalBreed(animalCategory.id);

		const {body, statusCode} = await client.post<any>(
			`${url}${REQUEST_PATH}`,
			{
				json: {
					name: 'animal ad name',
					cost: 0.00,
					sex: true,
					animalBreedCode: animalBreed.code,
					documents: {
						genericMark: true
					}
				}
			}
		);

		expect(statusCode).toEqual(200);

		const animalAds = await TestFactory.getAllAnimalAds();
		const animalAd = animalAds.find((item) => item.publicId === body.publicId);

		expect(omit(animalAd, ['createdAt', 'updatedAt'])).toEqual({
			animalBreedId: animalBreed.id,
			cost: '0.00',
			description: null,
			name: 'animal ad name',
			id: 1,
			isArchive: false,
			isBasicVaccinations: false,
			ownerId: 1,
			publicId: body.publicId,
			sex: true,
			viewsCount: 0,
			documents: {
				genericMark: true
			}
		});
	});
});
