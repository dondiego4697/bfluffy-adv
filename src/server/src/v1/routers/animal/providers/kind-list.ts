import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

export const kindList = wrap<Request, Response>(async () => {});
