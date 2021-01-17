import {postRequest} from 'common/lib/request';

interface CheckVerifiedCodeResponse {
    email: string;
    name: string;
    contacts: {
        phone?: string;
    };
    verified: boolean;
    authToken: string;
    avatar?: string;
}

interface UploadAvatarResponse {
    url: string;
}

interface UpdateUserParams {
    name?: string;
    contacts: {
        phone?: string;
    };
}

async function loginByEmail(email: string) {
    return postRequest<{}>('/api/v1/public/user/login_by_email', {email}, {responseType: 'json'});
}

async function checkVerifiedCode(email: string, verifiedCode: string) {
    return postRequest<CheckVerifiedCodeResponse>(
        '/api/v1/public/user/check_verified_code',
        {email, verifiedCode},
        {responseType: 'json'}
    );
}

async function checkAuthToken() {
    return postRequest<CheckVerifiedCodeResponse>('/api/v1/public/user/check_auth_token', {}, {responseType: 'json'});
}

async function updateAvatar(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return postRequest<UploadAvatarResponse>('/api/v1/private/s3_storage/update_avatar', formData, {
        responseType: 'json',
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

async function updateInfo(params: UpdateUserParams) {
    const {name, contacts} = params;

    return postRequest<{}>('/api/v1/private/user/update', {name, contacts}, {responseType: 'json'});
}

export const UserRequestBookV1 = {
    loginByEmail,
    checkVerifiedCode,
    checkAuthToken,
    updateAvatar,
    updateInfo
};
