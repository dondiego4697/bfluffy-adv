import * as path from 'path';
import * as express from 'express';
import * as favicon from 'serve-favicon';

export const router = express.Router()
	.use(favicon(path.resolve('src/resources/favicon.png')))
	.use('/image/', express.static(path.resolve('src/resources/images')))
	.use('/bundles/', express.static(path.resolve('out/client/bundles')));
