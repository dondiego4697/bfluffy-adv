import got from 'got';
import * as http from 'http';
import * as nock from 'nock';
import {omit} from 'lodash';
import {app} from 'server/app';
import {TestDb} from 'tests/test-db';
import {startServer, stopServer} from 'tests/test-server';
import {TestFactory} from 'tests/test-factory';
import {AuthToken} from 'server/lib/auth-token';
import {ClientStatusCode} from 'server/types/consts';

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

const REQUEST_PATH = '/api/v1/private/user/update';

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

    it('should update user', async () => {
        const {body, statusCode} = await client.post<any>(`${url}${REQUEST_PATH}`, {
            json: {
                contacts: {
                    phone: '70000000000'
                },
                name: 'name updated'
            }
        });

        expect(statusCode).toEqual(200);
        expect(body).toEqual({});

        const users = await TestFactory.getAllUsers();
        const updatedUser = users.find((item) => item.id === 1);

        expect(omit(updatedUser, ['createdAt', 'updatedAt'])).toEqual({
            id: 1,
            email: 'test@mail.ru',
            verified: false,
            verifiedCode: 'code',
            name: 'name updated',
            contacts: {
                phone: '70000000000'
            }
        });
    });

    it('should throw error if user not authorized', async () => {
        const {statusCode, body} = await client.post<any>(`${url}${REQUEST_PATH}`, {
            headers: {
                cookie: 'foo=bar'
            }
        });

        expect(statusCode).toEqual(401);
        expect(body.message).toEqual(ClientStatusCode.USER_NOT_AUTHORIZED);
    });
});
