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
import {AuthToken} from 'server/lib/auth-token';

const client = got.extend({
	throwHttpErrors: false,
	retry: 0,
	timeout: 2000,
	responseType: 'json'
});

const REQUEST_PATH = '/api/v1/user/login';

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

	describe('by auth_token', () => {
		it('should login and update verified', async () => {
			const user = await TestFactory.createUser({
				signUpType: SignUpType.EMAIL,
				password: 'password'
			});

			const authToken = AuthToken.encode({
				email: user.email,
				password: 'password'
			});

			const {body, statusCode, headers} = await client.post(
				`${url}${REQUEST_PATH}`,
				{
					json: {
						auth_token: authToken
					}
				}
			);

			expect(statusCode).toEqual(200);
			expect(body).toEqual({
				email: user.email,
				name: user.displayName,
				token: authToken
			});

			const cookie = headers['set-cookie']![0];
			expect(cookie.includes(`auth_token=${authToken}`)).toBeTruthy();

			const users = await TestFactory.getAllUsers();
			const verifiedUser = users.find((item) => item.email === user.email);
			expect(verifiedUser?.verified).toBeTruthy();
		});

		it('should throw error if auth_token is invalid', async () => {
			const {body, statusCode} = await client.post<Boom.Payload>(
				`${url}${REQUEST_PATH}`,
				{
					json: {
						auth_token: 'invalid_token'
					}
				}
			);

			expect(statusCode).toEqual(400);
			expect(body.message).toEqual('USER_INVALID_TOKEN');
		});

		it('should throw error if user not exist by email', async () => {
			const authToken = AuthToken.encode({
				email: 'unknown@mail.ru',
				password: 'password'
			});

			const {body, statusCode} = await client.post<Boom.Payload>(
				`${url}${REQUEST_PATH}`,
				{
					json: {
						auth_token: authToken
					}
				}
			);

			expect(statusCode).toEqual(400);
			expect(body.message).toEqual('USER_NOT_EXIST');
		});

		it('should throw error if user not exist by password', async () => {
			const user = await TestFactory.createUser({
				signUpType: SignUpType.EMAIL,
				password: 'password'
			});

			const authToken = AuthToken.encode({
				email: user.email,
				password: 'unknown_password'
			});

			const {body, statusCode} = await client.post<Boom.Payload>(
				`${url}${REQUEST_PATH}`,
				{
					json: {
						auth_token: authToken
					}
				}
			);

			expect(statusCode).toEqual(400);
			expect(body.message).toEqual('USER_NOT_EXIST');
		});
	});

	describe('by credentials', () => {
		it('should log in by credentials', async () => {
			const user = await TestFactory.createUser({
				signUpType: SignUpType.EMAIL,
				password: 'password',
				verified: true
			});

			const authToken = AuthToken.encode({
				email: user.email,
				password: 'password'
			});

			const {body, statusCode, headers} = await client.post(
				`${url}${REQUEST_PATH}`,
				{
					json: {
						credentials: {
							email: user.email,
							password: 'password'
						}
					}
				}
			);

			expect(statusCode).toEqual(200);
			expect(body).toEqual({
				email: user.email,
				name: user.displayName,
				token: authToken
			});

			const cookie = headers['set-cookie']![0];
			expect(cookie.includes(`auth_token=${authToken}`)).toBeTruthy();
		});

		it('should throw error if user not exist by email', async () => {
			const {body, statusCode} = await client.post<Boom.Payload>(
				`${url}${REQUEST_PATH}`,
				{
					json: {
						credentials: {
							email: 'unknown@mail.ru',
							password: 'password'
						}
					}
				}
			);

			expect(statusCode).toEqual(400);
			expect(body.message).toEqual('USER_NOT_EXIST');
		});

		it('should throw error if user not exist by password', async () => {
			const user = await TestFactory.createUser({
				signUpType: SignUpType.EMAIL,
				password: 'password'
			});

			const {body, statusCode} = await client.post<Boom.Payload>(
				`${url}${REQUEST_PATH}`,
				{
					json: {
						credentials: {
							email: user.email,
							password: 'unknown_password'
						}
					}
				}
			);

			expect(statusCode).toEqual(400);
			expect(body.message).toEqual('USER_NOT_EXIST');
		});

		it('should throw error if user is not verified', async () => {
			const user = await TestFactory.createUser({
				signUpType: SignUpType.EMAIL,
				password: 'password'
			});

			const {body, statusCode} = await client.post<Boom.Payload>(
				`${url}${REQUEST_PATH}`,
				{
					json: {
						credentials: {
							email: user.email,
							password: 'password'
						}
					}
				}
			);

			expect(statusCode).toEqual(400);
			expect(body.message).toEqual('USER_NOT_VERIFIED');
		});
	});
});
