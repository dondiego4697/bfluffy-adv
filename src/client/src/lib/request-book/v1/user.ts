import {postRequest} from 'client/lib/request';

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

interface UpdateUserResponse {}

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

async function uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return postRequest<UploadAvatarResponse>('/api/v1/edit/s3_storage/update_avatar', formData, {
        responseType: 'json',
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

async function updateInfo(params: UpdateUserParams) {
    const {name, contacts} = params;

    return postRequest<UpdateUserResponse>('/api/v1/edit/user/update', {name, contacts}, {responseType: 'json'});
}

export const UserRequestBookV1 = {
    loginByEmail,
    checkVerifiedCode,
    checkAuthToken,
    uploadAvatar,
    updateInfo
};
