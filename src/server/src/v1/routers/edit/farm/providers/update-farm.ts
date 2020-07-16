import * as Boom from '@hapi/boom';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {FarmDbProvider} from 'server/v1/db-provider/farm';
import {GeoDbProvider} from 'server/v1/db-provider/geo';
import {logger} from 'server/lib/logger';
import {ClientStatusCode} from 'server/types/consts';
import {Body} from 'server/v1/routers/edit/farm/providers/create-farm';

interface Query {
    publicId: string;
}

export const updateFarm = wrap<Request, Response>(async (req, res) => {
	const {publicId} = req.query as unknown as Query;
	const {
		cityCode,
		contacts,
		name,
		type,
		description,
		address
	} = req.body as Body;

	const city = await GeoDbProvider.getCityByCityCode(cityCode);
	if (!city) {
		logger.error(`invalid city code: ${cityCode}`);
		throw Boom.badRequest();
	}

	const farm = await FarmDbProvider.getFarmByPublicId(publicId);
	if (!farm) {
		throw Boom.notFound(`farm with id ${publicId} did not found`);
	}

	if (req.userData.id !== farm.ownerId) {
		throw Boom.forbidden(ClientStatusCode.EDIT_FARM_FORBIDDEN);
	}

	await FarmDbProvider.updateFarm(publicId, {
		cityId: city.id,
		contacts,
		type,
		name,
		description,
		address
	});

	res.json({publicId});
});
