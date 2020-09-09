import * as express from 'express';
import {cityList} from 'server/v1/routers/public/geo/providers/city-list';

export const router = express.Router().get('/city_list', cityList);
