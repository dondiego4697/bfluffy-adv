import got from 'got';
import * as http from 'http';
import * as nock from 'nock';
import * as Boom from '@hapi/boom';
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

const REQUEST_PATH = '/api/v1/public/user/check_auth_token';

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

	it('should return existed user', async () => {
		const {body, statusCode, headers} = await client.post<any>(`${url}${REQUEST_PATH}`);

		expect(statusCode).toEqual(200);
		expect(body).toEqual({
			authToken: AUTH_TOKEN,
			email: BASE_USER.email,
			contacts: {},
			verified: false,
			avatar: null,
			name: null
		});

		const cookie = headers['set-cookie']![0];
		expect(cookie.includes(`auth_token=${AUTH_TOKEN}`)).toBeTruthy();
	});

	it('should throw error if user does not exist', async () => {
		const authToken = AuthToken.encode({
			email: 'unknown@mail.ru',
			verifiedCode: 'unknown'
		});

		const {body, statusCode} = await client.post<Boom.Payload>(
			`${url}${REQUEST_PATH}`,
			{
				headers: {
					cookie: `auth_token=${authToken}`
				}
			}
		);

		expect(statusCode).toEqual(400);
		expect(body.message).toEqual('USER_NOT_EXIST');
	});

	it('should throw error if verified code is incorrect', async () => {
		const authToken = AuthToken.encode({
			email: BASE_USER.email,
			verifiedCode: 'unknown'
		});

		const {body, statusCode} = await client.post<Boom.Payload>(
			`${url}${REQUEST_PATH}`,
			{
				headers: {
					cookie: `auth_token=${authToken}`
				}
			}
		);

		expect(statusCode).toEqual(400);
		expect(body.message).toEqual('USER_WRONG_VERIFIED_CODE');
	});
});
