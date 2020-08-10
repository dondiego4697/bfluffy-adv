import {postRequest} from 'client/lib/request';

interface CheckVerifiedCodeResponse {
    email: string;
    verified: boolean;
	authToken: string;
	avatar?: string;
}

async function loginByEmail(email: string) {
	return postRequest<{}>(
		'/api/v1/public/user/login_by_email',
		{email},
		{responseType: 'json'}
	);
}

async function checkVerifiedCode(email: string, verifiedCode: string) {
	return postRequest<CheckVerifiedCodeResponse>(
		'/api/v1/public/user/check_verified_code',
		{email, verifiedCode},
		{responseType: 'json'}
	);
}

async function checkAuthToken() {
	return postRequest<CheckVerifiedCodeResponse>(
		'/api/v1/public/user/check_auth_token',
		{},
		{responseType: 'json'}
	);
}

export const UserRequestBookV1 = {
	loginByEmail,
	checkVerifiedCode,
	checkAuthToken
};
