/* eslint-disable no-undef */
import got from 'got';
import * as http from 'http';
import * as nock from 'nock';
import * as Boom from '@hapi/boom';
import mockdate from 'mockdate';
import {app} from 'server/app';
import {TestDb} from 'tests/test-db';
import {fixtures} from 'tests/fixtures/db';
import {startServer, stopServer} from 'tests/test-server';
import {SignUpType} from 'server/types/consts';
import {TestFactory} from 'tests/test-factory';
import {AuthToken} from 'server/lib/auth-token';

const client = got.extend({
	throwHttpErrors: false,
	retry: 0,
	timeout: 2000,
	responseType: 'json'
});

const REQUEST_PATH = '/api/v1/user/forgot_password';

describe(REQUEST_PATH, () => {
	const testDb = new TestDb();
	let server: http.Server;
	let url: string;

	beforeAll(async () => {
		[server, url] = await startServer(app);
		nock.disableNetConnect();
		nock.enableNetConnect(/localhost/);

		await testDb.loadFixtures(fixtures);
	});

	afterAll(async () => {
		await stopServer(server);
		nock.enableNetConnect();
	});

	it('should make token with hashed password', async () => {
		const user = await TestFactory.createUser({
			signUpType: SignUpType.EMAIL
		});

		const {body, statusCode} = await client.post<any>(
			`${url}${REQUEST_PATH}`,
			{
				json: {
					email: user.email
				}
			}
		);

		expect(statusCode).toEqual(200);
		expect(AuthToken.decode(body.authToken)).toEqual({
			email: user.email,
			password: user.password
		});

		mockdate.set(Date.now() + 24 * 60 * 60 * 1000 + 60 * 1000);
		expect(() => AuthToken.decode(body.authToken)).toThrow();
	});

	it('should throw error if user not exist', async () => {
		const {body, statusCode} = await client.post<Boom.Payload>(
			`${url}${REQUEST_PATH}`,
			{
				json: {
					email: 'unknown@mail.ru'
				}
			}
		);

		expect(statusCode).toEqual(400);
		expect(body.message).toEqual('USER_NOT_EXIST');
	});
});
