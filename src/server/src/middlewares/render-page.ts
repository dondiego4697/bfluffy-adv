import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {config} from 'server/config';

export const renderPage = wrap<Request, Response>(async (_req, res) => {
    const renderConfig = {
        bundlesUrl: config['client.bundlesRootFolder']
    };

    const clientConfig = JSON.stringify({});

    res.render('main', {
        config: renderConfig,
        clientConfig
    });
});
