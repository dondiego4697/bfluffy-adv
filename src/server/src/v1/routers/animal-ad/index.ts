import * as express from 'express';

export const router = express.Router()
	.get('/list')
	.get('/info')
	.post('/create')
	.post('/update')
	.post('/delete');
