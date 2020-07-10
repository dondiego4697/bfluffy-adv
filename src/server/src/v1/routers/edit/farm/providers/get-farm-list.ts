import {Request, Response} from 'express';
import {omit} from 'lodash';
import {wrap} from 'async-middleware';
import {FarmDbProvider} from 'server/v1/db-provider/farm';

export const getFarmList = wrap<Request, Response>(async (req, res) => {
	const farmList = await FarmDbProvider.getFarmListByUserId(req.userData.id);

	res.json(farmList.map((item) => omit(item, 'id')));
});
