import * as express from 'express';
import {auth} from 'server/middlewares/auth';
import {router as editUserCardRouter} from 'server/v1/routers/edit/user-card';
import {router as editAnimalAdRouter} from 'server/v1/routers/edit/animal-ad';

export const router = express.Router()
	.use(auth)
	.use('/user_card', editUserCardRouter)
	.use('/animal_ad', editAnimalAdRouter);
