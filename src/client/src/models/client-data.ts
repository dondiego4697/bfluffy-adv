import {observable, action} from 'mobx';
import * as browserCookie from 'browser-cookies';

import {DataState} from 'client/consts';
import {UserRequestBookV1} from 'client/lib/request-book/v1/user';

interface ClientConfig {}

interface User {
	email: string;
	name: string;
}

export class ClientDataModel {
    @observable public clientConfig: ClientConfig | null = null;

	@observable public user: User | null = null;

    @observable public state: DataState = DataState.READY;

    constructor() {
    	// eslint-disable-next-line no-undef
    	const node = window.document.getElementsByClassName('config-view')[0];
    	if (node) {
    		this.clientConfig = node.textContent ? JSON.parse(node.textContent) : null;
    	}

    	this.initClientDataModel();
    }

	@action public initClientDataModel() {
    	const authToken = this.getUserAuthToken();
    	if (authToken) {
    		this.loginByAuthToken(authToken);
    	}
    }

	@action public loginByAuthToken(authToken: string) {
		return UserRequestBookV1.loginByAuthToken(authToken)
			.then((response) => this.saveUser({
				name: response.name,
				email: response.email
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
