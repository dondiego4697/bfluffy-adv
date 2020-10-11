import * as browserCookie from 'browser-cookies';
import {observable, action} from 'mobx';
import {groupBy} from 'lodash';

import {UserRequestBookV1} from 'common/lib/request-book/v1/user';
import {AnimalRequestBookV1, AnimalBreed} from 'common/lib/request-book/v1/animal';
import {GeoRequestBookV1, City} from 'common/lib/request-book/v1/geo';

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

interface AnimalCategory {
    code: string;
    displayName: string;
}

type AnimalCategoryCode = string;

export class GeneralDataModel {
    @observable public clientConfig: ClientConfig | null = null;
    @observable public user: User | null = null;
    @observable public animalBreedHash: Record<AnimalCategoryCode, AnimalBreed[]> = {};
    @observable public animalCategoryList: AnimalCategory[] = [];
    @observable public cityList: City[] = [];

    @observable public isInitReady: boolean = false;

    constructor() {
        this.loadClientConfig();
        this.load();
    }

    @action private loadClientConfig() {
        const node = window.document.getElementsByClassName('config-view')[0];
        if (node) {
            this.clientConfig = node.textContent ? JSON.parse(node.textContent) : null;
        }
    }

    @action private load() {
        Promise.all([this.signIn(), this.loadAnimals(), this.loadGeo()]).then(() => (this.isInitReady = true));
    }

    @action private loadAnimals() {
        this.animalBreedHash = {};
        this.animalCategoryList = [];

        return AnimalRequestBookV1.getBreedList().then((response) => {
            this.animalBreedHash = groupBy(response, ({categoryCode}) => categoryCode);

            Object.entries(this.animalBreedHash).forEach(([code, items]) => {
                this.animalCategoryList.push({
                    code,
                    displayName: items[0].categoryDisplayName
                });
            });
        });
    }

    @action private loadGeo() {
        this.cityList = [];

        return GeoRequestBookV1.getCityList().then((response) => {
            this.cityList = response;
        });
    }

    @action public signIn() {
        const authToken = this.getAuthTokenFromCookie();
        if (authToken) {
            return this.loginByAuthToken();
        }

        return Promise.resolve();
    }

    @action public loginByAuthToken() {
        return UserRequestBookV1.checkAuthToken()
            .then((response) =>
                this.saveUser({
                    email: response.email,
                    name: response.name,
                    contacts: response.contacts,
                    verified: response.verified,
                    avatar: response.avatar
                })
            )
            .catch((error) => {
                if (error.response.status === 400) {
                    this.deleteUser();
                }
            });
    }

    @action public getAuthTokenFromCookie() {
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
