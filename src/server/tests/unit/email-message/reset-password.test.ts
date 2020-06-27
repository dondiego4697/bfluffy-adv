/* eslint-disable no-undef */
import {EmailMessage} from 'server/email-message';
import {config} from 'server/config';

const host = config['host.app'];

describe('reset password email message', () => {
	it('should return expected email message', async () => {
		expect(EmailMessage.resetPassword('some_token')).toEqual({
			html: `<div>${host}/reset_password?auth_token=some_token</div>`,
			text: `${host}/reset_password?auth_token=some_token`
		});
	});
});
