import {AuthToken} from 'server/lib/auth-token';

const CREDENTIALS = {
	email: 'email',
	verifiedCode: 'verifiedCode'
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
