/* eslint-disable no-undef */
import {config} from 'server/config';
import {EmailMessage} from 'server/email-message';

const host = config['host.app'];

describe('signup email message', () => {
	it('should return expected email message', async () => {
		expect(EmailMessage.signup('some_token')).toEqual({
			html: `<div>${host}/login?auth_token=some_token</div>`,
			text: `${host}/login?auth_token=some_token`
		});
	});
});
