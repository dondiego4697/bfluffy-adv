import {URL, URLSearchParams} from 'url';
import {config} from 'server/config';

export function signup(authToken: string) {
	const host = config['host.app'];

	const url = new URL('/login', host);
	const query = new URLSearchParams({auth_token: authToken});
	url.search = query.toString();

	return {
		html: `<div>${url.toString()}</div>`,
		text: url.toString()
	};
}
