import * as Boom from '@hapi/boom';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {FarmDbProvider} from 'server/v1/db-provider/farm';
import {GeoDbProvider} from 'server/v1/db-provider/geo';
import {logger} from 'server/lib/logger';
import {FarmType} from 'server/types/consts';

export interface Body {
	cityCode: string;
	type: FarmType;
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
		type,
		description,
		address
	} = req.body as Body;

	const city = await GeoDbProvider.getCityByCityCode(cityCode);
	if (!city) {
		logger.error(`invalid city code: ${cityCode}`);
		throw Boom.badRequest();
	}

	const publicId = await FarmDbProvider.createFarm({
		cityId: city.id,
		ownerId: req.userData.id,
		contacts,
		type,
		name,
		description,
		address
	});

	res.json({publicId});
});
