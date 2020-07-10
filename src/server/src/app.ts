/* eslint-disable import/first */
import * as dotenv from 'dotenv';

dotenv.config();

import * as Boom from '@hapi/boom';
import * as assert from 'assert';
import * as path from 'path';
import * as express from 'express';
import {router as v1} from 'server/v1/routers';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import {renderPage} from 'server/middlewares/render-page';
import {router as staticRouter} from 'server/middlewares/static';
import {ping} from 'server/middlewares/db-ping';
import {logger} from 'server/lib/logger';

export const app = express()
	.set('views', path.resolve('src/resources/views'))
	.set('view engine', 'pug')
	.enable('trust proxy')
	.disable('x-powered-by')
	.use(cookieParser())
	.use(bodyParser.json())
	.get('/ping', ping)
	.use(staticRouter)
	.use('/api/v1', v1)
	.use('/', renderPage)
	.use((_req, _res, next) => next(Boom.notFound('Endpoint not found')))
	// eslint-disable-next-line
    .use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
		if (error.isBoom) {
			sendError(res, error);
		} else {
			logger.error(error.stack || error);
			sendError(res, Boom.internal());
		}
	});

function sendError(res: express.Response, error: Boom.Boom): void {
	res.status(error.output.statusCode).json(error.output.payload);
}

if (!module.parent) {
	const port = process.env.NODEJS_PORT || 8080;

	assert(port, 'No port provided for the application to listen to');

	app.listen(port, () => {
		logger.info(`Application started on port ${port}`);
	});
}
