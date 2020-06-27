import * as express from 'express';
import {regionsHash} from 'server/v1/routers/geo/providers/regions-hash';

export const router = express.Router()
	.get('/regions_hash', regionsHash);
