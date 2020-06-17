/* eslint-disable no-undef */
import {formEmailMessage} from 'server/v1/routers/user/providers/signup';
import {config} from 'server/config';

const host = config['host.app'];

describe('signup email message', () => {
	it('should return expected email message', async () => {
		expect(formEmailMessage('some_token')).toEqual({
			html: `<div>${host}/login?verified_token=some_token</div>`,
			text: `${host}/login?verified_token=some_token`
		});
	});
});
