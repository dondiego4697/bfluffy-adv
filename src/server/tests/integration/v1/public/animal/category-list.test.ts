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

const REQUEST_PATH = '/api/v1/public/animal/category_list';

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

	it('should return correct category list', async () => {
		const animalCategory1 = await TestFactory.createAnimaCategory();
		const animalCategory2 = await TestFactory.createAnimaCategory();

		const {body, statusCode} = await client.get<any[]>(`${url}${REQUEST_PATH}`);

		expect(statusCode).toEqual(200);
		expect(body).toEqual([{
			code: animalCategory1.code,
		    displayName: animalCategory1.displayName
		}, {
			code: animalCategory2.code,
			displayName: animalCategory2.displayName
		}]);
	});
});
