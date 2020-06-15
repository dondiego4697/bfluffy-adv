import * as express from 'express';
import {router as userRouter} from 'server/v1/routers/user';
import {router as pageRouter} from 'server/v1/routers/page';

export const router = express.Router()
	.use('/user', userRouter)
	.use('/page', pageRouter);
