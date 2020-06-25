import * as express from 'express';
import * as Joi from '@hapi/joi';
import {bodyValidateMiddleware, queryValidateMiddleware} from 'server/middlewares/validate';
import {createFarm} from 'server/v1/routers/farm/providers/create-farm';
import {updateFarm} from 'server/v1/routers/farm/providers/update-farm';

const createSchema = {
	body: Joi.object({
		cityCode: Joi.string().required(),
		contacts: Joi.object({
			email: Joi.string().email().optional(),
			phone: Joi.string().optional()
		}).default({}),
		name: Joi.string().required(),
		description: Joi.string().optional(),
		address: Joi.string().required()
	}),
	query: Joi.object({
		publicId: Joi.string().uuid().required()
	})
};

export const router = express.Router()
	.get('/list')
	.get('/info')
	.post('/create', bodyValidateMiddleware(createSchema.body), createFarm)
	.post(
		'/update',
		queryValidateMiddleware(createSchema.query),
		bodyValidateMiddleware(createSchema.body),
		updateFarm
	)
	.post('/delete');
