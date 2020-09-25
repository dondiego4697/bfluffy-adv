import * as Boom from '@hapi/boom';
import {difference} from 'lodash';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {AnimalDbProvider} from 'server/v1/db-provider/animal';
import {AnimalAdDbProvider} from 'server/v1/db-provider/animal-ad';
import {GeoDbProvider} from 'server/v1/db-provider/geo';
import {logger} from 'server/lib/logger';
import {Body} from 'server/v1/routers/edit/animal-ad/providers/create-animal-ad';
import {ClientStatusCode} from 'server/types/consts';

interface Query {
    publicId: string;
}

export const updateAnimalAd = wrap<Request, Response>(async (req, res) => {
    const {publicId} = (req.query as unknown) as Query;
    const {
        documents,
        address,
        isBasicVaccinations,
        name,
        description,
        cityCode,
        cost,
        sex,
        animalBreedCode,
        imageUrls
    } = req.body as Body;

    const [animalBreed, animalAd, city] = await Promise.all([
        AnimalDbProvider.getAnimalBreedByCode(animalBreedCode),
        AnimalAdDbProvider.getAnimalAdByPublicId(publicId),
        GeoDbProvider.getCityByCityCode(cityCode)
    ]);

    if (!animalAd) {
        logger.error(`animal ad with id ${publicId} did not found`);
        throw Boom.notFound();
    }

    if (req.userData.id !== animalAd.ownerId) {
        throw Boom.forbidden(ClientStatusCode.ANIMAL_AD_FORBIDDEN);
    }

    if (!animalBreed) {
        logger.error(`invalid animal breed code: ${animalBreedCode}`);
        throw Boom.badRequest();
    }

    if (!city) {
        logger.error(`invalid city code: ${cityCode}`);
        throw Boom.badRequest();
    }

    await AnimalAdDbProvider.updateAnimalAd(publicId, {
        name,
        address,
        description,
        isBasicVaccinations,
        documents,
        cost,
        sex,
        animalBreedId: animalBreed.id,
        cityId: city.id
    });

    const currentImageUrls = await AnimalAdDbProvider.getAnimalAdImages(animalAd.id);
    const forInsertUrls = difference(imageUrls, currentImageUrls);
    const forDeleteUrls = difference(currentImageUrls, imageUrls);

    await AnimalAdDbProvider.updateAnimalAdImages({
        animalAdId: animalAd.id,
        forDeleteUrls,
        forInsertUrls
    });

    res.json({publicId});
});
