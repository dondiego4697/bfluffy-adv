import * as moment from 'moment';

export function formatCreatedDate(date: Date) {
    return moment(date).format('YYYY-MM-DD hh:mm');
}
