import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {AnimalDbProvider} from 'server/v1/db-provider/animal';

export const categoryList = wrap<Request, Response>(async (_req, res) => {
	const list = await AnimalDbProvider.getAnimalCategoryList();

	res.json(list);
});
