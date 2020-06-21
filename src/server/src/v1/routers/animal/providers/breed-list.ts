import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

export const breedList = wrap<Request, Response>(async () => {});
