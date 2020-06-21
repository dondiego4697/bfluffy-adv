import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {UserDbProvider} from 'server/v1/db-provider/user';

interface CheckEmailQuery {
	email: string;
}

export const checkEmail = wrap<Request, Response>(async (req, res) => {
	const {email} = req.query as unknown as CheckEmailQuery;

	const user = await UserDbProvider.getUserByEmail(email);
	res.json({exist: Boolean(user)});
});
