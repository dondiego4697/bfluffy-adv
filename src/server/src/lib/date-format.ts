import * as momemt from 'moment';

export function formatCreatedDate(date: Date) {
	return momemt(date).format('YYYY-MM-DD hh:mm');
}
