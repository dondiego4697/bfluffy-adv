import * as express from 'express';
import * as fileUpload from 'express-fileupload';
import {updateAvatar} from 'server/v1/routers/edit/s3-storage/providers/update-avatar';

export const router = express.Router()
	.use(fileUpload())
	.post('/update_avatar', updateAvatar);
