/* eslint-disable no-undef */
import {formEmailMessage} from 'server/v1/routers/user/providers/password';
import {config} from 'server/config';

const host = config['host.app'];

describe('forgot password email message', () => {
	it('should return expected email message', async () => {
		expect(formEmailMessage('some_token')).toEqual({
			html: `<div>${host}/reset_password?auth_token=some_token</div>`,
			text: `${host}/reset_password?auth_token=some_token`
		});
	});
});
