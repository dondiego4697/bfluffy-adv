import * as Boom from '@hapi/boom';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {AnimalDbProvider} from 'server/v1/db-provider/animal';
import {AnimalAdDbProvider} from 'server/v1/db-provider/animal-ad';
import {logger} from 'server/lib/logger';
import {Body} from 'server/v1/routers/edit/animal-ad/providers/create-animal-ad';
import {ClientStatusCode} from 'server/types/consts';

interface Query {
    publicId: string;
}

export const updateAnimalAd = wrap<Request, Response>(async (req, res) => {
	const {publicId} = req.query as unknown as Query;
	const {
		documents,
		address,
		isBasicVaccinations,
		name,
		description,
		cost,
		sex,
		animalBreedCode
	} = req.body as Body;

	const [animalBreed, animalAd] = await Promise.all([
		AnimalDbProvider.getAnimalBreedByCode(animalBreedCode),
		AnimalAdDbProvider.getAnimalAdByPublicId(publicId)
	]);

	if (!animalAd) {
		throw Boom.notFound(`animal ad with id ${publicId} did not found`);
	}

	if (req.userData.id !== animalAd.ownerId) {
		throw Boom.forbidden(ClientStatusCode.ANIMAL_AD_FORBIDDEN);
	}

	if (!animalBreed) {
		logger.error(`invalid animal breed code: ${animalBreedCode}`);
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
		animalBreedId: animalBreed.id
	});

	res.json({publicId});
});
