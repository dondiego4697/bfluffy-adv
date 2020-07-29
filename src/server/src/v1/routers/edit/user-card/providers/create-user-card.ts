import * as Boom from '@hapi/boom';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {UserCardDbProvider} from 'server/v1/db-provider/user-card';
import {GeoDbProvider} from 'server/v1/db-provider/geo';
import {logger} from 'server/lib/logger';
import {FarmType} from 'server/types/consts';

export interface Body {
	cityCode: string;
	farmType: FarmType;
	contacts: {
        email?: string;
        phone?: string;
    };
	name: string;
	description?: string;
	address?: string;
}

export const createUserCard = wrap<Request, Response>(async (req, res) => {
	const {
		cityCode,
		contacts,
		name,
		farmType,
		description,
		address
	} = req.body as Body;

	const city = await GeoDbProvider.getCityByCityCode(cityCode);
	if (!city) {
		logger.error(`invalid city code: ${cityCode}`);
		throw Boom.badRequest();
	}

	const publicId = await UserCardDbProvider.createUserCard({
		cityId: city.id,
		userId: req.userData.id,
		contacts,
		farmType,
		name,
		description,
		address
	});

	res.json({publicId});
});
