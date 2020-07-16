import * as Boom from '@hapi/boom';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {FarmDbProvider} from 'server/v1/db-provider/farm';
import {ClientStatusCode} from 'server/types/consts';

interface Body {
    publicId: string;
}

export const deleteFarm = wrap<Request, Response>(async (req, res) => {
	const {publicId} = req.body as Body;

	const farm = await FarmDbProvider.getFarmByPublicId(publicId);
	if (!farm) {
		throw Boom.notFound(`farm with id ${publicId} did not found`);
	}

	if (req.userData.id !== farm.ownerId) {
		throw Boom.forbidden(ClientStatusCode.EDIT_FARM_FORBIDDEN);
	}

	await FarmDbProvider.archiveFarm(publicId);

	res.json({publicId});
});
