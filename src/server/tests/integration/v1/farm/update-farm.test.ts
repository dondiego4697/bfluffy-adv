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
import {SignUpType} from 'server/types/consts';

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

const REQUEST_PATH = '/api/v1/farm/update';

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

	it('should update farm', async () => {
		const [cityBefore, cityAfter] = await TestFactory.getAllCities();
		const farm = await TestFactory.createFarm({
			cityId: cityBefore.id,
			ownerId: 1
		});

		const {body, statusCode} = await client.post<any>(
			`${url}${REQUEST_PATH}`,
			{
				json: {
					cityCode: cityAfter.code,
	                contacts: {
						email: 'updated@mail.ru',
						phone: '70000000000'
					},
	                name: 'name updated',
	                description: 'description updated',
	                address: 'address updated'
				},
				searchParams: {
					publicId: farm.publicId
				}
			}
		);

		expect(statusCode).toEqual(200);
		expect(body).toEqual({publicId: farm.publicId});

		const farms = await TestFactory.getAllFarms();
		const updatedFarm = farms.find((item) => item.publicId === body.publicId);

		expect(omit(updatedFarm, ['createdAt', 'updatedAt'])).toEqual({
			id: 1,
			cityId: 2,
			contacts: {
				email: 'updated@mail.ru',
				phone: '70000000000'
			},
			name: 'name updated',
			description: 'description updated',
			ownerId: 1,
			address: 'address updated',
			rating: 0,
			archive: false,
			publicId: body.publicId
		});
	});

	it('should throw error if owner id not equal with request user id', async () => {
		const [city] = await TestFactory.getAllCities();

		const farm = await TestFactory.createFarm({
			cityId: city.id,
			ownerId: 1
		});

		const {authToken: token} = await TestFactory.createUserWithToken({
			signUpType: SignUpType.EMAIL
		});

		const {statusCode} = await client.post<any>(
			`${url}${REQUEST_PATH}`,
			{
				json: {
					cityCode: city.code,
	                contacts: {
						email: 'some@mail.ru',
						phone: '70000000000'
					},
	                name: 'name',
	                description: 'description',
	                address: 'address'
				},
				searchParams: {
					publicId: farm.publicId
				},
				headers: {
					cookie: `auth_token=${token}`
				}
			}
		);

		expect(statusCode).toEqual(403);
	});

	it('should throw error if public id does not exist', async () => {
		const [city] = await TestFactory.getAllCities();

		const {statusCode} = await client.post<any>(
			`${url}${REQUEST_PATH}`,
			{
				json: {
					cityCode: city.code,
	                contacts: {
						email: 'some@mail.ru',
						phone: '70000000000'
					},
	                name: 'name',
	                description: 'description',
	                address: 'address'
				},
				searchParams: {
					publicId: '9fc5a3fe-58ca-4e62-9a02-f157fd97f03d'
				}
			}
		);

		expect(statusCode).toEqual(404);
	});
});
