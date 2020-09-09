import {Request, Response} from 'express';
import * as Boom from '@hapi/boom';
import * as jimp from 'jimp';
import * as fileUpload from 'express-fileupload';
import * as uuid from 'uuid';
import {wrap} from 'async-middleware';
import {writeToBucket} from 'server/lib/s3';
import {logger} from 'server/lib/logger';
import {UserDbProvider} from 'server/v1/db-provider/user';
import {config} from 'server/config';

async function cropImage(buffer: Buffer): Promise<Buffer> {
    const jimpImage = await jimp.read(buffer);

    const width = jimpImage.getWidth();
    const height = jimpImage.getHeight();
    const size = Math.min(width, height);

    const jimpImageCropped = jimpImage.crop(width / 2 - size / 2, height / 2 - size / 2, size, size).normalize();

    return jimpImageCropped.getBufferAsync(jimp.MIME_JPEG);
}

export const updateAvatar = wrap<Request, Response>(async (req, res) => {
    const {data: dataRaw} = (req.files || {}).file as fileUpload.UploadedFile;
    if (!dataRaw) {
        logger.error('empty upload avatar data');
        throw Boom.badRequest();
    }
    const data = await cropImage(dataRaw);

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
