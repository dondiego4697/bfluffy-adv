import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {GeoDbProvider} from 'server/v1/db-provider/geo';

export const cityList = wrap<Request, Response>(async (_req, res) => {
	const list = await GeoDbProvider.getCityList();
	res.json(list);
});
