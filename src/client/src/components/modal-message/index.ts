import {Modal} from 'antd';

interface ShowSuccessParams {
    title: string;
    content: string;
    onOk?: () => void;
}

function showError(content: string) {
	Modal.error({
		title: 'Ошибка',
		content
	});
}

function showSuccess(params: ShowSuccessParams) {
	// TODO сделать свой стиль
	const {title, content, onOk} = params;

	Modal.success({
		title,
		content,
		...(onOk ? {onOk} : {})
	});
}

export const ModalMessage = {
	showError,
	showSuccess
};
