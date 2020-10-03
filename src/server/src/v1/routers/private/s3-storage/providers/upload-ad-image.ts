import {Request, Response} from 'express';
import * as Boom from '@hapi/boom';
import * as fileUpload from 'express-fileupload';
import * as uuid from 'uuid';
import * as jimp from 'jimp';
import {wrap} from 'async-middleware';
import {writeToBucket} from 'server/lib/s3';
import {logger} from 'server/lib/logger';
import {config} from 'server/config';

async function processImage(buffer: Buffer): Promise<Buffer> {
    const jimpImage = await jimp.read(buffer);
    return jimpImage.normalize().getBufferAsync(jimp.MIME_JPEG);
}

export const uploadAdImage = wrap<Request, Response>(async (req, res) => {
    const {data: dataRaw} = (req.files || {}).file as fileUpload.UploadedFile;
    if (!dataRaw) {
        logger.error('empty upload image data');
        throw Boom.badRequest();
    }
    const data = await processImage(dataRaw);

    const objectName = uuid.v4();
    const {statusCode, body} = await writeToBucket(data, {objectName});

    const log = `s3 uploaded: status=${statusCode} body=${JSON.stringify(body)} objectName=${objectName}`;
    statusCode !== 200 ? logger.error(log) : logger.info(log);

    const url = `https://${config['s3.host']}/${config['s3.bucketName']}/${objectName}`;
    res.json({url});
});
