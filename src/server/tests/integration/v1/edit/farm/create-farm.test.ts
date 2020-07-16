/* eslint-disable no-undef */
import got from 'got';
import * as http from 'http';
import * as nock from 'nock';
import {omit} from 'lodash';
import {app} from 'server/app';
import {TestDb} from 'tests/test-db';
import {fixtures} from 'tests/fixtures/db';
import {startServer, stopServer} from 'tests/test-server';
import {TestFactory} from 'tests/test-factory';
import {AuthToken} from 'server/lib/auth-token';
import {FarmType} from 'server/types/consts';

const authToken = AuthToken.encode({
	email: 'test@mail.ru',
	password: 'password'
});

const client = got.extend({
	throwHttpErrors: false,
	retry: 0,
	timeout: 2000,
	responseType: 'json',
	headers: {
		cookie: `auth_token=${authToken}`
	}
});

const REQUEST_PATH = '/api/v1/edit/farm/create';

describe(REQUEST_PATH, () => {
	const testDb = new TestDb();
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
		await testDb.loadFixtures(fixtures);
	});

	it('should create farm', async () => {
		const [city] = await TestFactory.getAllCities();

		const {body, statusCode} = await client.post<any>(
			`${url}${REQUEST_PATH}`,
			{
				json: {
					cityCode: city.code,
	                contacts: {
						email: 'some@mail.ru',
						phone: '79870001212'
					},
					type: FarmType.FARM,
	                name: 'farm name',
	                description: 'farm description',
	                address: 'farm address'
				}
			}
		);

		expect(statusCode).toEqual(200);

		const farms = await TestFactory.getAllFarms();
		const farm = farms.find((item) => item.publicId === body.publicId);

		expect(omit(farm, ['createdAt', 'updatedAt'])).toEqual({
			id: 1,
			cityId: 1,
			contacts: {
				email: 'some@mail.ru',
				phone: '79870001212'
			},
			name: 'farm name',
			type: FarmType.FARM,
			description: 'farm description',
			ownerId: 1,
			address: 'farm address',
			rating: 0,
			isArchive: false,
			publicId: body.publicId
		});
	});
});
