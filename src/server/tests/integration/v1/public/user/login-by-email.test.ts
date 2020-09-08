import got from 'got';
import * as http from 'http';
import * as nock from 'nock';
import {app} from 'server/app';
import {startServer, stopServer} from 'tests/test-server';
import {TestDb} from 'tests/test-db';
import {TestFactory} from 'tests/test-factory';

const client = got.extend({
	throwHttpErrors: false,
	retry: 0,
	timeout: 2000,
	responseType: 'json'
});

const REQUEST_PATH = '/api/v1/public/user/login_by_email';

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
	});

	it('should update verified code if user exist', async () => {
		const {user} = await TestFactory.createUser();

		const {body, statusCode} = await client.post<any>(
			`${url}${REQUEST_PATH}`,
			{
				json: {
					email: user.email
				}
			}
		);

		expect(statusCode).toEqual(200);
		expect(body).toEqual({});

		const updatedUser = await TestFactory.getUserByEmail(user.email);

		expect(updatedUser?.verifiedCode).not.toBeFalsy();
		expect(user.verifiedCode).not.toBeFalsy();

		expect(updatedUser?.verifiedCode).not.toEqual(user.verifiedCode);
	});

	it('should create user if user does not exist', async () => {
		const email = 'some_new_email@mail.ru';
		const userBefore = await TestFactory.getUserByEmail(email);
		expect(userBefore).toBeFalsy();

		const {body, statusCode} = await client.post<any>(
			`${url}${REQUEST_PATH}`,
			{
				json: {
					email
				}
			}
		);

		expect(statusCode).toEqual(200);
		expect(body).toEqual({});

		const userAfter = await TestFactory.getUserByEmail(email);
		expect(userAfter).not.toBeFalsy();
		expect(userAfter?.verified).toEqual(false);
	});
});
