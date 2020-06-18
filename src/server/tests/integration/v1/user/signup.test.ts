/* eslint-disable no-undef */
import got from 'got';
import * as http from 'http';
import * as nock from 'nock';
import * as Boom from '@hapi/boom';
import {app} from 'server/app';
import {TestDb} from 'tests/test-db';
import {fixtures} from 'tests/fixtures/db';
import {startServer, stopServer} from 'tests/test-server';
import {SignUpType} from 'server/types/consts';
import {TestFactory} from 'tests/test-factory';
import {getPasswordHash} from 'server/lib/crypto';
import {formatCreatedDate} from 'server/lib/date-format';
import {AuthToken} from 'server/lib/auth-token';

const client = got.extend({
	throwHttpErrors: false,
	retry: 0,
	timeout: 2000,
	responseType: 'json'
});

const REQUEST_PATH = '/api/v1/user/signup';

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

	it('should sign up by email', async () => {
		const {body, statusCode} = await client.post(
			`${url}${REQUEST_PATH}`,
			{
				json: {
					email: 'new_test@mail.ru',
	                type: SignUpType.EMAIL,
	                name: 'Test Test',
	                password: 'password'
				}
			}
		);

		expect(statusCode).toEqual(200);

		const authToken = AuthToken.encode({
			email: 'new_test@mail.ru',
			password: 'password'
		});
		expect(body).toEqual({auth_token: authToken});

		const user = await TestFactory.getUserByCredentials(
			'new_test@mail.ru',
			getPasswordHash('password')
		);

		expect(user).not.toBeUndefined();
		expect({
			...user,
			createdAt: formatCreatedDate(user.createdAt),
		}).toEqual({
			id: 2,
			email: 'new_test@mail.ru',
			displayName: 'Test Test',
			password: getPasswordHash('password'),
			createdAt: formatCreatedDate(new Date()),
			signUpType: SignUpType.EMAIL,
			verified: false
		});
	});

	it('should throw error on existed email', async () => {
		const {statusCode, body} = await client.post<Boom.Payload>(
			`${url}${REQUEST_PATH}`,
			{
				json: {
					email: 'test@mail.ru',
	                type: SignUpType.EMAIL,
	                name: 'Test Test',
	                password: 'password'
				}
			}
		);

		expect(statusCode).toEqual(400);
		expect(body.message).toEqual('USER_EMAIL_EXIST');
	});
});
