import * as express from 'express';
import {cities} from 'server/v1/routers/public/geo/providers/cities';

export const router = express.Router()
	.get('/cities', cities);
