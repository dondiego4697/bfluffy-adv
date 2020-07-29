import * as express from 'express';
import * as Joi from '@hapi/joi';
import {bodyValidateMiddleware} from 'server/middlewares/validate';
import {loginByEmail} from 'server/v1/routers/public/user/providers/login-by-email';
import {checkVerifiedCode} from 'server/v1/routers/public/user/providers/check-verified-code';

const loginByEmailSchema = Joi.object({
	email: Joi.string().email().required()
});

const checkVerifiedCodeSchema = Joi.object({
	email: Joi.string().email().required(),
	verifiedCode: Joi.string().required()
});

export const router = express.Router()
	.post('/login_by_email', bodyValidateMiddleware(loginByEmailSchema), loginByEmail)
	.post('/check_verified_code', bodyValidateMiddleware(checkVerifiedCodeSchema), checkVerifiedCode);
