import * as Boom from '@hapi/boom';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {FarmDbProvider} from 'server/v1/db-provider/farm';
import {GeoDbProvider} from 'server/v1/db-provider/geo';
import {logger} from 'server/lib/logger';
import {ClientStatusCode} from 'server/types/consts';
import {Body} from 'server/v1/routers/farm/providers/create-farm';

interface Query {
    publicId: string;
}

export const updateFarm = wrap<Request, Response>(async (req, res) => {
	const {publicId} = req.query as unknown as Query;
	const {
		cityCode,
		contacts,
		name,
		description,
		address
	} = req.body as Body;

	const city = await GeoDbProvider.getCityByCityCode(cityCode);
	if (!city) {
		logger.error(`Invalid city code: ${cityCode}`);
		throw Boom.badRequest();
	}

	const farm = await FarmDbProvider.getFarmByPublicId(publicId);
	if (!farm) {
		throw Boom.notFound(`Farm with id ${publicId} did not found`);
	}

	if (req.userData.id !== farm.ownerId) {
		throw Boom.forbidden(ClientStatusCode.EDIT_FARM_FORBIDDEN);
	}

	// TODO если адрес изменился -> по адресу добавлять координаты

	await FarmDbProvider.updateFarm(publicId, {
		cityId: city.id,
		contacts,
		name,
		description,
		address
	});

	res.json({publicId});
});
