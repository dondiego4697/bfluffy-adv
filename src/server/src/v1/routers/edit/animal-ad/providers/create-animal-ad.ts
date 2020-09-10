import * as Boom from '@hapi/boom';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {AnimalDbProvider} from 'server/v1/db-provider/animal';
import {AnimalAdDbProvider} from 'server/v1/db-provider/animal-ad';
import {DBTableAnimalAd} from 'server/types/db/animal-ad';
import {logger} from 'server/lib/logger';

export interface Body {
    documents: DBTableAnimalAd.FieldDocuments;
    isBasicVaccinations: boolean;
    description: string;
    name: string;
    cost: number;
    sex: boolean;
    animalBreedCode: string;
    address?: string;
    imageUrls: string[];
}

export const createAnimalAd = wrap<Request, Response>(async (req, res) => {
    const {
        documents,
        address,
        isBasicVaccinations,
        name,
        description,
        cost,
        sex,
        animalBreedCode,
        imageUrls
    } = req.body as Body;

    const animalBreed = await AnimalDbProvider.getAnimalBreedByCode(animalBreedCode);

    if (!animalBreed) {
        logger.error(`invalid animal breed code: ${animalBreedCode}`);
        throw Boom.badRequest();
    }

    const {id, publicId} = await AnimalAdDbProvider.createAnimalAd({
        name,
        address,
        description,
        isBasicVaccinations,
        documents,
        cost,
        sex,
        animalBreedId: animalBreed.id,
        ownerId: req.userData.id
    });

    if (imageUrls.length > 0) {
        await AnimalAdDbProvider.updateAnimalAdImages({
            animalAdId: id,
            forInsertUrls: imageUrls,
            forDeleteUrls: []
        });
    }

    res.json({publicId});
});
