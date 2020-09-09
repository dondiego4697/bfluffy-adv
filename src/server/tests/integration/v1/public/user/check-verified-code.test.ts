import got from 'got';
import * as http from 'http';
import * as nock from 'nock';
import * as Boom from '@hapi/boom';
import {app} from 'server/app';
import {TestDb} from 'tests/test-db';
import {startServer, stopServer} from 'tests/test-server';
import {TestFactory} from 'tests/test-factory';

const client = got.extend({
    throwHttpErrors: false,
    retry: 0,
    timeout: 2000,
    responseType: 'json'
});

const REQUEST_PATH = '/api/v1/public/user/check_verified_code';

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

    it('should return existed user', async () => {
        const {user, authToken} = await TestFactory.createUser({
            verified: false
        });

        const {body, statusCode, headers} = await client.post<any>(`${url}${REQUEST_PATH}`, {
            json: {
                email: user.email,
                verifiedCode: user.verifiedCode
            }
        });

        expect(statusCode).toEqual(200);
        expect(body).toEqual({
            authToken,
            email: user.email,
            verified: true,
            avatar: null
        });

        const updatedUser = await TestFactory.getUserByEmail(user.email);
        expect(updatedUser?.verified).toEqual(true);

        const cookie = headers['set-cookie']![0];
        expect(cookie.includes(`auth_token=${authToken}`)).toBeTruthy();
    });

    it('should throw error if user does not exist', async () => {
        const {body, statusCode} = await client.post<Boom.Payload>(`${url}${REQUEST_PATH}`, {
            json: {
                email: 'unknown@mail.ru',
                verifiedCode: 'unknown'
            }
        });

        expect(statusCode).toEqual(400);
        expect(body.message).toEqual('USER_NOT_EXIST');
    });

    it('should throw error if verified code is incorrect', async () => {
        const {user} = await TestFactory.createUser();

        const {body, statusCode} = await client.post<Boom.Payload>(`${url}${REQUEST_PATH}`, {
            json: {
                email: user.email,
                verifiedCode: 'unknown'
            }
        });

        expect(statusCode).toEqual(400);
        expect(body.message).toEqual('USER_WRONG_VERIFIED_CODE');
    });
});
