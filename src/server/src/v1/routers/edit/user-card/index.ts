import * as express from 'express';
import * as Joi from '@hapi/joi';
import {bodyValidateMiddleware} from 'server/middlewares/validate';
import {FarmType} from 'server/types/consts';
import {createUserCard} from 'server/v1/routers/edit/user-card/providers/create-user-card';
import {updateUserCard} from 'server/v1/routers/edit/user-card/providers/update-user-card';
import {getUserCardInfo} from 'server/v1/routers/edit/user-card/providers/get-user-card-info';

const createSchema = {
	body: Joi.object({
		cityCode: Joi.string().required(),
		farmType: Joi.string().valid(...Object.values(FarmType)).required(),
		contacts: Joi.object({
			email: Joi.string().email().empty('').allow(null),
			phone: Joi.string().empty('').allow(null),
		}).default({}),
		name: Joi.string().required(),
		description: Joi.string().empty('').allow(null),
		address: Joi.string().empty('').allow(null)
	})
};

export const router = express.Router()
	.get('/info', getUserCardInfo)
	.post('/create', bodyValidateMiddleware(createSchema.body), createUserCard)
	.post('/update', bodyValidateMiddleware(createSchema.body), updateUserCard);
