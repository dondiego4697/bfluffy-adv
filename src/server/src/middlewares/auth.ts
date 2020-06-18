import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

export const auth = wrap<Request, Response>(async (req) => {
	console.log(req.query);
});
