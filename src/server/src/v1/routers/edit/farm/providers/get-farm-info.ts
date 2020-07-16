import * as Boom from '@hapi/boom';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {FarmDbProvider} from 'server/v1/db-provider/farm';
import {ClientStatusCode} from 'server/types/consts';

interface Query {
    publicId: string;
}

export const getFarmInfo = wrap<Request, Response>(async (req, res) => {
	const {publicId} = req.query as unknown as Query;

	const farm = await FarmDbProvider.getFarmByPublicId(publicId);
	if (!farm) {
		throw Boom.notFound(`farm with id ${publicId} did not found`);
	}

	if (farm.isArchive) {
		throw Boom.notFound(`farm with id ${publicId} archived`);
	}

	if (req.userData.id !== farm.ownerId) {
		throw Boom.forbidden(ClientStatusCode.EDIT_FARM_FORBIDDEN);
	}

	res.json({
		contacts: farm.contacts,
		name: farm.name,
		description: farm.description,
		address: farm.address,
		rating: farm.rating,
		createdAt: farm.createdAt,
		updatedAt: farm.updatedAt,
		farmPublicId: farm.farmPublicId,
		cityCode: farm.cityCode
	});
});
