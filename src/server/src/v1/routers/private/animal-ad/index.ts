import * as express from 'express';
import * as Joi from '@hapi/joi';
import {bodyValidateMiddleware, queryValidateMiddleware} from 'server/middlewares/validate';
import {createAnimalAd} from 'server/v1/routers/private/animal-ad/providers/create-animal-ad';
import {updateAnimalAd} from 'server/v1/routers/private/animal-ad/providers/update-animal-ad';
import {getAnimalAd} from 'server/v1/routers/private/animal-ad/providers/get-animal-ad';
import {getUserAnimalAdList} from 'server/v1/routers/private/animal-ad/providers/get-user-animal-ad-list';

const createSchema = {
    body: Joi.object({
        animalBreedCode: Joi.string().required(),
        cityCode: Joi.string().required(),
        birthday: Joi.date().empty('').allow(null),
        sex: Joi.object({
            male: Joi.boolean(),
            female: Joi.boolean()
        }).default({}),
        cost: Joi.number().min(0).required(),
        title: Joi.string().required(),
        description: Joi.string().empty('').allow(null),
        address: Joi.string().empty('').allow(null),
        isBasicVaccinations: Joi.boolean().default(false),
        documents: Joi.object({
            vetPassport: Joi.boolean(),
            genericMark: Joi.boolean(),
            pedigree: Joi.boolean(),
            contractOfSale: Joi.boolean(),
            withoutDocuments: Joi.boolean()
        }).default({}),
        imageUrls: Joi.array().items(Joi.string()).default([])
    }),
    query: Joi.object({
        publicId: Joi.string().uuid().required()
    })
};

export const router = express
    .Router()
    .get('/list', getUserAnimalAdList)
    .get('/info', queryValidateMiddleware(createSchema.query), getAnimalAd)
    .post('/create', bodyValidateMiddleware(createSchema.body), createAnimalAd)
    .post(
        '/update',
        queryValidateMiddleware(createSchema.query),
        bodyValidateMiddleware(createSchema.body),
        updateAnimalAd
    )
    .post('/add_view')
    .post('/delete');
