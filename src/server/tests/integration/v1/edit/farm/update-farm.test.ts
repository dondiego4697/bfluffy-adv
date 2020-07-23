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
import {SignUpType, FarmType} from 'server/types/consts';

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

const REQUEST_PATH = '/api/v1/edit/farm/update';

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

	it('should update farm', async () => {
		const region = await TestFactory.createRegion();
		const [cityBefore, cityAfter] = await Promise.all([
			TestFactory.createCity(region.id),
			TestFactory.createCity(region.id)
		]);

		const farm = await TestFactory.createFarm({
			cityId: cityBefore.id,
			ownerId: 1,
			type: FarmType.FARM
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
					type: FarmType.BREEDER,
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
			type: FarmType.BREEDER,
			description: 'description updated',
			ownerId: 1,
			address: 'address updated',
			rating: 0,
			isArchive: false,
			publicId: body.publicId
		});
	});

	it('should throw error if owner id not equal with request user id', async () => {
		const region = await TestFactory.createRegion();
		const city = await TestFactory.createCity(region.id);

		const farm = await TestFactory.createFarm({
			cityId: city.id,
			ownerId: 1,
			type: FarmType.FARM
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
					type: FarmType.FARM,
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
		const region = await TestFactory.createRegion();
		const city = await TestFactory.createCity(region.id);

		const {statusCode} = await client.post<any>(
			`${url}${REQUEST_PATH}`,
			{
				json: {
					cityCode: city.code,
	                contacts: {
						email: 'some@mail.ru',
						phone: '70000000000'
					},
					type: FarmType.FARM,
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
