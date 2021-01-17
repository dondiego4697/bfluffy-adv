import * as express from 'express';
import {breedList} from 'server/v1/routers/public/animal/providers/breed-list';

export const router = express.Router().get('/breed_list', breedList);
