import * as pug from 'pug';
import * as path from 'path';

export function verifiedCode(code: string) {
	const html = pug.renderFile(path.resolve('src/resources/views/verified-code.pug'), {
		code
	});

	return html;
}
