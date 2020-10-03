import * as express from 'express';
import * as Joi from '@hapi/joi';
import {bodyValidateMiddleware} from 'server/middlewares/validate';
import {updateUser} from 'server/v1/routers/private/user/providers/update-user';
import {getUserInfo} from 'server/v1/routers/private/user/providers/get-user-info';

const createSchema = {
    body: Joi.object({
        contacts: Joi.object({
            phone: Joi.string().empty('').allow(null)
        }).default({}),
        name: Joi.string().empty('').allow(null)
    })
};

export const router = express
    .Router()
    .get('/info', getUserInfo)
    .post('/update', bodyValidateMiddleware(createSchema.body), updateUser);
