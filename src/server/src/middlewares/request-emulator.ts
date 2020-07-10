import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {config} from 'server/config';

export const requestEmulator = wrap<Request, Response>(async (_req, _res, next) => {
    if (config['emulation.request']) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    next();
});
