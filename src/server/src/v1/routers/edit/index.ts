import * as express from 'express';
import {auth} from 'server/middlewares/auth';
import {router as editS3Storage} from 'server/v1/routers/edit/s3-storage';
import {router as editUserCardRouter} from 'server/v1/routers/edit/user-card';
import {router as editAnimalAdRouter} from 'server/v1/routers/edit/animal-ad';

export const router = express.Router()
	.use(auth)
	.use('/s3_storage', editS3Storage)
	.use('/user_card', editUserCardRouter)
	.use('/animal_ad', editAnimalAdRouter);
