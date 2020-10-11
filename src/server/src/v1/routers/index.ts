import * as express from 'express';
import {router as publicRouter} from 'server/v1/routers/public';
import {router as privateRouter} from 'server/v1/routers/private';
import {requestEmulator} from 'server/middlewares/request-emulator';
import {auth} from 'server/middlewares/auth';

export const router = express
    .Router()
    .use(requestEmulator)
    .use('/public', publicRouter)
    .use(auth)
    .use('/private', privateRouter);
