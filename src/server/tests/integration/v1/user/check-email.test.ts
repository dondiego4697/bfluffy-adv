/* eslint-disable no-undef */
import got from 'got';
import * as http from 'http';
import * as nock from 'nock';
import {app} from 'server/app';
import {TestDb} from 'tests/test-db';
import {fixtures} from 'tests/fixtures/db';
import {startServer, stopServer} from 'tests/test-server';
import {SignUpType} from 'server/types/consts';
import {TestFactory} from 'tests/test-factory';

const client = got.extend({
	throwHttpErrors: false,
	retry: 0,
	timeout: 2000,
	responseType: 'json'
});

const REQUEST_PATH = '/api/v1/user/check_email';

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

	it('should return correct response on free email', async () => {
		const {body, statusCode} = await client.get<any>(
			`${url}${REQUEST_PATH}`,
			{
				searchParams: {
					email: 'somefree@email.ru'
				}
			}
		);

		expect(statusCode).toEqual(200);
		expect(body).toEqual({exist: false});
	});

	it('should return correct response on existed email', async () => {
		const user = await TestFactory.createUser({
			signUpType: SignUpType.EMAIL
		});

		const {body, statusCode} = await client.get<any>(
			`${url}${REQUEST_PATH}`,
			{
				searchParams: {
					email: user.email
				}
			}
		);

		expect(statusCode).toEqual(200);
		expect(body).toEqual({exist: true});
	});
});
