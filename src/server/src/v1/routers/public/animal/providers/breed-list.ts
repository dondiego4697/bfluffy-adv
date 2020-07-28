import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {AnimalDbProvider} from 'server/v1/db-provider/animal';

export const breedList = wrap<Request, Response>(async (_req, res) => {
	const list = await AnimalDbProvider.getAnimalBreedList();
	res.json(list);
});
