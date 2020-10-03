import * as Boom from '@hapi/boom';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {AnimalAdDbProvider} from 'server/v1/db-provider/animal-ad';
import {logger} from 'server/lib/logger';
import {ClientStatusCode} from 'server/types/consts';

interface Query {
    publicId: string;
}

export const getAnimalAd = wrap<Request, Response>(async (req, res) => {
    const {publicId} = (req.query as unknown) as Query;

    const animalAd = await AnimalAdDbProvider.getAnimalAdByPublicId(publicId);

    if (!animalAd) {
        logger.error(`animal ad with id ${publicId} did not found`);
        throw Boom.notFound();
    }

    if (req.userData.id !== animalAd.ownerId) {
        throw Boom.forbidden(ClientStatusCode.ANIMAL_AD_FORBIDDEN);
    }

    const imageUrls = await AnimalAdDbProvider.getAnimalAdImages(animalAd.id);

    res.json({
        cost: animalAd.cost,
        sex: animalAd.sex,
        name: animalAd.name,
        description: animalAd.description,
        address: animalAd.address,
        documents: animalAd.documents,
        animalBreedCode: animalAd.animalBreedCode,
        animalCategoryCode: animalAd.animalCategoryCode,
        cityCode: animalAd.cityCode,
        imageUrls
    });
});
