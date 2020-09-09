import * as express from 'express';
import * as Joi from '@hapi/joi';
import {bodyValidateMiddleware, queryValidateMiddleware} from 'server/middlewares/validate';
import {createAnimalAd} from 'server/v1/routers/edit/animal-ad/providers/create-animal-ad';
import {updateAnimalAd} from 'server/v1/routers/edit/animal-ad/providers/update-animal-ad';

const createSchema = {
    body: Joi.object({
        animalBreedCode: Joi.string().required(),
        sex: Joi.boolean().required(),
        cost: Joi.number().min(0).required(),
        name: Joi.string().required(),
        description: Joi.string().empty('').allow(null),
        address: Joi.string().empty('').allow(null),
        isBasicVaccinations: Joi.boolean().default(false),
        documents: Joi.object({
            vetPassport: Joi.boolean().optional(),
            genericMark: Joi.boolean().optional(),
            pedigree: Joi.boolean().optional(),
            contractOfSale: Joi.boolean().optional(),
            withoutDocuments: Joi.boolean().optional()
        }).default({})
    }),
    query: Joi.object({
        publicId: Joi.string().uuid().required()
    })
};

export const router = express
    .Router()
    .get('/list')
    .get('/info')
    .post('/add_view')
    .post('/create', bodyValidateMiddleware(createSchema.body), createAnimalAd)
    .post(
        '/update',
        queryValidateMiddleware(createSchema.query),
        bodyValidateMiddleware(createSchema.body),
        updateAnimalAd
    )
    .post('/delete');
