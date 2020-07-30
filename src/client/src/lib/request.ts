import axios, {AxiosRequestConfig} from 'axios';

const VALID_ERRORS: Record<string, string> = {
	USER_EMAIL_EXIST: 'Пользователь с таким email уже существует',
	USER_NOT_EXIST: 'Пользователь не найден',
	USER_NOT_VERIFIED: 'Пользователь не подтвердил регистрацию',
	USER_INVALID_TOKEN: 'Неверный пользовательский токен',
	USER_NOT_AUTHORIZED: 'Пользователь не авторизован',
	USER_WRONG_VERIFIED_CODE: 'Неправильной код для авторизации',
	USER_CARD_FORBIDDEN: 'Редактирование пользовательской страницы недоступно',
	ANIMAL_AD_FORBIDDEN: 'Редактирование объявление недоступно'
};

export function getRequest<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
	return axios
		.get(url, {
			...config,
			withCredentials: true
		})
		.then((res) => res.data)
		.catch((error) => makeError(error, {}, config));
}

export function postRequest<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
	return axios
		.post(url, data, {
			...config,
			withCredentials: true
		})
		.then((res) => res.data)
		.catch((error) => makeError(error, data, config));
}

function makeError(error: any, request: any, config: any) {
	const {response} = error;
	// eslint-disable-next-line no-console
	console.log('FOR_DEVELOPERS', JSON.stringify({
		type: 'error_on_request',
		url: response.request.responseURL,
		request,
		response: response.data,
		config
	}));

	const {message} = response.data || {};

	const newError = error;
	newError.response.data.message = VALID_ERRORS[message] || 'Неизвестная ошибка';
	throw newError;
}
