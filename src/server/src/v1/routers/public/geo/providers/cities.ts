import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {GeoDbProvider} from 'server/v1/db-provider/geo';

export const cities = wrap<Request, Response>(async (_req, res) => {
	const dbCities = await GeoDbProvider.getCityList();

	res.json(dbCities);
});
