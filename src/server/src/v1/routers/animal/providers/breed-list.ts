import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {AnimalDbProvider} from 'server/v1/db-provider/animal';

interface Query {
	category_code: string;
}

export const breedList = wrap<Request, Response>(async (req, res) => {
	const {category_code: categoryCode} = req.query as unknown as Query;

	const list = await AnimalDbProvider.getAnimalBreedList(categoryCode);

	res.json(list);
});
