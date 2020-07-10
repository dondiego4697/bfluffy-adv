import * as express from 'express';
import {router as userRouter} from 'server/v1/routers/public/user';
import {router as animalRouter} from 'server/v1/routers/public/animal';
import {router as geoRouter} from 'server/v1/routers/public/geo';

export const router = express.Router()
	.use('/user', userRouter)
	.use('/animal', animalRouter)
	.use('/geo', geoRouter);
