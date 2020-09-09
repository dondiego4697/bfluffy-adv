import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {dbManager} from 'server/lib/db-manager';
import {config} from 'server/config';

let lastCheckTime = 0;

export const ping = wrap<Request, Response>(async (_req, res) => {
    const currentTime = Date.now();

    if (currentTime - lastCheckTime > config['db.pingTimeoutMs']) {
        lastCheckTime = currentTime;
        await dbManager.executeReadQuery('SELECT 1');
    }

    res.end();
});
