import * as Boom from '@hapi/boom';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {FarmDbProvider} from 'server/v1/db-provider/farm';
import {GeoDbProvider} from 'server/v1/db-provider/geo';
import {logger} from 'server/lib/logger';
import {ClientStatusCode} from 'server/types/consts';

interface Body {
    cityCode: string;
	contacts: {
        email?: string;
        phone?: string;
    };
	name: string;
	description?: string;
	address: string;
}

export const createFarm = wrap<Request, Response>(async (req, res) => {
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

	if (!req.userData.id) {
		throw Boom.unauthorized(ClientStatusCode.USER_NOT_AUTHORIZED);
	}

	const publicId = await FarmDbProvider.createFarm({
		cityId: city.id,
		ownerId: req.userData.id,
		contacts,
		name,
		description,
		address
	});

	res.json({publicId});
});
