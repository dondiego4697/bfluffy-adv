import * as express from 'express';
import {router as publicRouter} from 'server/v1/routers/public';
import {router as editRouter} from 'server/v1/routers/edit';
import {requestEmulator} from 'server/middlewares/request-emulator';

export const router = express.Router()
    .use(requestEmulator)
    .use('/public', publicRouter)
    .use('/edit', editRouter);
