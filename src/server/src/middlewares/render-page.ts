import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

export const renderPage = wrap<Request, Response>(async (_req, res) => {
	const renderConfig = {
		bundlesUrl: '/bundles/',
	};

	const clientConfig = JSON.stringify({});

	res.render('main', {
		config: renderConfig,
		clientConfig,
	});
});
