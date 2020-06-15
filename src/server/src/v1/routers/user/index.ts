import * as express from 'express';
import * as Joi from '@hapi/joi';
import {bodyValidateMiddleware} from 'server/middlewares/validate';
import {signup} from 'server/v1/routers/user/providers/signup';
import {login} from 'server/v1/routers/user/providers/login';
import {forgotPassword} from 'server/v1/routers/user/providers/forgot-password';
import {SignUpType} from 'server/types/consts';

const signupSchema = Joi.object({
	external_token: Joi.string(),
	email: Joi.string().email().required(),
	type: Joi.string().valid(...Object.values(SignUpType)).required(),
	name: Joi.string().required(),
	password: Joi.string().required()
});

const loginSchema = Joi.object({
	email: Joi.string().required(),
	password: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
	email: Joi.string().required()
});

export const router = express.Router()
	.post('/signup', bodyValidateMiddleware(signupSchema), signup)
	.post('/login', bodyValidateMiddleware(loginSchema), login)
	.post('/forgot_password', bodyValidateMiddleware(forgotPasswordSchema), forgotPassword);
