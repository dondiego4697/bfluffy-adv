import {createUser} from 'server/v1/db-provider/user/api/create-user';
import {verifiedUser, updateUserInfo, updateVerifiedCodeByEmail} from 'server/v1/db-provider/user/api/update-user';
import {getUserByEmail, getUserById} from 'server/v1/db-provider/user/api/get-user';
import {updateUserAvatar} from 'server/v1/db-provider/user/api/update-user-avatar';

export const UserDbProvider = {
    createUser,
    updateVerifiedCodeByEmail,
    verifiedUser,
    getUserByEmail,
    getUserById,
    updateUserAvatar,
    updateUserInfo
};
