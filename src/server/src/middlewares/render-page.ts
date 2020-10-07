import * as MobileDetect from 'mobile-detect';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {config} from 'server/config';

export const renderPage = wrap<Request, Response>(async (req, res) => {
    const mobileDetect = new MobileDetect(req.headers['user-agent'] || '');
    const bundleType = mobileDetect.mobile() ? 'touch' : 'desktop';

    const renderConfig = {
        bundlesUrl: `${config['client.bundlesRootFolder']}${bundleType}`
    };

    const clientConfig = JSON.stringify({});

    res.render('main', {
        config: renderConfig,
        clientConfig
    });
});
