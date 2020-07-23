/* eslint-disable no-undef */
import got from 'got';
import * as http from 'http';
import * as nock from 'nock';
import {app} from 'server/app';
import {TestDb} from 'tests/test-db';
import {startServer, stopServer} from 'tests/test-server';
import {TestFactory} from 'tests/test-factory';

const client = got.extend({
	throwHttpErrors: false,
	retry: 0,
	timeout: 2000,
	responseType: 'json'
});

const REQUEST_PATH = '/api/v1/public/animal/breed_list';

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
	});

	it('should return correct breed list by categoty', async () => {
		const animalCategory1 = await TestFactory.createAnimaCategory();
		const animalCategory2 = await TestFactory.createAnimaCategory();

		const animalBreed1 = await TestFactory.createAnimalBreed(animalCategory1.id);
		const animalBreed2 = await TestFactory.createAnimalBreed(animalCategory1.id);
		await TestFactory.createAnimalBreed(animalCategory2.id);

		const {body, statusCode} = await client.get<any[]>(`${url}${REQUEST_PATH}`, {
			searchParams: {
				category_code: animalCategory1.code
			}
		});

		expect(statusCode).toEqual(200);
		expect(body).toEqual([
			{
				code: animalBreed1.code,
				displayName: animalBreed1.displayName
			},
			{
				code: animalBreed2.code,
				displayName: animalBreed2.displayName
			}
		]);
	});
});
