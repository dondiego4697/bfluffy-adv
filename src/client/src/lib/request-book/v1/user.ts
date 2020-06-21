import {postRequest, getRequest} from 'client/lib/request';

interface SignUpByEmailParams {
    email: string;
    name: string;
    password: string;
}

interface LogInByCredentialsParams {
    email: string;
    password: string;
}

interface ResetPasswordParams {
    authToken: string;
    newPassword: string;
}

interface LoginResponse {
    email: string;
    name: string;
    authToken: string;
}

interface CheckEmailResponse {
    exist: boolean;
}

async function signUpByEmail(params: SignUpByEmailParams) {
	const {email, name, password} = params;

	return postRequest<{}>(
		'/api/v1/user/signup',
		{
			email,
			name,
			password,
			type: 'email'
		},
		{
			responseType: 'json'
		}
	);
}

async function loginByAuthToken(authToken: string) {
	return postRequest<LoginResponse>(
		'/api/v1/user/login',
		{
			auth_token: authToken
		},
		{
			responseType: 'json'
		}
	);
}

async function logInByCredentials(params: LogInByCredentialsParams) {
	const {email, password} = params;

	return postRequest<LoginResponse>(
		'/api/v1/user/login',
		{
			credentials: {email, password}
		},
		{
			responseType: 'json'
		}
	);
}

async function forgotPassword(email: string) {
	return postRequest<{}>(
		'/api/v1/user/forgot_password',
		{
			email
		},
		{
			responseType: 'json'
		}
	);
}

async function resetPassword(params: ResetPasswordParams) {
	const {authToken, newPassword} = params;

	return postRequest<{}>(
		'/api/v1/user/reset_password',
		{
			auth_token: authToken,
			new_password: newPassword
		},
		{
			responseType: 'json'
		}
	);
}

async function checkEmail(email: string) {
	return getRequest<CheckEmailResponse>('/api/v1/user/check_email', {
		params: {email},
		responseType: 'json'
	});
}

export const UserRequestBookV1 = {
	checkEmail,
	loginByAuthToken,
	logInByCredentials,
	signUpByEmail,
	forgotPassword,
	resetPassword
};
