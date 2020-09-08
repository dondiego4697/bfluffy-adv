import {observable, action} from 'mobx';
import * as browserCookie from 'browser-cookies';

import {DataState} from 'client/consts';
import {UserRequestBookV1} from 'client/lib/request-book/v1/user';

interface ClientConfig {}

interface User {
	email: string;
	name?: string;
	contacts: {
		phone?: string;
	};
	verified: boolean;
	avatar?: string;
}

export class ClientDataModel {
    @observable public clientConfig: ClientConfig | null = null;

	@observable public user: User | null = null;

    @observable public state: DataState = DataState.LOADING;

    constructor() {
    	const node = window.document.getElementsByClassName('config-view')[0];
    	if (node) {
    		this.clientConfig = node.textContent ? JSON.parse(node.textContent) : null;
    	}

    	this.initClientDataModel().finally(() => {
    		this.state = DataState.READY;
    	});
    }

	@action public initClientDataModel() {
    	const authToken = this.getUserAuthToken();
    	if (authToken) {
    		return this.loginByAuthToken();
    	}

    	return Promise.resolve();
    }

	@action public loginByAuthToken() {
		return UserRequestBookV1.checkAuthToken()
			.then((response) => this.saveUser({
				email: response.email,
				name: response.name,
				contacts: response.contacts,
				verified: response.verified,
				avatar: response.avatar
			}));
	}

	@action public getUserAuthToken() {
		return browserCookie.get('auth_token');
	}

	@action public saveUser(user: User) {
		this.user = user;
	}

	@action public deleteUser() {
		this.user = null;
		browserCookie.erase('auth_token');
	}
}
