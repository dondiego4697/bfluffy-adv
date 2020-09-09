import got from 'got';
import * as http from 'http';
import * as nock from 'nock';
import {omit} from 'lodash';
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

const REQUEST_PATH = '/api/v1/edit/user/info';

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

    it('should return user info', async () => {
        const {body, statusCode} = await client.get<any>(`${url}${REQUEST_PATH}`);

        expect(statusCode).toEqual(200);
        expect(omit(body, ['createdAt', 'updatedAt'])).toEqual({
            contacts: {},
            email: 'test@mail.ru',
            name: null,
            verified: false
        });
    });
});
