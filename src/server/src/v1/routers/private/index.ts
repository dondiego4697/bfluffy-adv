import * as express from 'express';
import {router as S3StorageRouter} from 'server/v1/routers/private/s3-storage';
import {router as userRouter} from 'server/v1/routers/private/user';
import {router as animalAdRouter} from 'server/v1/routers/private/animal-ad';

export const router = express
    .Router()
    .use('/s3_storage', S3StorageRouter)
    .use('/user', userRouter)
    .use('/animal_ad', animalAdRouter);
