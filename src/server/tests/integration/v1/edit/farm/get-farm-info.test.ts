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

const REQUEST_PATH = '/api/v1/edit/farm/info';

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

	it('should return farm info', async () => {
		const region = await TestFactory.createRegion();
		const city = await TestFactory.createCity(region.id);

		const farm = await TestFactory.createFarm({
			cityId: city.id,
			ownerId: 1,
			type: FarmType.FARM
		});

		const {body, statusCode} = await client.get<any>(
			`${url}${REQUEST_PATH}`,
			{
				searchParams: {
					publicId: farm.publicId
				}
			}
		);

		expect(statusCode).toEqual(200);
		expect(omit(body, ['createdAt', 'updatedAt'])).toEqual({
			address: farm.address,
			cityCode: city.code,
			contacts: farm.contacts,
			description: farm.description,
			farmPublicId: farm.publicId,
			name: farm.name,
			rating: farm.rating
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

		const {statusCode} = await client.get<any>(
			`${url}${REQUEST_PATH}`,
			{
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

	it('should throw error if farm is archived', async () => {
		const region = await TestFactory.createRegion();
		const city = await TestFactory.createCity(region.id);

		const farm = await TestFactory.createFarm({
			cityId: city.id,
			ownerId: 1,
			isArchive: true,
			type: FarmType.FARM
		});

		const {statusCode} = await client.get<any>(
			`${url}${REQUEST_PATH}`,
			{
				searchParams: {
					publicId: farm.publicId
				},
				headers: {
					cookie: `auth_token=${AUTH_TOKEN}`
				}
			}
		);

		expect(statusCode).toEqual(404);
	});
});
