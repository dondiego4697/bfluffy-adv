import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import * as NodeCache from 'node-cache';
import {UserDbProvider} from 'server/v1/db-provider/user';

const cache = new NodeCache();

interface CheckEmailQuery {
	email: string;
}

export const checkEmail = wrap<Request, Response>(async (req, res) => {
	const {email} = req.query as unknown as CheckEmailQuery;

	const exist = cache.get(email);
	if (exist) {
		res.json({exist: Boolean(exist)});
		return;
	}

	const user = await UserDbProvider.getUserByEmail(email);
	if (user) {
		cache.set(user.email, true, 60);
	}

	res.json({exist: Boolean(user)});
});
