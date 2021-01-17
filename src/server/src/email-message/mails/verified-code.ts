import * as pug from 'pug';
import * as path from 'path';

export function verifiedCode(code: string) {
    // TODO переделать систему отправки сообщений
    // TODO подумать над своей

    const html = pug.renderFile(path.resolve('src/resources/views/verified-code.pug'), {
        code
    });

    return html;
}
