/* eslint-disable no-undef */
import got from 'got';
import * as http from 'http';
import * as nock from 'nock';
import {app} from 'server/app';
import {TestDb} from 'tests/test-db';
import {fixtures} from 'tests/fixtures/db';
import {startServer, stopServer} from 'tests/test-server';
import {TestFactory} from 'tests/test-factory';
import {AuthToken} from 'server/lib/auth-token';
import {SignUpType, FarmType} from 'server/types/consts';

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

const REQUEST_PATH = '/api/v1/edit/farm/list';

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

	it('should return farm list', async () => {
		const [city1, city2] = await TestFactory.getAllCities();

		const farm1 = await TestFactory.createFarm({
			cityId: city1.id,
			ownerId: 1,
			type: FarmType.FARM
		});

		const farm2 = await TestFactory.createFarm({
			cityId: city2.id,
			ownerId: 1,
			type: FarmType.FARM
		});

		const user = await TestFactory.createUser({
			signUpType: SignUpType.EMAIL
		});

		await TestFactory.createFarm({
			cityId: city2.id,
			ownerId: user.id,
			type: FarmType.FARM
		});

		const {body, statusCode} = await client.get<any>(`${url}${REQUEST_PATH}`);

		expect(statusCode).toEqual(200);
		expect(body).toEqual([
			{
				contacts: farm2.contacts,
				name: farm2.name,
				type: FarmType.FARM,
				description: farm2.description,
				address: farm2.address,
				rating: farm2.rating,
				createdAt: farm2.createdAt.toISOString(),
				updatedAt: farm2.updatedAt.toISOString(),
				farmPublicId: farm2.publicId,
				ownerId: farm2.ownerId,
				cityCode: city2.code
			},
			{
				contacts: farm1.contacts,
				name: farm1.name,
				type: FarmType.FARM,
				description: farm1.description,
				address: farm1.address,
				rating: farm1.rating,
				createdAt: farm1.createdAt.toISOString(),
				updatedAt: farm1.updatedAt.toISOString(),
				farmPublicId: farm1.publicId,
				ownerId: farm1.ownerId,
				cityCode: city1.code
			}
		]);
	});
});
