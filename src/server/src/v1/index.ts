import * as express from 'express';
import {auth} from 'server/middlewares/auth';
import {router as userRouter} from 'server/v1/routers/user';
import {router as pageRouter} from 'server/v1/routers/page';
import {router as animalRouter} from 'server/v1/routers/animal';
import {router as geoRouter} from 'server/v1/routers/geo';

export const router = express.Router()
	.use('/user', userRouter)
	.use('/animal', animalRouter)
	.use('/geo', geoRouter)
	.use(auth)
	.use('/page', pageRouter);
