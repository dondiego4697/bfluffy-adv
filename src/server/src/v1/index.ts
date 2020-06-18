import * as express from 'express';
import {auth} from 'server/middlewares/auth';
import {router as userRouter} from 'server/v1/routers/user';
import {router as pageRouter} from 'server/v1/routers/page';

export const router = express.Router()
	.use('/user', userRouter)
	.use(auth)
	.use('/page', pageRouter);
