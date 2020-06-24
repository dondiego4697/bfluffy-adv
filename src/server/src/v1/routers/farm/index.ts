import * as express from 'express';
import * as Joi from '@hapi/joi';
import {bodyValidateMiddleware} from 'server/middlewares/validate';
import {createFarm} from 'server/v1/routers/farm/providers/create-farm';

const createSchema = Joi.object({
	cityCode: Joi.string().required(),
	contacts: Joi.object({
		email: Joi.string().email().optional(),
		phone: Joi.string().optional()
	}).default({}),
	name: Joi.string().required(),
	description: Joi.string().optional(),
	address: Joi.string().required()
});

export const router = express.Router()
	.get('/list')
	.get('/info')
	.post('/create', bodyValidateMiddleware(createSchema), createFarm)
	.post('/update')
	.post('/delete');
