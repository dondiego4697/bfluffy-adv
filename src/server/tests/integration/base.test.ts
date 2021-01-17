import got from 'got';
import * as http from 'http';
import * as nock from 'nock';
import {app} from 'server/app';
import {startServer, stopServer} from 'tests/test-server';

describe('the basic interface of the HTTP API', () => {
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

    it('should return 200 on /ping requests', async () => {
        const {statusCode} = await got.get(`${url}/ping`);
        expect(statusCode).toEqual(200);
    });

    it('should return 200 and html on unsupported paths', async () => {
        const {body, statusCode} = await got.get(`${url}/cat_pictures`, {throwHttpErrors: false});
        expect(statusCode).toEqual(200);
        expect(body.startsWith('<')).toBeTruthy();
    });

    it('should be free of X-Powered-By headers', async () => {
        const {headers} = await got.get(`${url}/ping`);
        expect(headers).not.toHaveProperty('x-powered-by');
    });
});
