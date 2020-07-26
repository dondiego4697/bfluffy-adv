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
import {FarmType, SignUpType} from 'server/types/consts';

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

const REQUEST_PATH = '/api/v1/edit/user_card/create';

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

	it('should create user card', async () => {
		const region = await TestFactory.createRegion();
		const city = await TestFactory.createCity(region.id);

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

		const userCards = await TestFactory.getAllUserCards();
		const userCard = userCards.find((item) => item.publicId === body.publicId);

		expect(omit(userCard, ['createdAt', 'updatedAt'])).toEqual({
			id: 1,
			cityId: 1,
			contacts: {
				email: 'some@mail.ru',
				phone: '79870001212'
			},
			name: 'farm name',
			type: FarmType.FARM,
			description: 'farm description',
			userId: 1,
			address: 'farm address',
			publicId: body.publicId
		});
	});
});
