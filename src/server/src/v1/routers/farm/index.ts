import * as express from 'express';
import * as Joi from '@hapi/joi';
import {bodyValidateMiddleware, queryValidateMiddleware} from 'server/middlewares/validate';
import {createFarm} from 'server/v1/routers/farm/providers/create-farm';
import {updateFarm} from 'server/v1/routers/farm/providers/update-farm';
import {getFarmInfo} from 'server/v1/routers/farm/providers/get-farm-info';
import {deleteFarm} from 'server/v1/routers/farm/providers/delete-farm';
import {getFarmList} from 'server/v1/routers/farm/providers/get-farm-list';

const createSchema = {
	body: Joi.object({
		cityCode: Joi.string().required(),
		contacts: Joi.object({
			email: Joi.string().email().empty('').allow(null),
			phone: Joi.string().empty('').allow(null),
		}).default({}),
		name: Joi.string().required(),
		description: Joi.string().empty('').allow(null),
		address: Joi.string().required()
	}),
	query: Joi.object({
		publicId: Joi.string().uuid().required()
	})
};

const getFarmInfoSchema = Joi.object({
	publicId: Joi.string().uuid().required()
});

export const router = express.Router()
	.get('/list', getFarmList)
	.get('/info', queryValidateMiddleware(getFarmInfoSchema), getFarmInfo)
	.post('/create', bodyValidateMiddleware(createSchema.body), createFarm)
	.post(
		'/update',
		queryValidateMiddleware(createSchema.query),
		bodyValidateMiddleware(createSchema.body),
		updateFarm
	)
	.post('/delete', bodyValidateMiddleware(getFarmInfoSchema), deleteFarm);
