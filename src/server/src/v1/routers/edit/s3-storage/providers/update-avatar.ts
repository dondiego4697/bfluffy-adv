import {Request, Response} from 'express';
import * as fileUpload from 'express-fileupload';
import * as uuid from 'uuid';
import {wrap} from 'async-middleware';
import {writeToBucket} from 'server/lib/s3';
import {logger} from 'server/lib/logger';
import {UserDbProvider} from 'server/v1/db-provider/user';
import {config} from 'server/config';

export const updateAvatar = wrap<Request, Response>(async (req, res) => {
	const {data} = req.files?.file as fileUpload.UploadedFile;

	const objectName = uuid.v4();
	const {statusCode, body} = await writeToBucket(data, {objectName});

	const log = `s3 uploaded: status=${statusCode} body=${JSON.stringify(body)} objectName=${objectName}`;
	statusCode !== 200 ? logger.error(log) : logger.info(log);

	const imageUrl = `https://${config['s3.host']}/${config['s3.bucketName']}/${objectName}`;
	await UserDbProvider.updateUserAvatar({
		avatar: imageUrl,
		userId: req.userData.id
	});

	res.json({imageUrl});
});
