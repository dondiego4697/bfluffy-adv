import * as express from 'express';
import {kindList} from 'server/v1/routers/animal/providers/kind-list';
import {breedList} from 'server/v1/routers/animal/providers/breed-list';

export const router = express.Router()
	.get('/kind_list', kindList)
	.get('/breed_list', breedList);
