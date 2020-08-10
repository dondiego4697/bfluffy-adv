import {createHmac} from 'crypto';
import * as got from 'got';
import {config} from 'server/config';

interface Params {
    objectName: string;
}

interface SignParams {
    verb: string;
    resource: string;
    headers: Record<string, string>;
    secret: string;
}

function sign(params: SignParams) {
	const {
		verb, resource, headers, secret
	} = params;
	const lowerCaseHeaders: Record<string, string> = {};

	Object.keys(headers).forEach((header) => {
		lowerCaseHeaders[header.toLowerCase()] = headers[header];
	});

	const res = [
		verb,
		lowerCaseHeaders['content-md5'] || '',
		lowerCaseHeaders['content-type'] || '',
		''
	];

	Object.keys(lowerCaseHeaders)
		.filter((header) => header.indexOf('x-amz-') === 0)
		.sort((a, b) => {
			if (a > b) {
				return 1;
			} if (a < b) {
				return -1;
			}

			return 0;
		})
		.forEach((header) => res.push(`${header}:${lowerCaseHeaders[header]}`));

	res.push(resource);

	return createHmac('sha1', secret)
		.update(res.join('\n'))
		.digest('base64');
}

export async function writeToBucket(content: Buffer, params: Params) {
	const {objectName} = params;
	const method = 'PUT';
	const headers: Record<string, string> = {
		'x-amz-date': (new Date()).toUTCString()
	};

	const signature = sign({
		verb: method,
		resource: `/${config['s3.bucketName']}/${objectName}`,
		headers,
		secret: config['s3.secret']
	});
	headers.authorization = `AWS ${config['s3.key']}:${signature}`;

	const {body, statusCode} = await got.default.put(
		`http://${config['s3.bucketName']}.${config['s3.host']}/${objectName}`,
		{
			headers,
			body: content,
			encoding: undefined,
			retry: 0,
			timeout: 5000,
			throwHttpErrors: false
		}
	);

	return {statusCode, body};
}
