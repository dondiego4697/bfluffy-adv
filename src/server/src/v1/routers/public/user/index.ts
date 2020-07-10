import * as express from 'express';
import * as Joi from '@hapi/joi';
import {bodyValidateMiddleware, queryValidateMiddleware} from 'server/middlewares/validate';
import {signup} from 'server/v1/routers/public/user/providers/signup';
import {login} from 'server/v1/routers/public/user/providers/login';
import {resetPassword, forgotPassword} from 'server/v1/routers/public/user/providers/password';
import {checkEmail} from 'server/v1/routers/public/user/providers/validate';
import {SignUpType} from 'server/types/consts';

const signupSchema = Joi.object({
	externalToken: Joi.string(),
	email: Joi.string().email().required(),
	type: Joi.string().valid(...Object.values(SignUpType)).required(),
	name: Joi.string().required(),
	password: Joi.string().required()
});

const loginSchema = Joi.object({
	authToken: Joi.string(),
	credentials: Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required()
	})
}).xor('authToken', 'credentials');

const forgotPasswordSchema = Joi.object({
	email: Joi.string().required()
});

const checkEmailSchema = Joi.object({
	email: Joi.string().required()
});

const resetPasswordSchema = Joi.object({
	authToken: Joi.string().required(),
	newPassword: Joi.string().required()
});

export const router = express.Router()
	.post('/signup', bodyValidateMiddleware(signupSchema), signup)
	.post('/login', bodyValidateMiddleware(loginSchema), login)
	.post('/forgot_password', bodyValidateMiddleware(forgotPasswordSchema), forgotPassword)
	.post('/reset_password', bodyValidateMiddleware(resetPasswordSchema), resetPassword)
	.get('/check_email', queryValidateMiddleware(checkEmailSchema), checkEmail);
