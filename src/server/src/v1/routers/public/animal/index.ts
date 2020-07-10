import * as express from 'express';
import * as Joi from '@hapi/joi';
import {categoryList} from 'server/v1/routers/public/animal/providers/category-list';
import {breedList} from 'server/v1/routers/public/animal/providers/breed-list';
import {queryValidateMiddleware} from 'server/middlewares/validate';

const getBreedListSchema = Joi.object({
	category_code: Joi.string().required()
});

export const router = express.Router()
	.get('/category_list', categoryList)
	.get('/breed_list', queryValidateMiddleware(getBreedListSchema), breedList);
