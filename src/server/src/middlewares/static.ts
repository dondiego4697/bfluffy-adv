import * as path from 'path';
import * as express from 'express';

export const router = express
    .Router()
    .use('/image/', express.static(path.resolve('src/resources/image')))
    .use('/fonts/', express.static(path.resolve('src/resources/fonts')))
    .use('/bundles/', express.static(path.resolve('out/client/bundles')));
