import * as Boom from '@hapi/boom';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {UserCardDbProvider} from 'server/v1/db-provider/user-card';
import {ClientStatusCode} from 'server/types/consts';
import {logger} from 'server/lib/logger';

export const getUserCardInfo = wrap<Request, Response>(async (req, res) => {
	if (!req.userData.id) {
		throw Boom.forbidden(ClientStatusCode.USER_CARD_FORBIDDEN);
	}

	const userCard = await UserCardDbProvider.getUserCardByUserId(req.userData.id);
	if (!userCard) {
		logger.error(`user card did not found: ${req.userData.id}`);
		throw Boom.notFound();
	}

	res.json({
		publicId: userCard.publicId,
		contacts: userCard.contacts,
		name: userCard.name,
		description: userCard.description,
		address: userCard.address,
		farmType: userCard.farmType,
		createdAt: userCard.createdAt,
		updatedAt: userCard.updatedAt,
		cityCode: userCard.cityCode
	});
});
