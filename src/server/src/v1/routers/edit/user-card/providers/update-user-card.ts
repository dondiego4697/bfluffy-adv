import * as Boom from '@hapi/boom';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {UserCardDbProvider} from 'server/v1/db-provider/user-card';
import {GeoDbProvider} from 'server/v1/db-provider/geo';
import {logger} from 'server/lib/logger';
import {Body} from 'server/v1/routers/edit/user-card/providers/create-user-card';

export const updateUserCard = wrap<Request, Response>(async (req, res) => {
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

	const userCard = await UserCardDbProvider.getUserCardByUserId(req.userData.id);
	if (!userCard) {
		throw Boom.notFound('user card did not found');
	}

	await UserCardDbProvider.updateUserCard(req.userData.id, {
		cityId: city.id,
		contacts,
		type,
		name,
		description,
		address
	});

	res.json({});
});
