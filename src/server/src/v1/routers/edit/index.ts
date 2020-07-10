import * as express from 'express';
import {auth} from 'server/middlewares/auth';
import {router as editFarmRouter} from 'server/v1/routers/edit/farm';
import {router as editAnimalAdRouter} from 'server/v1/routers/edit/animal-ad';

export const router = express.Router()
	.use(auth)
	.use('/farm', editFarmRouter)
	.use('/animal_ad', editAnimalAdRouter);
