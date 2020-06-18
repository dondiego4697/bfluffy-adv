import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

export const auth = wrap<Request, Response>(async (_req, _res) => {

});
