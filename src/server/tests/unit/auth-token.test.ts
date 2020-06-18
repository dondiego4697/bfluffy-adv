/* eslint-disable no-undef */
import {AuthToken} from 'server/lib/auth-token';

const CREDENTIALS = {
	password: 'password',
	email: 'email'
};

describe('auth token methods', () => {
	it('should encode/decode token', async () => {
		const token = AuthToken.encode(CREDENTIALS);
		expect(AuthToken.decode(token)).toEqual(CREDENTIALS);
	});

	it('should throw error on invalid token', async () => {
		expect(() => AuthToken.decode('invalid_token')).toThrow();
	});
});
